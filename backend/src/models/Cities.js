import mongoose from "mongoose";
import COLLECTION_NAMES from "../constants/collection.js";

const citiesSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      default: "",
      required: true,
      trim: true,
      lowercase: true,
    },
    cities: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// This will replace the space with underscore in state
citiesSchema.pre("save", function (next) {
  if (this.state) {
    this.state = this.state.replace(/\s+/g, "_");
  }
  next();
});

mongoose.set("debug", true);
export default mongoose.model(COLLECTION_NAMES.CITIES, citiesSchema);
