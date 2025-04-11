import CONSTANTS from "../constants/constants.js";
import State from "../models/State.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";

//  Create a new state
export const createState = asyncHandler(async (req, res) => {
  const { name, mode, status } = req.body;

  const isExistingState = await State.findOne({ name: name.trim(), mode });
  if (isExistingState) {
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
  res.status(201).json({ success: true, state });
});

//  Get all states
export const getAllStates = asyncHandler(async (req, res) => {
  try {
    const resultsPerPage = req.query.perPage || 10;
    const filter = {};
    if (req.query.mode) {
      filter.mode = req.query.mode;
    }

    const filteredStatesCount = await State.countDocuments(filter);
    let apiFeature = new ApiFeatures(State.find(), req.query)

      .filter()
      .sort("-createdAt")
      .pagination(resultsPerPage);

    const totalStates = await State.countDocuments(
      apiFeature.query.getFilter?.() || {}
    );
    const states = await apiFeature.query;

    res.status(200).json({
      success: true,
      totalStates,
      states,
      filteredStatesCount,
      resultsPerPage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a state
export const updateState = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const state = await State.findById(id);
  if (!state) {
    return res.status(404).json({
      success: false,
      message: "State not found",
    });
  }

  try {
    const updatedState = await State.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      state: updatedState,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while updating the state",
    });
  }
});
