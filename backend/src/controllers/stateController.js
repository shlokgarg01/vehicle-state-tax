import { STATUS } from "../constants/constants.js";
import State from "../models/State.js";
import asyncHandler from "express-async-handler";

//  Create a new state
export const createState = asyncHandler(async (req, res) => {
  const { name, mode, status } = req.body;

  const existing = await State.findOne({ name: name.trim(), mode });
  console.log(existing);
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "State with this name and mode already exists",
    });
  }

  const state = await State.create({
    name: name.trim(),
    mode,
    status: status || STATUS.ACTIVE,
  });
  console.log(state);
  res.status(201).json({ success: true, state });
});

//  Get all states
export const getAllStates = asyncHandler(async (req, res) => {
  const states = await State.find().sort({ name: 1 });
  res.status(200).json({ success: true, states });
});
//  Update a state
export const updateState = asyncHandler(async (req, res) => {
  const { name, mode, status } = req.body;
  const state = await State.findById(req.params.id);

  if (!state) {
    return res.status(404).json({ success: false, message: "State not found" });
  }

  state.name = name?.trim() || state.name;
  state.mode = mode || state.mode;
  state.status = status || state.status;

  const updatedState = await state.save();
  res.status(200).json({ success: true, state: updatedState });
});
