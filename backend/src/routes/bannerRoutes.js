import express from "express";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";
import {
  createBanner,
  getBanners,
  deleteBanner,
} from "../controllers/bannerController.js";
import CONSTANTS from "../constants/constants.js";

const bannerRoutes = express.Router();

// create banner
bannerRoutes.post(
  "/new",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  createBanner
);

// get and search banner
bannerRoutes.get("/all", isAuthenticatedUser, getBanners);

// delete banner
bannerRoutes.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  deleteBanner
);

export default bannerRoutes;
