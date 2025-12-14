import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Suspect from "./Suspect.js";
import FIR from "./FIR.js";
import { UUIDV1 } from "sequelize";
import Officer from "./Officer.js";

const Arrest = sequelize.define("Arrest", {
  arrest_id: {
    type: DataTypes.STRING,
    defaultValue: UUIDV1,
    primaryKey: true,
  },
  suspect_id: {
    type: DataTypes.STRING,
    references: { model: Suspect, key: "suspect_id" },
  },
  fir_id: {
    type: DataTypes.STRING,
    references: { model: FIR, key: "fir_id" },
  },
  officer_id: {
    type: DataTypes.STRING,
    references: { model: Officer, key: "officer_id" },
  },
  arrest_date: { type: DataTypes.DATE },
  description: { type: DataTypes.STRING(100) },
});

Arrest.belongsTo(Suspect, { foreignKey: "suspect_id" });
Arrest.belongsTo(FIR, { foreignKey: "fir_id" });
Arrest.belongsTo(Officer, { foreignKey: "officer_id" });

export default Arrest;
