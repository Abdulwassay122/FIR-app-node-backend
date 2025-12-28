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

// Reuse DB connection across invocations (important for serverless)
let dbConnected = false;

async function connectDB() {
  if (!dbConnected) {
    try {
      await sequelize.authenticate();
      console.log("Database connected!");
      dbConnected = true;
    } catch (err) {
      console.error("Database connection failed:", err);
    }
  }
}

// Vercel serverless handler
export default async function handler(req, res) {
  await connectDB();
  app(req, res); // Let Express handle the request
}
