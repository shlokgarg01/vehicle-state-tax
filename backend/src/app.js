import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
// import notFound from "./middlewares/notFoundMiddleware.js";
import taxRoutes from "./routes/taxRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
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
// app.use("/api/v1/tax", taxRoutes);
// app.use("/api/v1/banner", bannerRoutes);
// app.use("/api/v1/admin", adminRoutes);
// Handle Undefined Routes
// app.use(notFound);
// Global Error Handler Middleware (Should be placed last)
app.use(errorHandler);

export default app;
// /api/v1/tax --> change
// /api/v2/tax
