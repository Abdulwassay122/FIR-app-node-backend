import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import FIR from "./FIR.js";

const Suspect = sequelize.define("Suspect", {
  suspect_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fir_id: { type: DataTypes.INTEGER, references: { model: FIR, key: "fir_id" } },
  name: { type: DataTypes.STRING(100), allowNull: false },
  cnic: { type: DataTypes.STRING(50), allowNull: false },
  description: { type: DataTypes.STRING(2000) },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Suspect.belongsTo(FIR, { foreignKey: "fir_id" });

export default Suspect;
