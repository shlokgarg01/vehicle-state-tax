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

//  Get All Prices
export const getAllPrices = asyncHandler(async (req, res) => {
  try {
    const resultPerPage = Number(req.query.perPage) || 10;

    const baseQuery = new ApiFeatures(Price.find().populate("state"), req.query)
      .search(["seatCapacity", "taxMode", "mode"])
      .filter()
   
    const filteredCount = await baseQuery.query.clone().countDocuments();

    baseQuery.sort("-createdAt").pagination(resultPerPage);

    const prices = await baseQuery.query;

    const totalCount = await Price.countDocuments();

    res.status(200).json({
      success: true,
      prices,
      totalCount,
      filteredCount,
      perPage: resultPerPage,
      totalPages: Math.ceil(filteredCount / resultPerPage),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch prices",
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
