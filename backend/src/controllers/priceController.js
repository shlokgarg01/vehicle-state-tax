import Price from "../models/Price.js";
import asyncHandler from "express-async-handler";
import CONSTANTS from "../constants/constants.js";
import { getFeatures } from "../helpers/getFeautres.js";
import { createOne } from "../helpers/createOne.js";
import { updateOne } from "../helpers/updateOne.js";
import { deleteOne } from "../helpers/deleteOne.js";

//  Create Price
export const createPrice = createOne(Price, "Price", {
  requiredFields: ["mode", "price1"],
  sanitizeFields: ["mode"],
  defaultFields: { status: CONSTANTS.STATUS.ACTIVE },
  beforeSave: async (body) => {
    if (!body.state) delete body.state; // handle optional field
  },
});

//  Get All Prices (with filtering, searching, sorting, pagination)
export const getAllPrices = asyncHandler(async (req, res) => {
  const data = await getFeatures({
    Model: Price,
    req,
    res,
    searchFields: ["mode", "state", "seatCapacity", "vehicleType", "weight"],
    defaultSort: "-createdAt",
    populate: "state",
  });

  res.status(200).json(data);
});

//  Update Price
export const updatePrice = updateOne(Price, "Price");

//  Delete Price
export const deletePrice = deleteOne(Price, "Price");
