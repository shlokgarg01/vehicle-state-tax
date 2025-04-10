import TaxMode from "../models/TaxMode.js";
import asyncHandler from "express-async-handler";
import CONSTANTS from "../constants/constants.js";
import ApiFeatures from "../utils/apiFeatures.js";

// ➕ Create TaxMode
export const createTaxMode = asyncHandler(async (req, res) => {
  try {
    const { state, mode, taxMode, status } = req.body;

    const existing = await TaxMode.findOne({ state, mode, taxMode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A TaxMode with this state, mode, and taxMode already exists",
      });
    }

    const newTaxMode = await TaxMode.create({
      state,
      mode,
      taxMode,
      status: status || CONSTANTS.STATUS.ACTIVE,
    });

    res.status(201).json({ success: true, taxMode: newTaxMode });
  } catch (error) {
    console.error("Error creating TaxMode:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create TaxMode",
      error: error.message,
    });
  }
});

// 📄 Get All TaxModes
export const getAllTaxModes = asyncHandler(async (req, res, next) => {
  try {
    const resultPerPage = Number(req.query.perPage) || 10;

    const totalTaxModes = await TaxMode.countDocuments();

    const filteredQuery = new ApiFeatures(TaxMode.find(), req.query)
      .search(["taxMode", "mode", "status"])
      .filter();

    const filteredTaxModesCount = await filteredQuery.query
      .clone()
      .countDocuments();

    const apiFeatures = new ApiFeatures(
      TaxMode.find().populate("state", "name").sort({ createdAt: -1 }),
      req.query
    )
      .search(["taxMode", "mode", "status"])
      .filter()
      .pagination(resultPerPage);

    const taxModes = await apiFeatures.query;

    res.status(200).json({
      success: true,
      taxModes,
      totalTaxModes,
      filteredTaxModesCount,
    });
  } catch (error) {
    console.error("Error fetching tax modes:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tax modes",
      error: error.message,
    });
  }
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

  taxModeDoc.state = state || taxModeDoc.state;
  taxModeDoc.mode = mode || taxModeDoc.mode;
  taxModeDoc.taxMode = taxMode || taxModeDoc.taxMode;
  taxModeDoc.status = status || taxModeDoc.status;

  const updated = await taxModeDoc.save();
  res.status(200).json({ success: true, taxMode: updated });
});
