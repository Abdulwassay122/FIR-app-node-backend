import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Complainant from "./Complainant.js";
import Officer from "./Officer.js";
import PoliceStation from "./PoliceStation.js";
import CrimeType from "./CrimeType.js";
import { UUIDV1 } from "sequelize";

const FIR = sequelize.define("FIR", {
  fir_id: { type: DataTypes.STRING, defaultValue: UUIDV1, primaryKey: true },
  complainant_id: {
    type: DataTypes.STRING,
    references: { model: Complainant, key: "complainant_id" },
  },
  officer_id: {
    type: DataTypes.STRING,
    references: { model: Officer, key: "officer_id" },
  },
  station_id: {
    type: DataTypes.STRING,
    references: { model: PoliceStation, key: "station_id" },
  },
  type_id: {
    type: DataTypes.STRING,
    references: { model: CrimeType, key: "type_id" },
  },
  date_filed: { type: DataTypes.DATE },
  description: { type: DataTypes.STRING(2000) },
  status: {
    type: DataTypes.ENUM("pending", "investigation", "solved", "closed"),
    allowNull: false,
  },
  location: { type: DataTypes.STRING(200) },
});

// Associations
FIR.belongsTo(Complainant, { foreignKey: "complainant_id" });
FIR.belongsTo(Officer, { foreignKey: "officer_id" });
FIR.belongsTo(PoliceStation, { foreignKey: "station_id" });
FIR.belongsTo(CrimeType, { foreignKey: "type_id" });

export default FIR;
