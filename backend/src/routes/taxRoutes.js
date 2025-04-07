import express from "express";
import "../controllers/taxController.js";
import { isAuthenticatedUser } from "../middlewares/authMiddlewares.js";

const taxRoutes = express.Router();

taxRoutes.post("/new", isAuthenticatedUser, createTax); // Create a tax entry
taxRoutes.get("/", getAllTaxes); // Get all tax records
taxRoutes.get("/:id", isAuthenticatedUser, getTaxById); // Get tax by ID
taxRoutes.get("/history/:userId", isAuthenticatedUser, getUserTaxHistory);

// Payment Routes
taxRoutes.post("/payment_url/", isAuthenticatedUser, createTaxAndPaymentURL);
taxRoutes.get(
  "/payment_status/:orderId",
  isAuthenticatedUser,
  paymentStatusCheck
);
// taxRoutes.get("/payment_callback/", isAuthenticatedUser, paymentCallback);

export default taxRoutes;
