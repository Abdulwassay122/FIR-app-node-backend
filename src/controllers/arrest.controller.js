import { asyncHandler } from "../utils/asyncHandler.js";

const createArrest = asyncHandler(async (req, res) => {});
const getArrestsByFIR = asyncHandler(async (req, res) => {});
const getArrestById = asyncHandler(async (req, res) => {});
const updateArrest = asyncHandler(async (req, res) => {});
const deleteArrest = asyncHandler(async (req, res) => {});

export { createArrest, getArrestsByFIR, getArrestById, updateArrest, deleteArrest };