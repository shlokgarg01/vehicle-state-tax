import express from "express";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/authMiddlewares.js";
import { createBanner, getBanners, deleteBanner } from "../controllers/bannerController.js";
import CONSTANTS from "../constants/constants.js";

const bannerRoutes = express.Router();

bannerRoutes.post(
  "/new",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  createBanner
);
bannerRoutes.get("/all", isAuthenticatedUser, getBanners);
bannerRoutes.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  deleteBanner
);

export default bannerRoutes;
