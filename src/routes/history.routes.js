import { Router } from "express";
import {
  addHistory,
  getHistoryByFIR,
} from "../controllers/history.controller.js";

const router = Router();

router.route("/firs/:firId/history").post(addHistory).get(getHistoryByFIR);

export default router;
