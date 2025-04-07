import express from "express";
import { isAuthenticatedUser } from "../middlewares/authMiddlewares.js";

import {
  createTax,
  getAllTaxes,
  getTaxById,
  getUserTaxHistory,
  createTaxAndPaymentURL,
  paymentStatusCheck,
  uploadTax
} from "../controllers/taxController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/authMiddlewares.js";
import CONSTANTS from "../constants/constants.js";

const taxRoutes = express.Router();

taxRoutes.post("/new", isAuthenticatedUser, createTax); // Create a tax entry
taxRoutes.get("/", getAllTaxes); // Get all tax records
taxRoutes.get("/:id", isAuthenticatedUser, getTaxById); // Get tax by ID
taxRoutes.get("/history/:userId", isAuthenticatedUser, getUserTaxHistory);
taxRoutes.post("/upload_tax", isAuthenticatedUser, authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]), uploadTax)

// Payment Routes
taxRoutes.post("/payment_url/", isAuthenticatedUser, createTaxAndPaymentURL);
taxRoutes.get(
  "/payment_status/:orderId",
  isAuthenticatedUser,
  paymentStatusCheck
);

export default taxRoutes;
