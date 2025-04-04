import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "" },
    imageUrl: { type: String, required: true }, // URL of the banner image
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      default: "",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
