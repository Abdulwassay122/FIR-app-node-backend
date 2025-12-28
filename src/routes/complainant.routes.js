import { Router } from "express";
import {
  createComplainant,
  deleteComplainant,
  getAllComplainant,
  getComplainant,
  getComplainantById,
  loginComplainant,
  logoutComplainant,
  updateComplainant,
} from "../controllers/complainant.controller.js";
import {
  verifyAnyUserJWT,
  verifyComplainantJWT,
  verifyOfficierJWT,
} from "../middleware/auth.js";

const router = Router();

router
  .route("/")
  .post(createComplainant)
  .get(verifyOfficierJWT, getAllComplainant);
router.route("/login").post(loginComplainant);
router.route("/logout").get(logoutComplainant);
router.route("/user").get(verifyComplainantJWT, getComplainant);

router
  .route("/:id")
  .get(verifyAnyUserJWT, getComplainantById)
  .patch(verifyOfficierJWT, updateComplainant)
  .delete(verifyOfficierJWT, deleteComplainant);

export default router;
