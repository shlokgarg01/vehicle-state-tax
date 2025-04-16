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

    const existing = await TaxMode.findOne({ state, mode, taxMode }).populate(
      "state",
      "name"
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A tax mode for "${taxMode}" already exists in  "${
          existing.state?.name || "the selected state"
        }" under "${mode}" mode. Please choose a different combination.`,
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
    res.status(500).json({
      success: false,
      message: "Failed to create TaxMode",
      error: error.message,
    });
  }
});

//  Get All TaxModes
export const getAllTaxModes = asyncHandler(async (req, res) => {
  try {
    const resultsPerPage = parseInt(req.query.perPage) || 10;

    // Initial query with deleted: false
    const baseQuery = TaxMode.find().sort({ createdAt: -1 }).populate("state");

    // Apply filters/search
    let apiFeature = new ApiFeatures(baseQuery, req.query)
      .search(["status", "taxMode", "mode"])
      .filter();

    if (req.query.state) {
      // handling for ObjectId
      baseQuery.where("state").equals(req.query.state);
    }

    // Get count BEFORE pagination — this is filtered count
    const totalTaxModes = await TaxMode.countDocuments(
      apiFeature.query.getFilter()
    );

    // Apply pagination after counting
    apiFeature = apiFeature.pagination(resultsPerPage);
    const taxModes = await apiFeature.query;

    res.status(200).json({
      success: true,
      totalTaxModes,
      taxModes,
      filteredTaxModesCount: taxModes.length,
      resultsPerPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//  Update TaxMode
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
    res.status(500).json({
      success: false,
      message: "Failed to update TaxMode",
      error: error.message,
    });
  }
});

// delete taxMode
export const deleteTaxMode = asyncHandler(async (req, res) => {
  try {
    const taxMode = await TaxMode.findById(req.params.id);

    if (!taxMode) {
      res.status(404);
      throw new Error("Tax Mode not found");
    }
    await taxMode.delete();

    res
      .status(200)
      .json({ success: true, message: "Tax Mode deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
