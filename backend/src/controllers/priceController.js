import Price from "../models/Price.js";
import asyncHandler from "express-async-handler";
import CONSTANTS from "../constants/constants.js";
import ApiFeatures from "../utils/apiFeatures.js";
//  Create Price
export const createPrice = asyncHandler(async (req, res) => {
  const data = req.body;
  data.status = data.status || CONSTANTS.STATUS.ACTIVE;
  if (!data.state) delete data.state;

  try {
    const price = await Price.create(data);
    res.status(201).json({ success: true, price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 📥 Get All Prices
export const getAllPrices = asyncHandler(async (req, res) => {
  try {
    const resultsPerPage = Number(req.query.perPage) || 10;

    let apiFeature = new ApiFeatures(
      Price.find().sort({ createdAt: -1 }).populate("state"),
      req.query
    )
      .search(["mode", "state", "seatCapacity", "vehicleType", "weight"])
      .filter();

    // Count after filtering/searching (before pagination)
    const filteredPricesCount = await Price.countDocuments(
      apiFeature.query.getFilter()
    );

    // Apply pagination
    apiFeature = apiFeature.pagination(resultsPerPage);
    const prices = await apiFeature.query;

    // Total prices in DB (before any filters)
    const totalPrices = await Price.countDocuments();

    res.status(200).json({
      success: true,
      totalPrices,
      filteredPricesCount,
      prices,
      resultsPerPage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//  Update Price
export const updatePrice = asyncHandler(async (req, res) => {
  const price = await Price.findById(req.params.id);
  if (!price) {
    return res.status(404).json({ success: false, message: "Price not found" });
  }

  Object.assign(price, req.body);
  const updated = await price.save();
  res.status(200).json({ success: true, price: updated });
});

// delete price
export const deletePrice = asyncHandler(async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      res.status(404);
      throw new Error("Price not found");
    }

    await price.delete();

    res
      .status(200)
      .json({ success: true, message: "Price deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
