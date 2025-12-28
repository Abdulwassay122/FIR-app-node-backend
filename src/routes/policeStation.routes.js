import { Router } from "express";
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} from "../controllers/policeStation.controller.js";
import { verifyOfficierJWT } from "../middleware/auth.js";

const router = Router();

router.use(verifyOfficierJWT);

router.route("/").post(createStation).get(getAllStations);
router
  .route("/:id")
  .get(getStationById)
  .patch(updateStation)
  .delete(deleteStation);

export default router;
