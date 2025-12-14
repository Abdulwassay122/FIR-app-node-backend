import { Router } from "express";
import {
  uploadEvidence,
  getEvidenceByFIR,
  deleteEvidence,
} from "../controllers/evidence.controller.js";

const router = Router();

router.route("/firs/:firId").post(uploadEvidence).get(getEvidenceByFIR);
router.route("/:id").delete(deleteEvidence);

export default router;
