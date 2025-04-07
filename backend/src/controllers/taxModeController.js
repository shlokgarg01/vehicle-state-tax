import TaxMode from "../models/TaxMode.js";
import asyncHandler from "express-async-handler";
import { STATUS } from "../constants/constants.js";

// ➕ Create TaxMode
export const createTaxMode = asyncHandler(async (req, res) => {
  const { state, mode, taxMode, status } = req.body;

  const existing = await TaxMode.findOne({ state, mode, taxMode });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "TaxMode with this combination already exists",
    });
  }

  const newTaxMode = await TaxMode.create({
    state,
    mode,
    taxMode,
    status: status || STATUS.ACTIVE,
  });

  res.status(201).json({ success: true, taxMode: newTaxMode });
});

// 📄 Get All TaxModes
export const getAllTaxModes = asyncHandler(async (req, res) => {
  const taxModes = await TaxMode.find()
    .populate("state", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, taxModes });
});

// ✏️ Update TaxMode
export const updateTaxMode = asyncHandler(async (req, res) => {
  const { state, mode, taxMode, status } = req.body;
  const taxModeDoc = await TaxMode.findById(req.params.id);

  if (!taxModeDoc) {
    return res
      .status(404)
      .json({ success: false, message: "TaxMode not found" });
  }

  // Optional fields update
  taxModeDoc.state = state || taxModeDoc.state;
  taxModeDoc.mode = mode || taxModeDoc.mode;
  taxModeDoc.taxMode = taxMode || taxModeDoc.taxMode;
  taxModeDoc.status = status || taxModeDoc.status;

  const updated = await taxModeDoc.save();
  res.status(200).json({ success: true, taxMode: updated });
});
