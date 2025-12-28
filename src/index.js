// import dotenv from "dotenv";
// import { app } from "./app.js";
// import sequelize from "./config/db.js";

// dotenv.config({
//   path: "./.env",
// });

// await sequelize
//   .sync()
//   .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`Server is running at port : ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("SQL connection failed !!! ", err);
//   });

// for vercel

import dotenv from "dotenv";
import { app } from "./app.js";
import sequelize from "./config/db.js";

dotenv.config({ path: "./.env" });

// Connect to database once (for serverless reuse)
let dbConnected = false;
async function connectDB() {
  if (!dbConnected) {
    try {
      await sequelize.sync();
      dbConnected = true;
      console.log("Database connected successfully!");
    } catch (err) {
      console.log("SQL connection failed !!! ", err);
    }
  }
}

// Vercel serverless handler
export default async function handler(req, res) {
  await connectDB();
  app(req, res); // Let Express handle the request
}
