import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    url: {
      type: String,
      required: true,
    },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

mongoose.set("debug", true);
const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
