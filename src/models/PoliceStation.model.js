import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PoliceStation = sequelize.define("PoliceStation", {
  station_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  district: { type: DataTypes.STRING, allowNull: false },
  province: { type: DataTypes.STRING, allowNull: false },
});

export default PoliceStation;
