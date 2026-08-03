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
import { fileURLToPath } from 'url';

const app = express();

connectDB();

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

app.get("/ping", (_, res) => {
  res.status(200).json({
    message: "Server is running...",
  });
});

app.use("/api/v1", router);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientBuild = path.join(__dirname, "../../frontend/build");

app.get("/login", (req, res) => res.redirect(302, "/admin/login"));

app.use(express.static(clientBuild, { index: false }));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  if (req.path.includes(".")) {
    return next();
  }
  res.sendFile(path.resolve(clientBuild, "index.html"), (err) => {
    if (err) next(err);
  });
});

app.use(errorHandler);

export default app;
