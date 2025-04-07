import mongoose from "mongoose";
import CONSTANTS from "../constants/constants.js";
import MongooseDelete from "mongoose-delete";

const TaxModeSchema = new mongoose.Schema(
  {
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    mode: {
      type: String,
      enum: [CONSTANTS.MODES.ROAD, CONSTANTS.MODES.BORDER],
      required: true,
    },
    taxMode: {
      type: String,
      enum: Object.values(CONSTANTS.TAX_MODES),
      required: true,
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

export default mongoose.model("TaxMode", TaxModeSchema);
