import { Router } from "express";
import {
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
} from "../controllers/crime.controller.js";

const router = Router();

// Category
router.route("/crime-categories").post(createCategory).get(getAllCategories);
router
  .route("/crime-categories/:id")
  .get(getCategoryById)
  .patch(updateCategory)
  .delete(deleteCategory);

// Type
router.route("/crime-types").post(createType).get(getAllTypes);
router
  .route("/crime-types/:id")
  .get(getTypeById)
  .patch(updateType)
  .delete(deleteType);

export default router;
