import dotenv from "dotenv";
import { app } from "./app.js";
import sequelize from "./config/db.js";

dotenv.config({
  path: "./.env",
});

await sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("SQL connection failed !!! ", err);
  });
