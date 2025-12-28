import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import CrimeCategory from "../models/CrimeCategory.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CrimeType from "../models/CrimeType.model.js";
const router = Router();

router.route("/").post(
  asyncHandler(async (req, res) => {
    const crimes = req.body;

    crimes.map(async (ele) => {
      await CrimeType.create(ele);
    });
    return res.status(200).json(new ApiResponse(200, {}, "OK"));
  })
);

export default router;
