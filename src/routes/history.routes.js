import { Router } from "express";
import {
  addHistory,
  getHistoryByFIR,
} from "../controllers/history.controller.js";
import { verifyAnyUserJWT, verifyOfficierJWT } from "../middleware/auth.js";

const router = Router();

router
  .route("/firs/:firId")
  .post(verifyOfficierJWT, addHistory)
  .get(verifyAnyUserJWT, getHistoryByFIR);

export default router;
