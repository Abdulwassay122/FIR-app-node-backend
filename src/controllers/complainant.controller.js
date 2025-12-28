import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Complainant from "../models/Complainant.model.js";
import { Op, Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateComplainantToken = (complainant) => {
  const token = jwt.sign(
    {
      id: complainant.complainant_id,
      cnic: complainant.cnic,
    },
    process.env.COMPLAINANTJWYSECRET,
    { expiresIn: "30m" }
  );
  return token;
};

const createComplainant = asyncHandler(async (req, res) => {
  try {
    const { name, phone, cnic, address, email, password } = req.body;

    if (!name) throw new ApiError(400, "Name is required");
    if (!phone) throw new ApiError(400, "Phone is required");
    if (!cnic) throw new ApiError(400, "CNIC is required");
    if (!email) throw new ApiError(400, "email is required");
    if (!password) throw new ApiError(400, "password is required");

    const existing = await Complainant.findOne({
      where: {
        // either same CNIC or same name
        [Sequelize.Op.or]: [{ phone }, { cnic }, { email }],
      },
    });

    if (existing) {
      throw new ApiError(
        400,
        `Complainant with the same phone email or CNIC already exists.`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newComplainant = await Complainant.create({
      name,
      phone,
      cnic,
      address: address || "",
      email,
      password: hashedPassword,
    });

    const data = newComplainant.toJSON();
    delete data.password;

    return res
      .status(201)
      .json(new ApiResponse(201, data, "Complainant created successfully."));
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while creating complainant.`,
      error
    );
  }
});

const loginComplainant = asyncHandler(async (req, res) => {
  try {
    const { phone, cnic, email, password } = req.body;

    if (!email && !phone && !cnic) {
      throw new ApiError(400, "emial, cnic or phone required.");
    }
    if (!password) {
      throw new ApiError(400, "password is required.");
    }

    const complainant = await Complainant.findOne({
      where: {
        [Op.or]: [
          email ? { email } : null,
          phone ? { phone } : null,
          cnic ? { cnic } : null,
        ].filter(Boolean),
      },
    });

    if (!complainant) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isCorrectPass = await bcrypt.compare(password, complainant.password);

    if (!isCorrectPass) {
      throw new ApiError(401, "Incorrect Password!");
    }

    const token = generateComplainantToken(complainant);

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 60 * 1000,
    };

    const data = complainant.toJSON();
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
      `Somthing went wrong while logging complainant.`,
      error
    );
  }
});

const logoutComplainant = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .json(new ApiResponse(200, {}, "Complainant Logged Out Successfully"));
});

const getAllComplainant = asyncHandler(async (req, res) => {
  try {
    const { q } = req.query; // get q from query params
    const whereClause = {};

    if (q && q.trim() !== "") {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { phone: { [Op.like]: `%${q}%` } },
        { cnic: { [Op.like]: `%${q}%` } },
        { address: { [Op.like]: `%${q}%` } },
      ];
    }

    const complainants = await Complainant.findAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, complainants, "Complainants fetched successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to fetch complainants");
  }
});

const getComplainantById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "id is required.");
    }

    const complainant = await Complainant.findOne({
      where: { complainant_id: id },
    });

    if (!complainant) {
      throw new ApiError(400, "No Complainant with id found.");
    }

    const data = complainant.toJSON();
    delete data.password;

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Complainant fetched successfully."));
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while creating complainant.`,
      error
    );
  }
});

const updateComplainant = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, cnic, address, email } = req.body;

    if (!id) throw new ApiError(400, "ID is required.");

    const complainant = await Complainant.findOne({
      where: { complainant_id: id },
    });

    if (!complainant) {
      throw new ApiError(404, `No complainant found with ID ${id}.`);
    }

    // Optional: Check for duplicate CNIC or phone before updating
    const duplicate = await Complainant.findOne({
      where: {
        complainant_id: { [Sequelize.Op.ne]: id },
        [Sequelize.Op.or]: [
          cnic ? { cnic } : null,
          phone ? { phone } : null,
          email ? { email } : null,
        ],
      },
    });

    if (duplicate) {
      throw new ApiError(
        400,
        "Another complainant with the same email CNIC or phone exists."
      );
    }

    // Update fields
    complainant.name = name || complainant.name;
    complainant.phone = phone || complainant.phone;
    complainant.cnic = cnic || complainant.cnic;
    complainant.address = address || complainant.address;
    complainant.email = email || complainant.email;

    await complainant.save();

    const data = complainant.toJSON();
    delete data.password;

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Complainant updated successfully."));
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while updating complainant.`,
      error
    );
  }
});

const deleteComplainant = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "ID is required.");

    const complainant = await Complainant.findOne({
      where: { complainant_id: id },
    });

    if (!complainant) {
      throw new ApiError(404, `No complainant found with ID ${id}.`);
    }

    const deleteedComplaianat = await Complainant.destroy({
      where: { complainant_id: id },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deleteedComplaianat,
          "Complainant deleted successfully."
        )
      );
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while deleting complainant.`,
      error
    );
  }
});

const getComplainant = asyncHandler(async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.complainant, "Complainant Found Successfully")
      );
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while updating complainant.`,
      error
    );
  }
});
export {
  createComplainant,
  getAllComplainant,
  getComplainantById,
  updateComplainant,
  deleteComplainant,
  loginComplainant,
  logoutComplainant,
  getComplainant,
};
