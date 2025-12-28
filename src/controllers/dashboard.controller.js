import { Op, Sequelize } from "sequelize";
import FIR from "../models/FIR.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Officer from "../models/Officer.model.js";
import PoliceStation from "../models/PoliceStation.model.js";
import CrimeType from "../models/CrimeType.model.js";
import CrimeCategory from "../models/CrimeCategory.model.js";

const FIRByStatus = asyncHandler(async (req, res) => {
  try {
    const data = await FIR.findAll({
      attributes: [
        [Sequelize.literal("DATE(date_filed)"), "date"],

        [
          Sequelize.literal(
            "SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)"
          ),
          "pending",
        ],
        [
          Sequelize.literal(
            "SUM(CASE WHEN status = 'investigation' THEN 1 ELSE 0 END)"
          ),
          "investigation",
        ],
        [
          Sequelize.literal(
            "SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END)"
          ),
          "solved",
        ],
        [
          Sequelize.literal(
            "SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END)"
          ),
          "closed",
        ],
      ],

      group: [Sequelize.literal("DATE(date_filed)")],
      order: [[Sequelize.literal("DATE(date_filed)"), "ASC"]],
      raw: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, data, "FIRByStatus Fetched Successfully"));
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while fetching firs-by-status.`,
      error
    );
  }
});

const CrimeRate = asyncHandler(async (req, res) => {
  try {
    const { filter = "week" } = req.query;

    let periodExpr;

    switch (filter) {
      case "day":
        periodExpr = "DATE(date_filed)";
        break;

      case "week":
        periodExpr =
          "EXTRACT(YEAR FROM date_filed) || '-' || TO_CHAR(date_filed, 'IW')";
        break;

      case "month":
        periodExpr = "TO_CHAR(date_filed, 'YYYY-MM')";
        break;

      case "year":
        periodExpr = "EXTRACT(YEAR FROM date_filed)";
        break;

      default:
        return res.status(400).json({ message: "Invalid filter" });
    }

    const data = await FIR.findAll({
      attributes: [
        [Sequelize.literal(periodExpr), "period"],
        [Sequelize.fn("COUNT", Sequelize.col("fir_id")), "total_firs"],
      ],

      group: [Sequelize.literal(periodExpr)],
      order: [[Sequelize.literal(periodExpr), "ASC"]],
      raw: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Crime Rate Fetched Successfully"));
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while fetching Crime Rate.`,
      error
    );
  }
});

const OfficerWorkLoad = asyncHandler(async (req, res) => {
  try {
    const data = await FIR.findAll({
      attributes: [
        "officer_id",
        [Sequelize.col("Officer.name"), "officer_name"],
        [Sequelize.fn("COUNT", Sequelize.col("FIR.fir_id")), "assigned_firs"],
      ],
      include: [
        {
          model: Officer,
          attributes: [],
        },
      ],
      group: ["FIR.officer_id", "Officer.officer_id", "Officer.name"],
      order: [[Sequelize.literal("assigned_firs"), "DESC"]],
      raw: true,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, data, "Officer WorkLoad Fetched Successfully")
      );
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while fetching OfficerWorkLoad.`,
      error
    );
  }
});

const solvedFirsByOfficer = asyncHandler(async (req, res) => {
  try {
    const data = await FIR.findAll({
      attributes: [
        "officer_id",
        [Sequelize.col("Officer.name"), "officer_name"],
        [Sequelize.fn("COUNT", Sequelize.col("FIR.fir_id")), "solved_firs"],
      ],
      include: [
        {
          model: Officer,
          attributes: [],
        },
      ],
      where: {
        status: "solved",
      },
      group: ["FIR.officer_id", "Officer.officer_id", "Officer.name"],
      order: [[Sequelize.literal("solved_firs"), "DESC"]],
      raw: true,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, data, "solvedFirsByOfficer Fetched Successfully")
      );
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while fetching solvedFirsByOfficer.`,
      error
    );
  }
});

