import express from "express";
import { protect, admin } from "../middlewares/authMiddlewares.js"; // Assuming admin and protect middleware
import {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";

const bannerRoutes = express.Router();

// Admin routes
bannerRoutes.post("/create", protect, admin, createBanner); // Create a new banner
bannerRoutes.get("/", getBanners); // Get all banners
bannerRoutes.get("/:id", getBannerById); // Get a banner by ID
bannerRoutes.put("/:id", protect, admin, updateBanner); // Update a banner by ID
bannerRoutes.delete("/:id", protect, admin, deleteBanner); // Delete a banner by ID

export default bannerRoutes;
