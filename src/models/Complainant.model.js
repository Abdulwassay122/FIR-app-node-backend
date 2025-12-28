import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/db.js";

const Complainant = sequelize.define("Complainant", {
  complainant_id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false, unique: true },
  cnic: { type: DataTypes.STRING, allowNull: false, unique: true },
  address: { type: DataTypes.STRING },
});

export default Complainant;
