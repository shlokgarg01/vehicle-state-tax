import TaxMode from "../models/TaxMode.js";
import asyncHandler from "express-async-handler";
import CONSTANTS from "../constants/constants.js";
import ApiFeatures from "../utils/apiFeatures.js";

//  Create TaxMode
export const createTaxMode = asyncHandler(async (req, res) => {
  try {
    let { state, mode, taxMode, status } = req.body;

    if (!state || !mode || !taxMode) {
      return res.status(400).json({
        success: false,
        message: "State, mode, and taxMode are required fields.",
      });
    }

    mode = mode.trim().toUpperCase();
    taxMode = taxMode.trim().toUpperCase();

    const existing = await TaxMode.findOne({ state, mode, taxMode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `TaxMode already exists for state: ${state}, mode: ${mode}, taxMode: ${taxMode}`,
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create TaxMode",
      error: error.message,
    });
  }
});

// 📄 Get All TaxModes
export const getAllTaxModes = asyncHandler(async (req, res) => {
  try {
    const resultsPerPage = req.params.perPage || 10;
    let apiFeature = new ApiFeatures(
      TaxMode.find().sort({ createdAt: -1 }).populate("state"),
      req.query
    ).search(["mode", "state"]);

    const totalTaxModes = await TaxMode.countDocuments(
      apiFeature.query.getFilter()
    );
    apiFeature = apiFeature.pagination(resultsPerPage);
    const taxModes = await apiFeature.query;

    res.status(200).json({
      success: true,
      totalTaxModes,
      filteredTaxModesCount: taxModes.length,
      taxModes,
      resultsPerPage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// ✏️ Update TaxMode
export const updateTaxMode = asyncHandler(async (req, res) => {
  try {
    const { state, mode, taxMode, status } = req.body;
    const taxModeDoc = await TaxMode.findById(req.params.id);

    if (!taxModeDoc) {
      return res.status(404).json({
        success: false,
        message: "TaxMode not found",
      });
    }

    if (!state || !mode || !taxMode) {
      return res.status(400).json({
        success: false,
        message: "State, mode, and taxMode are required fields.",
      });
    }

    const normalizedMode = mode.trim().toUpperCase();
    const normalizedTaxMode = taxMode.trim().toUpperCase();

    const duplicate = await TaxMode.findOne({
      state,
      mode: normalizedMode,
      taxMode: normalizedTaxMode,
      _id: { $ne: req.params.id },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "A TaxMode with this state, mode, and taxMode already exists",
      });
    }

    taxModeDoc.state = state;
    taxModeDoc.mode = normalizedMode;
    taxModeDoc.taxMode = normalizedTaxMode;
    taxModeDoc.status = status || taxModeDoc.status;

    const updated = await taxModeDoc.save();

    res.status(200).json({
      success: true,
      taxMode: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update TaxMode",
      error: error.message,
    });
  }
});
