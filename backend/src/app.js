import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import taxRoutes from "./routes/taxRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import stateRoutes from "./routes/stateRoutes.js";
import seatTypeRoutes from "./routes/seatTypesRoutes.js";
// import cors from "cors";
const app = express();

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tax", taxRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/state", stateRoutes);
app.use("/api/v1/seat-types", seatTypeRoutes);
app.use(errorHandler);

export default app;
