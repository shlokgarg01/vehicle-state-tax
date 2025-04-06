import mongoose from "mongoose";
import COLLECTION_NAMES from "../constants/collection.js";
import { MODES } from "../constants/constants.js";
import MongooseDelete from "mongoose-delete";
const stateSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: Object.values(MODES),
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

stateSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all", // Makes .find() ignore deleted docs by default
});

export default mongoose.model(COLLECTION_NAMES.STATE, stateSchema);
