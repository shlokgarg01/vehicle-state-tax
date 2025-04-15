import TaxMode from "../models/TaxMode.js";
import asyncHandler from "express-async-handler";
import CONSTANTS from "../constants/constants.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { updateOne } from "../helpers/updateOne.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import { createOne } from "../helpers/createOne.js";
import { getFeatures } from "../helpers/getFeautres.js";

//  Create TaxMode
export const createTaxMode = createOne(TaxMode, "TaxMode", {
  requiredFields: ["state", "mode", "taxMode"],
  sanitizeFields: ["mode", "taxMode"],
  uniqueConditions: [
    {
      type: "and",
      condition: { state: true, mode: true, taxMode: true },
      message: "TaxMode already exists for this state, mode, and taxMode.",
    },
  ],
  defaultFields: { status: CONSTANTS.STATUS.ACTIVE },
  caseInsensitiveFields: ["state", "mode", "taxMode"],
});
// 📄 Get All TaxModes
export const getAllTaxModes = asyncHandler(async (req, res) => {
  const result = await getFeatures({
    Model: TaxMode,
    req,
    res,
    searchFields: ["mode", "state"],
    populate: "state",
    projection: "-__v",
    defaultLimit: 10,
  });

  if (res.headersSent) return; // Ensure response wasn't already handled on error
  res.status(200).json(result);
});

// ✏️ Update TaxMode
export const updateTaxMode = updateOne(TaxMode, "TaxMode", {
  sanitizeFields: ["mode", "taxMode"],
  customValidation: async ({ body, doc, req }) => {
    const { state, mode, taxMode } = body;

    if (!state || !mode || !taxMode) {
      throw new ErrorHandler(
        "State, mode, and taxMode are required fields",
        400
      );
    }

    // Normalize mode and taxMode to uppercase
    body.mode = mode.trim().toUpperCase();
    body.taxMode = taxMode.trim().toUpperCase();

    const duplicate = await TaxMode.findOne({
      _id: { $ne: req.params.id },
      state,
      mode: body.mode,
      taxMode: body.taxMode,
    });

    if (duplicate) {
      throw new ErrorHandler(
        "A TaxMode with this state, mode, and taxMode already exists",
        400
      );
    }
  },
});
