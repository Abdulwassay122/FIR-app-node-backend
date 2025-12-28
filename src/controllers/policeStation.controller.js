import { Op } from "sequelize";
import PoliceStation from "../models/PoliceStation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Officer from "../models/Officer.model.js";

const createStation = asyncHandler(async (req, res) => {
  try {
    const { name, district, province, city } = req.body;

    if (!name || !district || !province || !city) {
      throw new ApiError(400, "All fields are required");
    }

    const station = await PoliceStation.create({
      name,
      district,
      province,
      city,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, station, "Police station created successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to create police station");
  }
});

const getAllStations = asyncHandler(async (req, res) => {
  try {
    const { q } = req.query;
    const andConditions = [];

    // Single `q` search across multiple fields (partial match, any field)
    if (q) {
      andConditions.push({
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { district: { [Op.like]: `%${q}%` } },
          { city: { [Op.like]: `%${q}%` } },
          { province: { [Op.like]: `%${q}%` } },
        ],
      });
    }

    const stations = await PoliceStation.findAll({
      where: andConditions.length ? { [Op.and]: andConditions } : undefined,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, stations, "Police stations fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch police stations");
  }
});

const getStationById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const station = await PoliceStation.findByPk(id);

    if (!station) {
      throw new ApiError(404, "Police station not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, station, "Police station fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch police station");
  }
});

const updateStation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, district, province, city } = req.body;

    const station = await PoliceStation.findByPk(id);

    if (!station) {
      throw new ApiError(404, "Police station not found");
    }

    await station.update({
      name: name ?? station.name,
      district: district ?? station.district,
      province: province ?? station.province,
      city: city ?? station.city,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, station, "Police station updated successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to update police station");
  }
});

const deleteStation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const station = await PoliceStation.findByPk(id);

    if (!station) {
      throw new ApiError(404, "Police station not found");
    }

    await station.destroy();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Police station deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to delete police station");
  }
});


export {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
};
