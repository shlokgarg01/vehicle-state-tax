import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Constants from "../models/Constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

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

  res.status(200).json({
    success: true,
    message: "Value fetched successfully",
    key,
    value: val?.value
  });
});

// Update constant by key
export const updateConstantByKey = catchAsyncErrors(async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
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

