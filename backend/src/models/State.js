import mongoose from "mongoose";
import { MODES, STATUS } from "../constants/constants.js";
import MongooseDelete from "mongoose-delete";

const StateSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: [MODES.ROAD, MODES.BORDER],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

StateSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

export default mongoose.model("State", StateSchema);
