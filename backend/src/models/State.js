import mongoose from "mongoose";
import CONSTANTS from "../constants/constants.js";
import MongooseDelete from "mongoose-delete";
import COLLECTION_NAMES from "../constants/collection.js";

const StateSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: Object.values(CONSTANTS.TAX_CATEGORIES),
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.STATUS),
      default: CONSTANTS.STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

// This will replace the space with underscore in name
StateSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.replace(/\s+/g, "_");
  }
  next();
});

StateSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

export default mongoose.model(COLLECTION_NAMES.STATE, StateSchema);
