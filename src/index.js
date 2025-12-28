// import dotenv from "dotenv";
// import { app } from "./app.js";
// import sequelize from "./config/db.js";

// dotenv.config({
//   path: "./.env",
// });

// await sequelize
//   .authenticate()
//   .then(() => {
//     app.get("/", (req, res) => {
//       res.send("Neon + Express Connected!");
//     });
//     app.listen(process.env.PORT, "0.0.0.0", () => {
//       console.log(`Server is running at port : ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("SQL connection failed !!! ", err);
//   });

// // for vercel
import dotenv from "dotenv";
import { app } from "./app.js";
import sequelize from "./config/db.js";

dotenv.config();

let dbConnected = false;

export default async function handler(req, res) {
  try {
    if (!dbConnected) {
      await sequelize.authenticate();
      console.log("Database connected!");
      dbConnected = true;
    }

    app(req, res);
  } catch (err) {
    console.error("Serverless handler error:", err);
    return res.status(500).json({
      success: false,
      message: "Serverless function crashed",
      error: err.message,
    });
  }
}
