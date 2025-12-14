import { Op } from "sequelize";
import Officer from "../models/Officer.model.js";
import PoliceStation from "../models/PoliceStation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateOfficierToken = (officer) => {
  const token = jwt.sign(
    {
      id: officer.officer_id,
      cnic: officer.cnic,
    },
    process.env.OFFICIERJWYSECRET,
    { expiresIn: "30m" }
  );
  return token;
};

const createOfficer = asyncHandler(async (req, res) => {
  try {
    const { station_id, name, badge_no, cnic, officer_rank, email, password } =
      req.body;

    if (!station_id || !name || !badge_no || !cnic || !email || !password) {
      throw new ApiError(400, "Required fields are missing");
    }

    const station = await PoliceStation.findByPk(station_id);
    if (!station) {
      throw new ApiError(404, "Police station not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const officer = await Officer.create({
      station_id,
      name,
      badge_no,
      cnic,
      officer_rank,
      email,
      password: hashedPassword,
    });

    const data = officer.toJSON();
    delete data.password;

    return res
      .status(201)
      .json(new ApiResponse(201, data, "Officer created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to create officer");
  }
});

const loginOfficier = asyncHandler(async (req, res) => {
  try {
    const { badge_no, cnic, email, password } = req.body;

    if (!email && !badge_no && !cnic) {
      throw new ApiError(400, "emial, cnic or badge_no required.");
    }
    if (!password) {
      throw new ApiError(400, "password is required.");
    }

    const officer = await Officer.findOne({
      where: {
        [Op.or]: [
          email ? { email } : null,
          badge_no ? { badge_no } : null,
          cnic ? { cnic } : null,
        ].filter(Boolean),
      },
    });

    if (!officer) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isCorrectPass = await bcrypt.compare(password, officer.password);

    if (!isCorrectPass) {
      throw new ApiError(401, "Incorrect Password!");
    }

    const token = generateOfficierToken(officer);

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 60 * 1000,
    };

    const data = officer.toJSON();
    delete data.password;

    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json(new ApiResponse(201, data, "Login successfully."));
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while logging Officier.`,
      error
    );
  }
});

const logoutOfficier = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .json(new ApiResponse(200, {}, "Officier Logged Out Successfully"));
});

const getAllOfficers = asyncHandler(async (req, res) => {
  try {
    const officers = await Officer.findAll({
      attributes: { exclude: ["password"] },
      include: {
        model: PoliceStation,
        attributes: ["station_id", "name", "district", "province"],
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, officers, "Officers fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch officers");
  }
});

const getOfficerById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const officer = await Officer.findByPk(id, {
      include: PoliceStation,
    });

    if (!officer) {
      throw new ApiError(404, "Officer not found");
    }

    const data = officer.toJSON();
    delete data.password;

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Officer fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch officer");
  }
});

const updateOfficer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { station_id, name, badge_no, cnic, officer_rank, email } = req.body;

    const officer = await Officer.findByPk(id);

    if (!officer) {
      throw new ApiError(404, "Officer not found");
    }

    if (station_id) {
      const station = await PoliceStation.findByPk(station_id);
      if (!station) {
        throw new ApiError(404, "Police station not found");
      }
    }

    await officer.update({
      station_id: station_id ?? officer.station_id,
      name: name ?? officer.name,
      badge_no: badge_no ?? officer.badge_no,
      cnic: cnic ?? officer.cnic,
      officer_rank: officer_rank ?? officer.officer_rank,
      email: email ?? officer.email,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, officer, "Officer updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to update officer");
  }
});

const deleteOfficer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const officer = await Officer.findByPk(id);

    if (!officer) {
      throw new ApiError(404, "Officer not found");
    }

    await officer.destroy();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Officer deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to delete officer");
  }
});

export {
  createOfficer,
  getAllOfficers,
  getOfficerById,
  updateOfficer,
  deleteOfficer,
  loginOfficier,
  logoutOfficier,
};
