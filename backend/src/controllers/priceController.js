import Price from "../models/Price.js";
import asyncHandler from "express-async-handler";
import CONSTANTS from "../constants/constants.js";

// ➕ Create Price
export const createPrice = asyncHandler(async (req, res) => {
  const data = req.body;
  data.status = data.status || CONSTANTS.STATUS.ACTIVE;
  const price = await Price.create(data);
  res.status(201).json({ success: true, price });
});

// 📥 Get All Prices
export const getAllPrices = asyncHandler(async (_req, res) => {
  const prices = await Price.find().populate("state").sort({ createdAt: -1 });
  res.status(200).json({ success: true, prices });
});

// ✏️ Update Price
export const updatePrice = asyncHandler(async (req, res) => {
  const price = await Price.findById(req.params.id);
  if (!price) {
    return res.status(404).json({ success: false, message: "Price not found" });
  }

  Object.assign(price, req.body);
  const updated = await price.save();
  res.status(200).json({ success: true, price: updated });
});
