import { asyncHandler } from "../utils/asyncHandler.js";

// Category
const createCategory = asyncHandler(async (req, res) => {});
const getAllCategories = asyncHandler(async (req, res) => {});
const getCategoryById = asyncHandler(async (req, res) => {});
const updateCategory = asyncHandler(async (req, res) => {});
const deleteCategory = asyncHandler(async (req, res) => {});

// Type
const createType = asyncHandler(async (req, res) => {});
const getAllTypes = asyncHandler(async (req, res) => {});
const getTypeById = asyncHandler(async (req, res) => {});
const updateType = asyncHandler(async (req, res) => {});
const deleteType = asyncHandler(async (req, res) => {});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createType,
  getAllTypes,
  getTypeById,
  updateType,
  deleteType,
};
