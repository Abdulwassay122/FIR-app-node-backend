import { Router } from "express";
import {
  createOfficer,
  getAllOfficers,
  getOfficerById,
  updateOfficer,
  deleteOfficer,
  loginOfficier,
  logoutOfficier,
  searchOfficer,
  getOfficer,
} from "../controllers/officer.controller.js";
import { verifyComplainantJWT, verifyOfficierJWT } from "../middleware/auth.js";

const router = Router();

router
  .route("/")
  .post(verifyOfficierJWT, createOfficer)
  .get(verifyOfficierJWT, getAllOfficers);
router.route("/search").get(verifyOfficierJWT, searchOfficer);
router.route("/user").get(verifyOfficierJWT, getOfficer);

router.route("/login").post(loginOfficier);
router.route("/logout").get(logoutOfficier);
router
  .route("/:id")
  .get(verifyOfficierJWT, getOfficerById)
  .patch(verifyOfficierJWT, updateOfficer)
  .delete(verifyOfficierJWT, deleteOfficer);

export default router;
