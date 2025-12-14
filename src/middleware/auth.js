import Complainant from "../models/Complainant.model.js";
import Officer from "../models/Officer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyComplainantJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unautorized Request");
    }

    const decoded = jwt.verify(accessToken, process.env.COMPLAINANTJWYSECRET);

    const complainant = await Complainant.findOne({
      where: { complainant_id: decoded.id },
    });

    if (!complainant) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.complainant = complainant;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const verifyOfficierJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unautorized Request");
    }

    const decoded = jwt.verify(accessToken, process.env.OFFICIERJWYSECRET);

    const officer = await Officer.findOne({
      where: { officer_id: decoded.id },
    });

    if (!officer) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.officer = officer;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
