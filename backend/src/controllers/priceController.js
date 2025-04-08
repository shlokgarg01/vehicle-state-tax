import Price from "../models/Price.js";
import asyncHandler from "express-async-handler";
import CONSTANTS from "../constants/constants.js";
import ApiFeatures from "../utils/apiFeatures.js";

// Create Price
export const createPrice = asyncHandler(async (req, res) => {
  const data = req.body;
  data.status = data.status || CONSTANTS.STATUS.ACTIVE;
  const price = await Price.create(data);
  res.status(201).json({ success: true, price });
});

// Get All Prices
export const getAllPrices = asyncHandler(async (req, res) => {
  const { perPage } = req.query;
  const query = Price.find().populate("state").sort({ createdAt: -1 });

  const apiFeature = new ApiFeatures(query, req.query)
    .filter()
    .pagination(Number(perPage) || 10);

  const data = await apiFeature.query.lean();
  const totalPrices = await Price.countDocuments(
    apiFeature.query.getFilter()
  );

  res.status(200).json({
    success: true,
    totalPrices,
    prices: data,
  });
});

// Update Price
export const updatePrice = asyncHandler(async (req, res) => {
  const price = await Price.findById(req.params.id);
  if (!price) {
    return res.status(404).json({ success: false, message: "Price not found" });
  }

  const updatedPrice = await Price.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ success: true, price: updatedPrice });
});
