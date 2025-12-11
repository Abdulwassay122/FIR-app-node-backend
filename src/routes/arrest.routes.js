import { Router } from "express";
import {
  createArrest,
  getArrestsByFIR,
  getArrestById,
  updateArrest,
  deleteArrest,
} from "../controllers/arrest.controller.js";

const router = Router();

router.route("/arrests").post(createArrest);
router.route("/firs/:firId/arrests").get(getArrestsByFIR);
router.route("/arrests/:id").get(getArrestById).patch(updateArrest).delete(deleteArrest);

export default router;
