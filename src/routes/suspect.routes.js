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

router.route("/firs/:firId").post(createSuspect).get(getAllSuspects);
router
  .route("/:id")
  .get(getSuspectById)
  .patch(updateSuspect)
  .delete(deleteSuspect);
router.route("/:id/verify").patch(verifySuspect);

export default router;