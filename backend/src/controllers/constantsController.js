import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Constants from "../models/Constants.js";

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

export const getConstantValue = catchAsyncErrors(async (req, res) => {
  const key = req.params.key
  let val = await Constants.findOne({ key });

  res.status(200).json({
    success: true,
    message: "Value fetched successfully",
    key,
    value: val?.value
  });
});

