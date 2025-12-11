import { Router } from "express";
import {
  createComplainant,
  deleteComplainant,
  getAllComplainant,
  getComplainantById,
  updateComplainant,
} from "../controllers/complainant.controller";

const router = Router();

router.route("/complainants").post(createComplainant).get(getAllComplainant);

router
  .route("/complainants/:id")
  .get(getComplainantById)
  .patch(updateComplainant)
  .delete(deleteComplainant);

export default router;
