import express from "express";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js"; // Assuming admin and protect middleware
import {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import upload from "../middlewares/Upload.js";

const bannerRoutes = express.Router();

// Admin routes
bannerRoutes.post(
  "/create",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.single("image"),
  createBanner
);
// Create a new banner
bannerRoutes.get("/", getBanners); // Get all banners
bannerRoutes.get("/:id", getBannerById); // Get a banner by ID
// Update a banner by ID
bannerRoutes.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateBanner
);
// Delete a banner by ID
bannerRoutes.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteBanner
);

export default bannerRoutes;