const firsByStation = asyncHandler(async (req, res) => {
  try {
    const { period = "month" } = req.query; // default filter

    let whereClause = {};
    let periodExpr;
    let groupBy;

    const today = new Date();

    switch (period) {
      case "day":
        periodExpr = "DATE(date_filed)";
        groupBy = periodExpr;
        break;

      case "week":
        periodExpr =
          "EXTRACT(YEAR FROM date_filed)::TEXT || '-' || TO_CHAR(date_filed, 'IW')";
        groupBy = periodExpr;
        break;

      case "month":
        periodExpr = "TO_CHAR(date_filed, 'YYYY-MM')";
        groupBy = periodExpr;
        break;

      case "3month":
        const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));
        whereClause.date_filed = { [Op.gte]: threeMonthsAgo };
        periodExpr = "TO_CHAR(date_filed, 'YYYY-MM')";
        groupBy = periodExpr;
        break;

      case "6month":
        const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
        whereClause.date_filed = { [Op.gte]: sixMonthsAgo };
        periodExpr = "TO_CHAR(date_filed, 'YYYY-MM')";
        groupBy = periodExpr;
        break;

      case "year":
        periodExpr = "EXTRACT(YEAR FROM date_filed)";
        groupBy = periodExpr;
        break;

      default:
        return res.status(400).json({ message: "Invalid period filter" });
    }

    const data = await FIR.findAll({
      attributes: [
        "station_id",
        [Sequelize.col("PoliceStation.name"), "station_name"],
        [Sequelize.fn("COUNT", Sequelize.col("FIR.fir_id")), "total_firs"],
        [Sequelize.literal(periodExpr), "period"],
      ],
      include: [
        {
          model: PoliceStation,
          attributes: [],
        },
      ],
      where: whereClause,
      group: [
        "FIR.station_id",
        "PoliceStation.station_id",
        "PoliceStation.name",
        Sequelize.literal(groupBy),
      ],
      order: [[Sequelize.literal("total_firs"), "DESC"]],
      raw: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, data, "firsByStation Fetched Successfully"));
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Something went wrong while fetching firsByStation.`,
      error
    );
  }
});

const firsByCrimeType = asyncHandler(async (req, res) => {
  try {
    const data = await FIR.findAll({
      attributes: [
        "type_id",
        [Sequelize.col("CrimeType.name"), "type_name"],
        [Sequelize.fn("COUNT", Sequelize.col("FIR.fir_id")), "total_firs"],
      ],
      include: [
        {
          model: CrimeType,
          attributes: [],
        },
      ],
      group: ["FIR.type_id", "CrimeType.type_id", "CrimeType.name"],
      order: [[Sequelize.literal("total_firs"), "DESC"]],
      raw: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, data, "firsByCrimeType Fetched Successfully"));
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while fetching firsByCrimeType.`,
      error
    );
  }
});

const firsByCrimeCategory = asyncHandler(async (req, res) => {
  try {
    const data = await FIR.findAll({
      attributes: [
        [Sequelize.col("CrimeType.CrimeCategory.category_id"), "category_id"],
        [Sequelize.col("CrimeType.CrimeCategory.name"), "category_name"],
        [Sequelize.fn("COUNT", Sequelize.col("FIR.fir_id")), "total_firs"],
      ],
      include: [
        {
          model: CrimeType,
          attributes: [],
          include: [
            {
              model: CrimeCategory,
              attributes: [],
            },
          ],
        },
      ],
      group: [
        "CrimeType.CrimeCategory.category_id",
        "CrimeType.CrimeCategory.name",
      ],
      order: [[Sequelize.literal("total_firs"), "DESC"]],
      raw: true,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, data, "firsByCrimeCategory  Fetched Successfully")
      );
  } catch (error) {
    console.log(error);
    if (error.message) {
      throw new ApiError(500, error.message);
    }
    throw new ApiError(
      500,
      `Somthing went wrong while fetching firsByCrimeCategory .`,
      error
    );
  }
});

export {
  FIRByStatus,
  CrimeRate,
  OfficerWorkLoad,
  solvedFirsByOfficer,
  firsByStation,
  firsByCrimeType,
  firsByCrimeCategory,
};
