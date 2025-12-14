import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import CrimeCategory from "./CrimeCategory.js";
import { UUIDV1 } from "sequelize";

const CrimeType = sequelize.define("CrimeType", {
  type_id: { type: DataTypes.STRING, defaultValue: UUIDV1, primaryKey: true },
  category_id: {
    type: DataTypes.STRING,
    references: { model: CrimeCategory, key: "category_id" },
  },
  name: { type: DataTypes.STRING, allowNull: false },
});

CrimeType.belongsTo(CrimeCategory, { foreignKey: "category_id" });

export default CrimeType;