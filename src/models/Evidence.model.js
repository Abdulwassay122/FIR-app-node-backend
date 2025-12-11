import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import FIR from "./FIR.js";

const Evidence = sequelize.define("Evidence", {
  evidence_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fir_id: { type: DataTypes.INTEGER, references: { model: FIR, key: "fir_id" } },
  file_url: { type: DataTypes.STRING(500) },
  evidence_type: { type: DataTypes.ENUM('image','video','document') },
  uploaded_at: { type: DataTypes.DATE },
});

Evidence.belongsTo(FIR, { foreignKey: "fir_id" });

export default Evidence;
