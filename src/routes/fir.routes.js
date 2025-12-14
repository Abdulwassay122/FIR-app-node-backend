import { Router } from "express";
import {
  createFIR,
  getAllFIRs,
  getFIRById,
  updateFIR,
  updateFIRStatus,
  deleteFIR,
} from "../controllers/fir.controller.js";

const router = Router();

router.route("/").post(createFIR).get(getAllFIRs);
router
  .route("/:id")
  .get(getFIRById)
  .patch(updateFIR)
  .delete(deleteFIR);
router.route("/:id/status").patch(updateFIRStatus);

export default router;
