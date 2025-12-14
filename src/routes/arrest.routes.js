import { Router } from "express";
import {
  createArrest,
  getArrestsByFIR,
  getArrestById,
  updateArrest,
  deleteArrest,
} from "../controllers/arrest.controller.js";

const router = Router();

router.route("/").post(createArrest);
router.route("/firs/:firId").get(getArrestsByFIR);
router.route("/:id").get(getArrestById).patch(updateArrest).delete(deleteArrest);

export default router;
