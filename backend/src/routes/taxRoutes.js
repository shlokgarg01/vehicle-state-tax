import express from "express";
import {
  // submitTaxForm,
  createTax,
  getAllTaxes,
  getTaxById,
  getTaxesByStatus,
  getUserTaxHistory,
  // updateTax,
  // deleteTax,
} from "../controllers/taxController.js";
import { isAuthenticatedUser } from "../middlewares/authMiddlewares.js";

const taxRoutes = express.Router();

// taxRoutes.post("/submit", submitTaxForm);
taxRoutes.post("/", isAuthenticatedUser, createTax); // Create a tax entry
taxRoutes.get("/", getAllTaxes); // Get all tax records
taxRoutes.get("/:id", isAuthenticatedUser, getTaxById); // Get tax by ID
taxRoutes.get(
  "/user/tax-history/:userId",
  isAuthenticatedUser,
  getUserTaxHistory
);
// 🔹 Get orders by completion status
// Example: /api/v1/tax/status/BorderTax?is_completed=true(false)
taxRoutes.get("/status/:category", getTaxesByStatus);

// taxRoutes.put("/:id", updateTax); // Update tax entry
// taxRoutes.delete("/:id", deleteTax); // Delete tax entry

export default taxRoutes;
