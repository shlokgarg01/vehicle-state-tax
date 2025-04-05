import mongoose from "mongoose";
import COLLECTION_NAMES from "../constants/collection";

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    code: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const State = mongoose.model(COLLECTION_NAMES.STATE, stateSchema);
export default State;
// create and search update
// stae-- > tax;
