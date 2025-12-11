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

router.route("/firs").post(createFIR).get(getAllFIRs);
router
  .route("/firs/:id")
  .get(getFIRById)
  .patch(updateFIR)
  .delete(deleteFIR);
router.route("/firs/:id/status").patch(updateFIRStatus);

export default router;
