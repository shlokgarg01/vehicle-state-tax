import mongoose from "mongoose";
import { IMAGE_EXT_REGEX } from "../helpers/validators.js";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "" },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (url) => IMAGE_EXT_REGEX.test(url),
        message: "Invalid image or PDF file URL",
      },
    },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

mongoose.set("debug", true);
const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
