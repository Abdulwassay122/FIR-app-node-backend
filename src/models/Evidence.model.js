import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import FIR from "./FIR.model.js";
import { UUIDV4 } from "sequelize";

const Evidence = sequelize.define("Evidence", {
  evidence_id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  fir_id: {
    type: DataTypes.UUID,
    references: { model: FIR, key: "fir_id" },
  },
  file_url: { type: DataTypes.STRING(500) },
  evidence_type: { type: DataTypes.ENUM("image", "video", "document") },
});

Evidence.belongsTo(FIR, { foreignKey: "fir_id" });

export default Evidence;  
