import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import FIR from "./FIR.model.js";
import { UUIDV4 } from "sequelize";

const CaseStatusHistory = sequelize.define("CaseStatusHistory", {
  history_id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  fir_id: {
    type: DataTypes.UUID,
    references: { model: FIR, key: "fir_id" },
  },
  date_filed: { type: DataTypes.DATE },
  description: { type: DataTypes.STRING(2000) },
  status: {
    type: DataTypes.ENUM("pending", "investigation", "solved", "closed"),
    allowNull: false,
  },
  updated_at: { type: DataTypes.DATE },
});

CaseStatusHistory.belongsTo(FIR, { foreignKey: "fir_id" });

export default CaseStatusHistory;
