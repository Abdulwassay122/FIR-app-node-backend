import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { UUIDV1 } from "sequelize";

const CrimeCategory = sequelize.define("CrimeCategory", {
  category_id: {
    type: DataTypes.STRING,
    defaultValue: UUIDV1,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
});

export default CrimeCategory;
