import mongoose from "mongoose";
import { MODES, TAX_MODES, STATUS } from "../constants/constants.js";
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
      enum: [MODES.ROAD, MODES.BORDER],
      required: true,
    },
    taxMode: {
      type: String,
      enum: Object.values(TAX_MODES),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);
TaxModeSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

export default mongoose.model("TaxMode", TaxModeSchema);
