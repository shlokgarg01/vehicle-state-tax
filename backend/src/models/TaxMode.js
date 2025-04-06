import mongoose from "mongoose";
import COLLECTION_NAMES from "../constants/collection";
import { MODES, STATUS, TAX_MODES } from "../constants/constants";
import MongooseDelete from "mongoose-delete";

const taxModeSchema = new mongoose.Schema(
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
taxModeSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all", // Makes .find() ignore deleted docs by default
});

export default mongoose.model(COLLECTION_NAMES.TAX_MODE, taxModeSchema);
