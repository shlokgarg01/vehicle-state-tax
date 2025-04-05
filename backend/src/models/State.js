import mongoose from "mongoose";
import COLLECTION_NAMES from "../constants/collection";
import { MODES } from "../constants/constants";
import MongooseDelete from "mongoose-delete";
const stateSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: Object.values(MODES.ROAD, MODES.BORDER),
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
