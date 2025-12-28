import { Router } from "express";
import {
  createFIR,
  getAllFIRs,
  getFIRById,
  updateFIR,
  updateFIRStatus,
  deleteFIR,
  getUserFIR,
} from "../controllers/fir.controller.js";
import {
  verifyAnyUserJWT,
  verifyComplainantJWT,
  verifyOfficierJWT,
} from "../middleware/auth.js";

const router = Router();

router.route("/").post(verifyOfficierJWT, createFIR);
router.route("/search").post(verifyOfficierJWT, getAllFIRs);
router.route("/user-firs").get(verifyComplainantJWT, getUserFIR);
router
  .route("/:id")
  .get(verifyAnyUserJWT, getFIRById)
  .patch(verifyOfficierJWT, updateFIR)
  .delete(verifyOfficierJWT, deleteFIR);
router.route("/:id/status").patch(verifyOfficierJWT, updateFIRStatus);

export default router;
