import mongoose from "mongoose";
import CONSTANTS from "../constants/constants.js";
import MongooseDelete from "mongoose-delete";
import COLLECTION_NAMES from "../constants/collection.js";

const TaxModeSchema = new mongoose.Schema(
  {
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.STATE,
      required: true,
    },
    mode: {
      type: String,
      enum: Object.values(CONSTANTS.TAX_CATEGORIES),
      required: true,
      lowercase: true,
    },
    taxMode: {
      type: String,
      enum: Object.values(CONSTANTS.TAX_MODES),
      required: true,
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

TaxModeSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

export default mongoose.model(COLLECTION_NAMES.TAX_MODE, TaxModeSchema);
