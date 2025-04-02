import asyncHandler from "express-async-handler";
import { Tax } from "../models/Tax.js";
import { BorderTax } from "../models/Tax.js";
import { RoadTax } from "../models/Tax.js";
import { AllIndiaPermit } from "../models/Tax.js";
import { AllIndiaTax } from "../models/Tax.js";

// 🏷️ Helper function to calculate tax based on different factors
const calculateTaxAmount = (category, taxMode, vehicleType, seatCapacity) => {
  let amount = 0;

  switch (category) {
    case "border":
      amount = taxMode === "yearly" ? 5000 : 1000; // Example tax logic
      break;
    case "road":
      amount = vehicleType === "heavy" ? 8000 : 4000;
      break;
    case "allIndiaPermit":
      amount = seatCapacity > 20 ? 10000 : 7000;
      break;
    case "allIndiaTax":
      amount = 12000;
      break;
    default:
      throw new Error("Invalid tax category");
  }
  return amount;
};

// 📝 User submits tax form (Creates Tax Record)
const submitTaxForm = asyncHandler(async (req, res) => {
  const {
    vehicleNumber,
    mobileNumber,
    taxMode,
    taxFromTo,
    category,
    seatCapacity,
    vehicleType,
  } = req.body;

  if (!vehicleNumber || !mobileNumber || !taxMode || !taxFromTo || !category) {
    res.status(400);
    throw new Error("All required fields must be filled");
  }

  const amount = calculateTaxAmount(
    category,
    taxMode,
    vehicleType,
    seatCapacity
  );

  let taxData = { vehicleNumber, mobileNumber, taxMode, taxFromTo, amount };

  switch (category) {
    case "border":
      taxData = new BorderTax({
        ...taxData,
        state: req.body.state,
        borderCity: req.body.borderCity,
        taxUptoDate: req.body.taxUptoDate,
      });
      break;
    case "road":
      taxData = new RoadTax({
        ...taxData,
        chassisNumber: req.body.chassisNumber,
      });
      break;
    case "allIndiaPermit":
      taxData = new AllIndiaPermit({
        ...taxData,
        chassisNumber: req.body.chassisNumber,
      });
      break;
    case "allIndiaTax":
      taxData = new AllIndiaTax({
        ...taxData,
        chassisNumber: req.body.chassisNumber,
      });
      break;
    default:
      res.status(400);
      throw new Error("Invalid category");
  }

  await taxData.save();
  res.status(201).json({ message: "Tax record created successfully", taxData });
});

// 🔍 Fetch Tax Record by Vehicle Number
const getTaxByVehicleNumber = asyncHandler(async (req, res) => {
  const { vehicleNumber } = req.params;

  const taxRecord = await Tax.findOne({ vehicleNumber });

  if (!taxRecord) {
    res.status(404);
    throw new Error("No tax record found");
  }

  res.status(200).json(taxRecord);
});

// 📋 Fetch All Tax Records
const getAllTaxes = asyncHandler(async (req, res) => {
  const taxes = await Tax.find({});
  res.status(200).json(taxes);
});

// ✏️ Update Tax Record
const updateTaxRecord = asyncHandler(async (req, res) => {
  const { taxId } = req.params;
  const taxRecord = await Tax.findById(taxId);

  if (!taxRecord) {
    res.status(404);
    throw new Error("Tax record not found");
  }

  Object.assign(taxRecord, req.body);
  await taxRecord.save();

  res.status(200).json({ message: "Tax record updated", taxRecord });
});

// ❌ Delete Tax Record
const deleteTaxRecord = asyncHandler(async (req, res) => {
  const { taxId } = req.params;
  const taxRecord = await Tax.findById(taxId);

  if (!taxRecord) {
    res.status(404);
    throw new Error("Tax record not found");
  }

  await taxRecord.deleteOne();
  res.status(200).json({ message: "Tax record deleted" });
});

export {
  submitTaxForm,
  getTaxByVehicleNumber,
  getAllTaxes,
  updateTaxRecord,
  deleteTaxRecord,
};
