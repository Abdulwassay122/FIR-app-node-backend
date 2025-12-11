import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import FIR from "./FIR.js";

const CaseStatusHistory = sequelize.define("CaseStatusHistory", {
  history_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fir_id: { type: DataTypes.INTEGER, references: { model: FIR, key: "fir_id" } },
  date_filed: { type: DataTypes.DATE },
  description: { type: DataTypes.STRING(2000) },
  status: { type: DataTypes.ENUM('pending','investigation','solved','closed'), allowNull: false },
  updated_at: { type: DataTypes.DATE },
});

CaseStatusHistory.belongsTo(FIR, { foreignKey: "fir_id" });

export default CaseStatusHistory;
