import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import CaseStatusHistory from "../models/History.model.js";
import FIR from "../models/FIR.model.js";

/* =========================
   ADD CASE STATUS HISTORY
========================= */
const addHistory = asyncHandler(async (req, res) => {
  try {
    const { firId } = req.params;
    const { description, status } = req.body;

    if (!firId) throw new ApiError(400, "FIR ID is required");
    if (!description) throw new ApiError(400, "Description is required");
    if (!status) throw new ApiError(400, "Status is required");

    const allowedStatus = ["pending", "investigation", "solved", "closed"];
    if (!allowedStatus.includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }

    const fir = await FIR.findByPk(firId);
    if (!fir) throw new ApiError(404, "FIR not found");

    const history = await CaseStatusHistory.create({
      fir_id: firId,
      description,
      status,
      date_filed: fir.date_filed || new Date(),
      updated_at: new Date(),
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, history, "Case status history added successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      error.message || "Failed to add case status history"
    );
  }
});

/* =========================
   GET CASE STATUS HISTORY BY FIR
========================= */
const getHistoryByFIR = asyncHandler(async (req, res) => {
  try {
    const { firId } = req.params;

    const fir = await FIR.findByPk(firId);
    if (!fir) throw new ApiError(404, "FIR not found");

    const historyList = await CaseStatusHistory.findAll({
      where: { fir_id: firId },
      order: [["updated_at", "DESC"]],
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, historyList, "Case status history fetched successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      error.message || "Failed to fetch case status history"
    );
  }
});

export { addHistory, getHistoryByFIR };
