import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import PoliceStation from "./PoliceStation.model.js";
import { UUIDV4 } from "sequelize";

const Officer = sequelize.define("Officer", {
  officer_id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  station_id: {
    type: DataTypes.UUID,
    references: { model: PoliceStation, key: "station_id" },
  },
  name: { type: DataTypes.STRING, allowNull: false },
  badge_no: { type: DataTypes.STRING, allowNull: false, unique: true },
  cnic: { type: DataTypes.STRING, allowNull: false, unique: true },
  officer_rank: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false, unique: true },
});

Officer.belongsTo(PoliceStation, { foreignKey: "station_id" });

export default Officer;
