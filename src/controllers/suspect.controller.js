import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Suspect from "../models/Suspect.model.js";
import FIR from "../models/FIR.model.js";

/* =========================
   CREATE SUSPECT
========================= */
const createSuspect = asyncHandler(async (req, res) => {
  try {
    const { firId } = req.params;
    const { name, cnic, description } = req.body;

    if (!firId) throw new ApiError(400, "FIR ID is required");
    if (!name) throw new ApiError(400, "Suspect name is required");
    if (!cnic) throw new ApiError(400, "CNIC is required");

    const fir = await FIR.findByPk(firId);
    if (!fir) throw new ApiError(404, "FIR not found");

    const suspect = await Suspect.create({
      fir_id: firId,
      name,
      cnic,
      description: description || "",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, suspect, "Suspect added successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to create suspect");
  }
});

/* =========================
   GET ALL SUSPECTS (BY FIR)
========================= */
const getAllSuspects = asyncHandler(async (req, res) => {
  try {
    const { firId } = req.params;

    const fir = await FIR.findByPk(firId);
    if (!fir) throw new ApiError(404, "FIR not found");

    const suspects = await Suspect.findAll({
      where: { fir_id: firId },
      order: [["createdAt", "DESC"]],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, suspects, "Suspects fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to fetch suspects");
  }
});

/* =========================
   GET SUSPECT BY ID
========================= */
const getSuspectById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const suspect = await Suspect.findByPk(id, {
      include: [{ model: FIR }],
    });

    if (!suspect) throw new ApiError(404, "Suspect not found");

    return res
      .status(200)
      .json(new ApiResponse(200, suspect, "Suspect fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to fetch suspect");
  }
});

/* =========================
   UPDATE SUSPECT
========================= */
const updateSuspect = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cnic, description } = req.body;

    const suspect = await Suspect.findByPk(id);
    if (!suspect) throw new ApiError(404, "Suspect not found");

    await suspect.update({
      name: name || suspect.name,
      cnic: cnic || suspect.cnic,
      description: description || suspect.description,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, suspect, "Suspect updated successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to update suspect");
  }
});

/* =========================
   VERIFY SUSPECT
========================= */
const verifySuspect = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const suspect = await Suspect.findByPk(id);
    if (!suspect) throw new ApiError(404, "Suspect not found");

    await suspect.update({ isVerified: true });

    return res
      .status(200)
      .json(new ApiResponse(200, suspect, "Suspect verified successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to verify suspect");
  }
});

/* =========================
   DELETE SUSPECT
========================= */
const deleteSuspect = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const suspect = await Suspect.findByPk(id);
    if (!suspect) throw new ApiError(404, "Suspect not found");

    await suspect.destroy();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Suspect deleted successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to delete suspect");
  }
});

export {
  createSuspect,
  getAllSuspects,
  getSuspectById,
  updateSuspect,
  verifySuspect,
  deleteSuspect,
};
