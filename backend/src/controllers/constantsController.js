import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Constants from "../models/Constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import ConstantsManager from "../managers/constantsManager.js";
import CONSTANTS from "../constants/constants.js";
import config from "../config/config.js";

const getUpiConstantFallback = (key) => {
  if (key === CONSTANTS.DB_CONSTANT_KEYS.BUSINESS_UPI_ID) {
    return config.upi?.merchantUpiId || "";
  }
  if (key === CONSTANTS.DB_CONSTANT_KEYS.UPI_PAYEE_NAME) {
    return config.upi?.payeeName || "Vehicle State Tax";
  }
  return undefined;
};

export const createConstant = catchAsyncErrors(async (req, res) => {
  let { key, value } = req.body
  if (!key || !value) {
    return res.status(400).json({ success: false, message: "key & value are required." });
  }

  await Constants.create({ key, value })

  res.status(200).json({
    success: true,
    message: "Constant added successfully",
  });
});

export const getConstantByKey = catchAsyncErrors(async (req, res) => {
  const key = req.params.key
  let val = await Constants.findOne({ key });
  const fallback = getUpiConstantFallback(key);
  const value =
    val?.value !== undefined && val?.value !== null && String(val.value).trim() !== ""
      ? val.value
      : fallback;

  res.status(200).json({
    success: true,
    message: "Value fetched successfully",
    key,
    value,
  });
});

export const getUpiConfig = catchAsyncErrors(async (req, res) => {
  const upiConfig = await ConstantsManager.getUpiConfig();

  res.status(200).json({
    success: true,
    message: "UPI config fetched successfully",
    data: upiConfig,
  });
});

// Update constant by key
export const updateConstantByKey = catchAsyncErrors(async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined || value === null) {
      return next(new ErrorHandler("Value is required", 400));
    }

    const constant = await Constants.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Constant updated successfully",
      constant,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// Get all constants
export const getAllConstants = catchAsyncErrors(async (req, res, next) => {
  try {
    const constants = await Constants.find();
    
    res.status(200).json({
      success: true,
      message: "Constants fetched successfully",
      constants,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

