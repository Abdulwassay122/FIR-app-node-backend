import { Router } from "express";
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} from "../controllers/policeStation.controller.js";

const router = Router();

router.route("/").post(createStation).get(getAllStations);
router
  .route("/:id")
  .get(getStationById)
  .patch(updateStation)
  .delete(deleteStation);

export default router;
