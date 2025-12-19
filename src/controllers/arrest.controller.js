import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import Arrest from "../models/Arrest.model.js";
import FIR from "../models/FIR.model.js";
import Suspect from "../models/Suspect.model.js";
import Officer from "../models/Officer.model.js";

/* =========================
   CREATE ARREST
========================= */
const createArrest = asyncHandler(async (req, res) => {
  try {
    const { suspect_id, fir_id, officer_id, description } = req.body;

    if (!suspect_id)
      throw new ApiError(400, "Suspect ID is required");
    if (!fir_id)
      throw new ApiError(400, "FIR ID is required");
    if (!officer_id)
      throw new ApiError(400, "Officer ID is required");

    const suspect = await Suspect.findByPk(suspect_id);
    if (!suspect) throw new ApiError(404, "Suspect not found");

    const fir = await FIR.findByPk(fir_id);
    if (!fir) throw new ApiError(404, "FIR not found");

    const officer = await Officer.findByPk(officer_id);
    if (!officer) throw new ApiError(404, "Officer not found");

    const arrest = await Arrest.create({
      suspect_id,
      fir_id,
      officer_id,
      arrest_date: new Date(),
      description: description || "",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, arrest, "Arrest recorded successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to create arrest");
  }
});

/* =========================
   GET ARRESTS BY FIR
========================= */
const getArrestsByFIR = asyncHandler(async (req, res) => {
  try {
    const { firId } = req.params;

    const fir = await FIR.findByPk(firId);
    if (!fir) throw new ApiError(404, "FIR not found");

    const arrests = await Arrest.findAll({
      where: { fir_id: firId },
      include: [
        { model: Suspect },
        { model: Officer },
      ],
      order: [["arrest_date", "DESC"]],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, arrests, "Arrests fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to fetch arrests");
  }
});

/* =========================
   GET ARREST BY ID
========================= */
const getArrestById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const arrest = await Arrest.findByPk(id, {
      include: [
        { model: Suspect },
        { model: FIR },
        { model: Officer },
      ],
    });

    if (!arrest) throw new ApiError(404, "Arrest record not found");

    return res
      .status(200)
      .json(new ApiResponse(200, arrest, "Arrest fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to fetch arrest");
  }
});

/* =========================
   UPDATE ARREST
========================= */
const updateArrest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { officer_id, description } = req.body;

    const arrest = await Arrest.findByPk(id);
    if (!arrest) throw new ApiError(404, "Arrest record not found");

    if (officer_id) {
      const officer = await Officer.findByPk(officer_id);
      if (!officer) throw new ApiError(404, "Officer not found");
    }

    await arrest.update({
      officer_id: officer_id || arrest.officer_id,
      description: description || arrest.description,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, arrest, "Arrest updated successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to update arrest");
  }
});

/* =========================
   DELETE ARREST
========================= */
const deleteArrest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const arrest = await Arrest.findByPk(id);
    if (!arrest) throw new ApiError(404, "Arrest record not found");

    await arrest.destroy();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Arrest deleted successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to delete arrest");
  }
});

export {
  createArrest,
  getArrestsByFIR,
  getArrestById,
  updateArrest,
  deleteArrest,
};
