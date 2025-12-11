import { Router } from "express";
import {
  createSuspect,
  getAllSuspects,
  getSuspectById,
  updateSuspect,
  verifySuspect,
  deleteSuspect,
} from "../controllers/suspect.controller.js";

const router = Router();

router.route("/firs/:firId/suspects").post(createSuspect).get(getAllSuspects);
router
  .route("/suspects/:id")
  .get(getSuspectById)
  .patch(updateSuspect)
  .delete(deleteSuspect);
router.route("/suspects/:id/verify").patch(verifySuspect);

export default router;