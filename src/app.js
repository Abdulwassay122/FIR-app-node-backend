import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello from Vercel + Express!");
});
//routes import
import healthcheckRouter from "./routes/healthcheck.routes.js";
import complainantRouter from "./routes/complainant.routes.js";
import arrestRouter from "./routes/arrest.routes.js";
import crimeRouter from "./routes/crime.routes.js";
import evidenceRouter from "./routes/evidence.routes.js";
import firRouter from "./routes/fir.routes.js";
import historyRouter from "./routes/history.routes.js";
import officerRouter from "./routes/officer.routes.js";
import policeStationRouter from "./routes/policeStation.routes.js";
import suspectRouter from "./routes/suspect.routes.js";
import dashboard from "./routes/dashboard.routes.js";
import ingest from "./routes/ingest.routes.js";
import { ApiError } from "./utils/ApiError.js";

//routes declaration
app.use("/api/healthcheck", healthcheckRouter);
app.use("/api/complainants", complainantRouter);
app.use("/api/arrests", arrestRouter);
app.use("/api/crime", crimeRouter);
app.use("/api/evidence", evidenceRouter);
app.use("/api/firs", firRouter);
app.use("/api/history", historyRouter);
app.use("/api/officers", officerRouter);
app.use("/api/stations", policeStationRouter);
app.use("/api/suspects", suspectRouter);
app.use("/api/analytics", dashboard);
app.use("/api/ingest", ingest)

const globalErrorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  console.error(err);

  res.status(500).json({
    statusCode: 500,
    success: false,
    message: err.message || "Internal Server Error",
    errors: [],
  });
};

app.use(globalErrorHandler);

export { app };
