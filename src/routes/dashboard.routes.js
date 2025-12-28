import { Router } from "express";
import { verifyOfficierJWT } from "../middleware/auth.js";
import {
  CrimeRate,
  FIRByStatus,
  firsByCrimeCategory,
  firsByCrimeType,
  firsByStation,
  OfficerWorkLoad,
  solvedFirsByOfficer,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(verifyOfficierJWT);

router.route("/firs-by-status").get(FIRByStatus);
router.route("/crime-rate").get(CrimeRate);
router.route("/officer-workload").get(OfficerWorkLoad);
router.route("/officer-solved-firs").get(solvedFirsByOfficer);
router.route("/station-firs").get(firsByStation);
router.route("/firs-by-crime-type").get(firsByCrimeType);
router.route("/firs-by-crime-category").get(firsByCrimeCategory);

export default router;
