import { Router } from "express";
import {
  createArrest,
  getArrestsByFIR,
  getArrestById,
  updateArrest,
  deleteArrest,
} from "../controllers/arrest.controller.js";
import { verifyAnyUserJWT, verifyOfficierJWT } from "../middleware/auth.js";

const router = Router();

router.route("/").post(verifyOfficierJWT, createArrest);
router.route("/firs/:firId").get(verifyAnyUserJWT, getArrestsByFIR);
router
  .route("/:id")
  .get(verifyOfficierJWT, getArrestById)
  .patch(verifyOfficierJWT, updateArrest)
  .delete(verifyOfficierJWT, deleteArrest);

export default router;
