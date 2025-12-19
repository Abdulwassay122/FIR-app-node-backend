import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Evidence from "../models/Evidence.model.js";
import FIR from "../models/FIR.model.js";

/* =========================
   UPLOAD EVIDENCE
========================= */
const uploadEvidence = asyncHandler(async (req, res) => {
  try {
    const { firId } = req.params;
    const { file_url, evidence_type } = req.body;

    if (!firId) throw new ApiError(400, "FIR ID is required");
    if (!file_url) throw new ApiError(400, "File URL is required");
    if (!evidence_type) throw new ApiError(400, "Evidence type is required");

    const allowedTypes = ["image", "video", "document"];
    if (!allowedTypes.includes(evidence_type)) {
      throw new ApiError(400, "Invalid evidence type");
    }

    const fir = await FIR.findByPk(firId);
    if (!fir) throw new ApiError(404, "FIR not found");

    const evidence = await Evidence.create({
      fir_id: firId,
      file_url,
      evidence_type,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, evidence, "Evidence uploaded successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to upload evidence");
  }
});

/* =========================
   GET EVIDENCE BY FIR
========================= */
const getEvidenceByFIR = asyncHandler(async (req, res) => {
  try {
    const { firId } = req.params;

    const fir = await FIR.findByPk(firId);
    if (!fir) throw new ApiError(404, "FIR not found");

    const evidenceList = await Evidence.findAll({
      where: { fir_id: firId },
      order: [["updatedAt", "DESC"]],
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, evidenceList, "Evidence fetched successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to fetch evidence");
  }
});

/* =========================
   DELETE EVIDENCE
========================= */
const deleteEvidence = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const evidence = await Evidence.findByPk(id);
    if (!evidence) throw new ApiError(404, "Evidence not found");

    await evidence.destroy();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Evidence deleted successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to delete evidence");
  }
});

export { uploadEvidence, getEvidenceByFIR, deleteEvidence };
