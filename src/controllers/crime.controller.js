import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CrimeCategory from "../models/CrimeCategory.model.js";
import CrimeType from "../models/CrimeType.model.js";

/* =========================
   CATEGORY CONTROLLERS
========================= */

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) throw new ApiError(400, "Category name is required");

    const existing = await CrimeCategory.findOne({ where: { name } });

    if (existing) {
      throw new ApiError(400, "Crime category already exists");
    }

    const category = await CrimeCategory.create({ name });

    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to create category");
  }
});

// Get All Categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await CrimeCategory.findAll();

    return res
      .status(200)
      .json(
        new ApiResponse(200, categories, "Categories fetched successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to fetch categories");
  }
});

// Get Category By ID
const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CrimeCategory.findByPk(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, category, "Category fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to fetch category");
  }
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) throw new ApiError(400, "Category name is required");

    const category = await CrimeCategory.findByPk(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    await category.update({ name });

    return res
      .status(200)
      .json(new ApiResponse(200, category, "Category updated successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to update category");
  }
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CrimeCategory.findByPk(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    await category.destroy();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Category deleted successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to delete category");
  }
});

/* =========================
   TYPE CONTROLLERS
========================= */

// Create Type
const createType = asyncHandler(async (req, res) => {
  try {
    const { name, category_id } = req.body;

    if (!name) throw new ApiError(400, "Crime type name is required");
    if (!category_id) throw new ApiError(400, "Category ID is required");

    const category = await CrimeCategory.findByPk(category_id);
    if (!category) throw new ApiError(404, "Category not found");

    const type = await CrimeType.create({ name, category_id });

    return res
      .status(201)
      .json(new ApiResponse(201, type, "Crime type created successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to create crime type");
  }
});

// Get All Types
const getAllTypes = asyncHandler(async (req, res) => {
  try {
    const types = await CrimeType.findAll({
      include: [{ model: CrimeCategory }],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, types, "Crime types fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to fetch crime types");
  }
});

// Get Type By ID
const getTypeById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const type = await CrimeType.findByPk(id, {
      include: [{ model: CrimeCategory }],
    });

    if (!type) {
      throw new ApiError(404, "Crime type not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, type, "Crime type fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to fetch crime type");
  }
});

// Update Type
const updateType = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id } = req.body;

    const type = await CrimeType.findByPk(id);

    if (!type) throw new ApiError(404, "Crime type not found");

    if (category_id) {
      const category = await CrimeCategory.findByPk(category_id);
      if (!category) throw new ApiError(404, "Category not found");
    }

    await type.update({
      name: name || type.name,
      category_id: category_id || type.category_id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, type, "Crime type updated successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to update crime type");
  }
});

// Delete Type
const deleteType = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const type = await CrimeType.findByPk(id);

    if (!type) throw new ApiError(404, "Crime type not found");

    await type.destroy();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Crime type deleted successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Failed to delete crime type");
  }
});

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
