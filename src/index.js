import dotenv from "dotenv";
// import { app } from "./app.js";
// import sequelize from "./config/db.js";
import express from "express";

dotenv.config({
  path: "./.env",
});
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("MongoDB + Express Connected!");
});
// await sequelize
//   .sync()
//   .then(() => {

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});

// })
// .catch((err) => {
//   console.log("Neon posgre connection failed !!! ", err);
// });

// // // for vercel
// import dotenv from "dotenv";
// import { app } from "./app.js";
// import sequelize from "./config/db.js";

// dotenv.config();

// let dbConnected = false;

// export default async function handler(req, res) {
//   try {
//     if (!dbConnected) {
//       await sequelize.authenticate();
//       console.log("Database connected!");
//       dbConnected = true;
//     }

//     app(req, res);
//   } catch (err) {
//     console.error("Serverless function error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Serverless function crashed",
//       error: err.message,
//     });
//   }
// }
