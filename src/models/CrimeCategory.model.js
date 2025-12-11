import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CrimeCategory = sequelize.define("CrimeCategory", {
  category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

export default CrimeCategory;
