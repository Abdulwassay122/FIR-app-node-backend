import dotenv from "dotenv";
// import { app } from "./app.js";
// import sequelize from "./config/db.js";
import express from "express";

dotenv.config({
  path: "./.env",
});

// await sequelize
//   .sync()
//   .then(() => {
const app = express();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});
await sequelize.sync();
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running at port : ${process.env.PORT}`);
});

// try {
//   await sequelize.sync();
// } catch (error) {
//   console.log(error);
// }
// })
// .catch((err) => {
//   console.log("SQL connection failed !!! ", err);
// });
