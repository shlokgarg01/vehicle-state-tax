import express from "express";
import {
  submitTaxForm,
  getTaxByVehicleNumber,
  getAllTaxes,
  updateTaxRecord,
  deleteTaxRecord,
} from "../controllers/taxController.js";

const taxRoutes = express.Router();

taxRoutes.post("/submit", submitTaxForm); // Submit tax form
taxRoutes.get("/vehicle/:vehicleNumber", getTaxByVehicleNumber); // Fetch tax by vehicle
taxRoutes.get("/", getAllTaxes); // Fetch all taxes
taxRoutes.put("/:taxId", updateTaxRecord); // Update tax record
taxRoutes.delete("/:taxId", deleteTaxRecord); // Delete tax record

export default taxRoutes;
