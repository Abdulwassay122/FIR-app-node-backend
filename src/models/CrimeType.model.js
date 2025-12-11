import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import CrimeCategory from "./CrimeCategory.js";

const CrimeType = sequelize.define("CrimeType", {
  type_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  category_id: { type: DataTypes.INTEGER, references: { model: CrimeCategory, key: "category_id" } },
  name: { type: DataTypes.STRING, allowNull: false },
});

CrimeType.belongsTo(CrimeCategory, { foreignKey: "category_id" });

export default CrimeType;
