import TaxMode from "../models/TaxMode.js";
import asyncHandler from "express-async-handler";
import CONSTANTS from "../constants/constants.js";
import ApiFeatures from "../utils/apiFeatures.js";

// Create TaxMode
export const createTaxMode = asyncHandler(async (req, res) => {
  const { state, mode, taxMode, status } = req.body;

  const existing = await TaxMode.findOne({ state, mode, taxMode });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Tax Mode with these details already exists",
    });
  }

  const newTaxMode = await TaxMode.create({
    state,
    mode,
    taxMode,
    status: status || CONSTANTS.STATUS.ACTIVE,
  });

  res.status(201).json({ success: true, taxMode: newTaxMode });
});

// Get All TaxModes
export const getAllTaxModes = asyncHandler(async (req, res) => {
  const { perPage } = req.query;
  const query = TaxMode.find().populate("state").sort({ createdAt: -1 });

  const apiFeature = new ApiFeatures(query, req.query)
    .filter()
    .pagination(Number(perPage) || 10);

  const data = await apiFeature.query.lean();
  const totalTaxModes = await TaxMode.countDocuments(
    apiFeature.query.getFilter()
  );

  res.status(200).json({
    success: true,
    totalTaxModes,
    taxModes: data,
  });
});

// Update TaxMode
export const updateTaxMode = asyncHandler(async (req, res) => {
  const existingTaxMode = await TaxMode.findById(req.params.id);
  if (!existingTaxMode) {
    return res.status(404).json({ success: false, message: "taxMode not found" });
  }

  const updatedTaxMode = await TaxMode.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({ success: true, message: "Tax Mode updated", taxMode: updatedTaxMode });
});
