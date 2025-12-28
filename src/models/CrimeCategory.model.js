import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { UUIDV4 } from "sequelize";

const CrimeCategory = sequelize.define("CrimeCategory", {
  category_id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
});

export default CrimeCategory;
