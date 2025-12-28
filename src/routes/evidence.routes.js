import { Router } from "express";
import {
  uploadEvidence,
  getEvidenceByFIR,
  deleteEvidence,
} from "../controllers/evidence.controller.js";
import { verifyAnyUserJWT, verifyOfficierJWT } from "../middleware/auth.js";

const router = Router();

router
  .route("/firs/:firId")
  .post(verifyOfficierJWT, uploadEvidence)
  .get(verifyAnyUserJWT, getEvidenceByFIR);
router.route("/:id").delete(verifyOfficierJWT, deleteEvidence);

export default router;
