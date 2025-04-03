import express from "express";
import {
  // submitTaxForm,
  createTax,
  getAllTaxes,
  getTaxById,
  // updateTax,
  // deleteTax,
} from "../controllers/taxController.js";

const taxRoutes = express.Router();

// taxRoutes.post("/submit", submitTaxForm); // Submit tax form
taxRoutes.post("/", createTax); // Create a tax entry
taxRoutes.get("/", getAllTaxes); // Get all tax records
taxRoutes.get("/:id", getTaxById); // Get tax by ID
// taxRoutes.put("/:id", updateTax); // Update tax entry
// taxRoutes.delete("/:id", deleteTax); // Delete tax entry

export default taxRoutes;
