import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import FIR from "../models/FIR.model.js";
import Complainant from "../models/Complainant.model.js";
import Officer from "../models/Officer.model.js";
import PoliceStation from "../models/PoliceStation.model.js";
import CrimeType from "../models/CrimeType.model.js";
import { Op } from "sequelize";

/* =========================
   CREATE FIR
========================= */
const createFIR = asyncHandler(async (req, res) => {
  try {
    const {
      complainant_id,
      officer_id,
      station_id,
      type_id,
      description,
      location,
    } = req.body;

    if (!complainant_id) throw new ApiError(400, "Complainant ID is required");
    if (!station_id) throw new ApiError(400, "Police Station ID is required");
    if (!type_id) throw new ApiError(400, "Crime Type ID is required");
    if (!description) throw new ApiError(400, "FIR description is required");

    const complainant = await Complainant.findOne({
      where: {
        [Op.or]: [{ complainant_id: complainant_id }, { cnic: complainant_id }],
      },
    });
    if (!complainant) throw new ApiError(404, "Complainant not found");

    if (officer_id) {
      const officer = await Officer.findByPk(officer_id);
      if (!officer) throw new ApiError(404, "Officer not found");
    }

    const station = await PoliceStation.findByPk(station_id);
    if (!station) throw new ApiError(404, "Police station not found");

    const crimeType = await CrimeType.findByPk(type_id);
    if (!crimeType) throw new ApiError(404, "Crime type not found");

    const fir = await FIR.create({
      complainant_id: complainant.complainant_id,
      officer_id: officer_id || null,
      station_id,
      type_id,
      description,
      location,
      date_filed: new Date(),
      status: "pending",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, fir, "FIR registered successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to create FIR");
  }
});

/* =========================
   GET ALL FIRs
========================= */
const getAllFIRs = asyncHandler(async (req, res) => {
  try {
    const { filters, search, sortField, sortOrder } = req.body;
    console.log(filters, search, sortField, sortOrder);

    // Build dynamic where clause
    const whereClause = {};

    // Apply exact filters if they have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        whereClause[key] = value;
      }
    });

    // Apply search across multiple fields
    if (search && search.trim() !== "") {
      whereClause[Op.or] = [
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }

    // Build dynamic order
    const order = [];
    if (sortField && sortOrder) {
      order.push([sortField, sortOrder.toUpperCase()]);
    } else {
      order.push(["date_filed", "DESC"]); // default sort
    }

    const firs = await FIR.findAll({
      where: whereClause,
      include: [
        { model: Complainant },
        { model: Officer },
        { model: PoliceStation },
        { model: CrimeType },
      ],
      order,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, firs, "FIRs fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to fetch FIRs");
  }
});

/* =========================
   GET FIR BY ID
========================= */
const getFIRById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const fir = await FIR.findByPk(id, {
      include: [
        { model: Complainant },
        { model: Officer },
        { model: PoliceStation },
        { model: CrimeType },
      ],
    });

    if (!fir) throw new ApiError(404, "FIR not found");

    return res
      .status(200)
      .json(new ApiResponse(200, fir, "FIR fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to fetch FIR");
  }
});

/* =========================
   UPDATE FIR (DETAILS)
========================= */
const updateFIR = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { officer_id, description, location, type_id } = req.body;

    const fir = await FIR.findByPk(id);
    if (!fir) throw new ApiError(404, "FIR not found");

    if (officer_id) {
      const officer = await Officer.findByPk(officer_id);
      if (!officer) throw new ApiError(404, "Officer not found");
    }

    if (type_id) {
      const crimeType = await CrimeType.findByPk(type_id);
      if (!crimeType) throw new ApiError(404, "Crime type not found");
    }

    await fir.update({
      officer_id: officer_id || fir.officer_id,
      description: description || fir.description,
      location: location || fir.location,
      type_id: type_id || fir.type_id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, fir, "FIR updated successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to update FIR");
  }
});

/* =========================
   UPDATE FIR STATUS
========================= */
const updateFIRStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) throw new ApiError(400, "FIR status is required");

    const allowedStatus = ["pending", "investigation", "solved", "closed"];
    if (!allowedStatus.includes(status)) {
      throw new ApiError(400, "Invalid FIR status");
    }

    const fir = await FIR.findByPk(id);
    if (!fir) throw new ApiError(404, "FIR not found");

    await fir.update({ status });

    return res
      .status(200)
      .json(new ApiResponse(200, fir, "FIR status updated successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to update FIR status");
  }
});

/* =========================
   DELETE FIR
========================= */
const deleteFIR = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const fir = await FIR.findByPk(id);
    if (!fir) throw new ApiError(404, "FIR not found");

    await fir.destroy();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "FIR deleted successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to delete FIR");
  }
});

const getUserFIR = asyncHandler(async (req, res) => {
  try {
    const complainant = req.complainant;
    console.log(complainant)

    const fir = await FIR.findAll({
      where: {
        complainant_id: complainant.complainant_id, // <-- your complainant_id
      },
      include: [
        { model: Complainant },
        { model: Officer },
        { model: PoliceStation },
        { model: CrimeType },
      ],
    });

    if (!fir) throw new ApiError(404, "FIR not found");

    return res
      .status(200)
      .json(new ApiResponse(200, fir, "FIR fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to fetch FIR");
  }
});

export {
  createFIR,
  getAllFIRs,
  getFIRById,
  updateFIR,
  updateFIRStatus,
  deleteFIR,
  getUserFIR,
};
