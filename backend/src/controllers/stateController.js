import State from "../models/State.js";
import asyncHandler from "express-async-handler";

// ➕ Create a new state
export const createState = asyncHandler(async (req, res) => {
  const { name, code } = req.body;

  const existing = await State.findOne({ name });
  if (existing) {
    return res
      .status(400)
      .json({ success: false, message: "State already exists" });
  }

  const state = await State.create({ name, code });
  res.status(201).json({ success: true, state });
});

// 🔍 Get all states
export const getAllStates = asyncHandler(async (req, res) => {
  const states = await State.find().sort({ name: 1 });
  res.status(200).json({ success: true, states });
});

// ❌ Delete a state
export const deleteState = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const state = await State.findById(id);

  if (!state) {
    return res.status(404).json({ success: false, message: "State not found" });
  }

  await state.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "State deleted successfully" });
});
