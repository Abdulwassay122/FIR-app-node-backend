import { Router } from "express";
import {
  createOfficer,
  getAllOfficers,
  getOfficerById,
  updateOfficer,
  deleteOfficer,
  loginOfficier,
  logoutOfficier,
} from "../controllers/officer.controller.js";
import { verifyOfficierJWT } from "../middleware/auth.js";

const router = Router();

router.route("/").post(createOfficer).get(verifyOfficierJWT, getAllOfficers);
router.route("/login").post(loginOfficier);
router.route("/logout").get(logoutOfficier);
router
  .route("/:id")
  .get(getOfficerById)
  .patch(updateOfficer)
  .delete(deleteOfficer);

export default router;
