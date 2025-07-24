import express from "express";
import {
  createTax,
  getAllTaxes,
  getTaxById,
  getUserTaxHistory,
  createTaxAndPaymentURL,
  paymentStatusCheck,
  uploadTax,
  updateTax,
  paymentRedirect,
} from "../controllers/taxController.js";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../middlewares/authMiddlewares.js";
import CONSTANTS from "../constants/constants.js";

const taxRoutes = express.Router();

taxRoutes.post("/new", isAuthenticatedUser, createTax); // Create a tax entry
taxRoutes.get("/", getAllTaxes); // Get all tax records
taxRoutes.get('/paymentRedirect', paymentRedirect)
taxRoutes.get("/:id", isAuthenticatedUser, getTaxById); // Get tax by ID
taxRoutes.get("/history/:userId", isAuthenticatedUser, getUserTaxHistory);
taxRoutes.post(
  "/upload_tax",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN, CONSTANTS.USER_ROLES.MANAGER]),
  uploadTax
);
taxRoutes.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN, CONSTANTS.USER_ROLES.MANAGER]),
  updateTax
);

// Payment Routes
taxRoutes.post("/payment_url/", isAuthenticatedUser, createTaxAndPaymentURL);
taxRoutes.get(
  "/payment_status/:orderId",
  isAuthenticatedUser,
  paymentStatusCheck
);

export default taxRoutes;
