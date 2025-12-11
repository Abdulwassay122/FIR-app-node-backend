import { asyncHandler } from "../utils/asyncHandler.js";

const createFIR = asyncHandler(async (req, res) => {});
const getAllFIRs = asyncHandler(async (req, res) => {});
const getFIRById = asyncHandler(async (req, res) => {});
const updateFIR = asyncHandler(async (req, res) => {});
const updateFIRStatus = asyncHandler(async (req, res) => {});
const deleteFIR = asyncHandler(async (req, res) => {});

export { createFIR, getAllFIRs, getFIRById, updateFIR, updateFIRStatus, deleteFIR };
