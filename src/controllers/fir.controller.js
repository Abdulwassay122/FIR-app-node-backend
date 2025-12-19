import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import FIR from "../models/FIR.model.js";
import Complainant from "../models/Complainant.model.js";
import Officer from "../models/Officer.model.js";
import PoliceStation from "../models/PoliceStation.model.js";
import CrimeType from "../models/CrimeType.model.js";

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
    if (!location) throw new ApiError(400, "Location is required");

    const complainant = await Complainant.findByPk(complainant_id);
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
      complainant_id,
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
    const firs = await FIR.findAll({
      include: [
        { model: Complainant },
        { model: Officer },
        { model: PoliceStation },
        { model: CrimeType },
      ],
      order: [["date_filed", "DESC"]],
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

export {
  createFIR,
  getAllFIRs,
  getFIRById,
  updateFIR,
  updateFIRStatus,
  deleteFIR,
};
