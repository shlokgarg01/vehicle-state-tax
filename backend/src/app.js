import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

// mongodb connection
connectDB();

// Middleware
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
app.use(
  cors({
    origin: config.cors_origin,
    credentials: true,
  })
);

// Routes
app.use("/api/v1", router);
app.use(errorHandler);

export default app;
