import express from "express";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import cors from "cors";
import path from 'path';
import router from "./routes/index.js";
import "./jobs/taxJobs.js";

const app = express();

// mongodb connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(cookieParser());
app.use(
  cors({
    origin: config.cors_origin,
    credentials: true,
  })
);

// Server Status Check API
app.get("/ping", (_, res) => {
  res.status(200).json({
    message: "Server is running...",
  });
});

// Routes
app.use("/api/v1", router);

// This is the static frontend file. Whenever any change in frontend is made, u need to generate build file &then run server again.
// IMPORTANT - make sure that this static frontend route is after all the backend routes otherwise all API calls will fail.
app.use(express.static(path.join(__dirname, "../../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../../frontend/build/index.html")
  );
});

app.use(errorHandler);

export default app;
