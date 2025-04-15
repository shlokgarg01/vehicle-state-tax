import CONSTANTS from "../constants/constants.js";
import State from "../models/State.js";
import asyncHandler from "express-async-handler";
import { getFeatures } from "../helpers/getFeautres.js";
import { createOne } from "../helpers/createOne.js";
import { deleteOne } from "../helpers/deleteOne.js";
import { updateOne } from "../helpers/updateOne.js";

// Create a new state
export const createState = createOne(State, "State", {
  requiredFields: ["mode", "name"],
  sanitizeFields: ["mode", "name"],
  uniqueConditions: [
    {
      type: "and",
      condition: { mode: true, name: true }, // ← this tells createOne to pull these fields from req.body
      message: "State with this mode and name combination already exists",
    },
  ],
});

// Get all states
export const getAllStates = asyncHandler(async (req, res) => {
  const data = await getFeatures({
    Model: State,
    req,
    res,
    searchFields: ["name", "mode"],
    defaultSort: "-createdAt",
  });

  res.status(200).json(data);
});

// Delete (soft or hard) a state
export const deleteState = deleteOne(State, "State");

// Update a state
export const updateState = updateOne(State, "State", [
  "name",
  "mode",
  "status",
]);
