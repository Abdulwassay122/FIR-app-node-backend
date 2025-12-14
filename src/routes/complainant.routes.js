import { Router } from "express";
import {
  createComplainant,
  deleteComplainant,
  getAllComplainant,
  getComplainantById,
  loginComplainant,
  logoutComplainant,
  updateComplainant,
} from "../controllers/complainant.controller.js";
import { verifyComplainantJWT } from "../middleware/auth.js";

const router = Router();

router.route("/").post(createComplainant).get(getAllComplainant);
router.route("/login").post(loginComplainant);
router.route("/logout").get(logoutComplainant);

router
  .route("/:id")
  .get(verifyComplainantJWT, getComplainantById)
  .patch(updateComplainant)
  .delete(deleteComplainant);

export default router;
