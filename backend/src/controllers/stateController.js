import CONSTANTS from "../constants/constants.js";
import State from "../models/State.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";

//  Create a new state
export const createState = asyncHandler(async (req, res) => {
  const { name, mode, status } = req.body;

  const existing = await State.findOne({ name: name.trim(), mode });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "State with this name and mode already exists",
    });
  }

  const state = await State.create({
    name: name.trim(),
    mode,
    status: status || CONSTANTS.STATUS.ACTIVE,
  });
  res.status(200).json({ success: true, message: "State created", state });
});

//  Get all states
export const getAllStates = asyncHandler(async (req, res) => {
  const { perPage } = req.query;
  const query = State.find().sort({ createdAt: -1 });

  const apiFeature = new ApiFeatures(query, req.query)
    .search(["name"])
    .filter()
    .pagination(Number(perPage) || 10);

  const data = await apiFeature.query.lean();
  const totalStates = await State.countDocuments(
    apiFeature.query.getFilter()
  );

  res.status(200).json({
    success: true,
    totalStates,
    taxes: data,
  });
});

//  Update a state
export const updateState = asyncHandler(async (req, res) => {
  const existingState = await State.findById(req.params.id);
  if (!existingState) {
    return res.status(404).json({ success: false, message: "State not found" });
  }

  const updatedState = await State.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res
    .status(200)
    .json({ success: true, message: "State updated", state: updatedState });
});
