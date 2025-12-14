import { Sequelize } from "sequelize";

const sequelize = new Sequelize("FIRManagemntSystem", "root", "mysql1000cc", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default sequelize;
