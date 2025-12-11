import { Router } from "express";
import {
  createOfficer,
  getAllOfficers,
  getOfficerById,
  updateOfficer,
  deleteOfficer,
} from "../controllers/officer.controller.js";

const router = Router();

router.route("/officers").post(createOfficer).get(getAllOfficers);
router
  .route("/officers/:id")
  .get(getOfficerById)
  .patch(updateOfficer)
  .delete(deleteOfficer);

export default router;
