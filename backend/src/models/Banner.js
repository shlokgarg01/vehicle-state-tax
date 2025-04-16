import mongoose from "mongoose";
import CONSTANTS from "../constants/constants.js";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: CONSTANTS.STATUS,
      default: CONSTANTS.STATUS.ACTIVE,
    },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// mongose.set("debug", true);
const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
