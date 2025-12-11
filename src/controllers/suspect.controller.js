import { asyncHandler } from "../utils/asyncHandler.js";

const createSuspect = asyncHandler(async (req, res) => {});
const getAllSuspects = asyncHandler(async (req, res) => {});
const getSuspectById = asyncHandler(async (req, res) => {});
const updateSuspect = asyncHandler(async (req, res) => {});
const verifySuspect = asyncHandler(async (req, res) => {});
const deleteSuspect = asyncHandler(async (req, res) => {});

export { createSuspect, getAllSuspects, getSuspectById, updateSuspect, verifySuspect, deleteSuspect };
