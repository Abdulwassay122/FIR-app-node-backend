import { Router } from "express";
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} from "../controllers/policeStation.controller.js";

const router = Router();

router.route("/stations").post(createStation).get(getAllStations);
router
  .route("/stations/:id")
  .get(getStationById)
  .patch(updateStation)
  .delete(deleteStation);

export default router;
