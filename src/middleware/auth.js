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

export const verifyAnyUserJWT = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  // 1️⃣ Try Officer token
  try {
    const decodedOfficer = jwt.verify(
      accessToken,
      process.env.OFFICIERJWYSECRET
    );

    const officer = await Officer.findOne({
      where: { officer_id: decodedOfficer.id },
    });

    if (officer) {
      req.user = officer;
      req.role = "officer";
      return next();
    }
  } catch (error) {
    // ignore & try complainant
  }

  // 2️⃣ Try Complainant token
  try {
    const decodedComplainant = jwt.verify(
      accessToken,
      process.env.COMPLAINANTJWYSECRET
    );

    const complainant = await Complainant.findOne({
      where: { complainant_id: decodedComplainant.id },
    });

    if (complainant) {
      req.user = complainant;
      req.role = "complainant";
      return next();
    }
  } catch (error) {
    // ignore
  }

  // ❌ Neither matched
  throw new ApiError(401, "Invalid Access Token");
});
