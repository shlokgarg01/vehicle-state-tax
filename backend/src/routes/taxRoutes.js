import express from "express";
import {
  createTax,
  getAllTaxes,
  getTaxById,
  getUserTaxHistory,
} from "../controllers/taxController.js";
import { isAuthenticatedUser } from "../middlewares/authMiddlewares.js";

const taxRoutes = express.Router();

taxRoutes.post("/new", isAuthenticatedUser, createTax); // Create a tax entry
taxRoutes.get("/", getAllTaxes); // Get all tax records
taxRoutes.get("/:id", isAuthenticatedUser, getTaxById); // Get tax by ID
taxRoutes.get("/history/:userId", isAuthenticatedUser, getUserTaxHistory);

export default taxRoutes;
