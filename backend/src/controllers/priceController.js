import Price from "../models/Price.js";
import asyncHandler from "express-async-handler";
import CONSTANTS from "../constants/constants.js";
import ApiFeatures from "../utils/apiFeatures.js";
//  Create Price
export const createPrice = asyncHandler(async (req, res) => {
  const data = req.body;
  data.status = data.status || CONSTANTS.STATUS.ACTIVE;

  // Remove empty fields so they don't cause validation issues
  if (!data.state) delete data.state;
  if (!data.seatCapacity) delete data.seatCapacity;
  if (!data.vehicleType) delete data.vehicleType;
  if (!data.weight) delete data.weight;

  try {
    // Build a dynamic duplicate query
    const duplicateQuery = {
      taxMode: data.taxMode,
      mode: data.mode,
    };

    if (data.state) duplicateQuery.state = data.state;
    if (data.seatCapacity) duplicateQuery.seatCapacity = data.seatCapacity;
    if (data.vehicleType) duplicateQuery.vehicleType = data.vehicleType;
    if (data.weight) duplicateQuery.weight = data.weight;

    duplicateQuery.deleted = false;

    const duplicate = await Price.findOne(duplicateQuery);

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `Price with same combination already exists.`,
      });
    }

    const price = await Price.create(data);
    res.status(201).json({ success: true, price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//  Get All Prices
export const getAllPrices = asyncHandler(async (req, res) => {
  try {
    const resultsPerPage = parseInt(req.query.perPage) || 10;

    const baseQuery = Price.find().sort({ createdAt: -1 }).populate("state");

    let apiFeature = new ApiFeatures(baseQuery, req.query).search().filter();

    if (req.query.state) {
      baseQuery.where("state").equals(req.query.state);
    }

    const totalPrices = await Price.countDocuments(
      apiFeature.query.getFilter()
    );

    apiFeature = apiFeature.pagination(resultsPerPage);
    const prices = await apiFeature.query;

    res.status(200).json({
      success: true,
      totalPrices,
      prices,
      filteredPricesCount: prices.length,
      resultsPerPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
