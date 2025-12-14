import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { UUIDV1 } from "sequelize";

const PoliceStation = sequelize.define("PoliceStation", {
  station_id: {
    type: DataTypes.STRING,
    defaultValue: UUIDV1,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  district: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  province: { type: DataTypes.STRING, allowNull: false },
});

export default PoliceStation;
