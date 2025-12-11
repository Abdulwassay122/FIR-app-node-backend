import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import PoliceStation from "./PoliceStation.js";

const Officer = sequelize.define("Officer", {
  officer_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  station_id: { type: DataTypes.INTEGER, references: { model: PoliceStation, key: "station_id" } },
  name: { type: DataTypes.STRING, allowNull: false },
  officer_rank: { type: DataTypes.STRING, allowNull: false },
});

Officer.belongsTo(PoliceStation, { foreignKey: "station_id" });

export default Officer;
