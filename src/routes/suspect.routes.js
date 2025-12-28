import { Router } from "express";
import {
  createSuspect,
  getAllSuspects,
  getSuspectById,
  updateSuspect,
  verifySuspect,
  deleteSuspect,
} from "../controllers/suspect.controller.js";
import { verifyAnyUserJWT, verifyOfficierJWT } from "../middleware/auth.js";

const router = Router();

router
  .route("/firs/:firId")
  .post(verifyOfficierJWT, createSuspect)
  .get(verifyAnyUserJWT, getAllSuspects);
router
  .route("/:id")
  .get(verifyOfficierJWT, getSuspectById)
  .patch(verifyOfficierJWT, updateSuspect)
  .delete(verifyOfficierJWT, deleteSuspect);
router.route("/:id/verify").patch(verifyOfficierJWT, verifySuspect);

export default router;
