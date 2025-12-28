import dotenv from "dotenv";
import { app } from "./app.js";
import sequelize from "./config/db.js";

dotenv.config({
  path: "./.env",
});

await sequelize
  .sync()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("MongoDB + Express Connected!");
    });
    app.listen(process.env.PORT, "0.0.0.0", () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("SQL connection failed !!! ", err);
  });

// // for vercel
// import dotenv from "dotenv";
// import { app } from "./app.js";
// import { Sequelize } from "sequelize";

// dotenv.config();

// // Database connection
// let sequelize;
// let dbConnected = false;

// async function connectDB() {
//   if (!dbConnected) {
//     sequelize = new Sequelize(
//       process.env.DB_NAME,
//       process.env.DB_USER,
//       process.env.DB_PASS,
//       {
//         host: process.env.DB_HOST,
//         dialect: "postgres", // or "mysql"
//         logging: false,
//       }
//     );

//     try {
//       await sequelize.authenticate();
//       console.log("Database connected!");
//       dbConnected = true;
//     } catch (err) {
//       console.error("Database connection failed:", err);
//     }
//   }
// }

// // Vercel serverless handler
// export default async function handler(req, res) {
//   await connectDB();
//   app(req, res); // Express handles the request
// }
