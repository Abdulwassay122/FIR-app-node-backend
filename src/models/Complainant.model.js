import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Complainant = sequelize.define("Complainant", {
  complainant_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  cnic: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
});

export default Complainant;
