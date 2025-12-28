import dotenv from "dotenv";
import { app } from "./app.js";
import sequelize from "./config/db.js";

dotenv.config({
  path: "./.env",
});

// await sequelize
//   .sync()
//   .then(() => {

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running at port : ${process.env.PORT}`);
});

try {
  await sequelize.sync();
} catch (error) {
  console.log(error);
}
// })
// .catch((err) => {
//   console.log("SQL connection failed !!! ", err);
// });
