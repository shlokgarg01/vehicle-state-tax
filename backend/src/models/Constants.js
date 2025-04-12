import mongoose from "mongoose";
import COLLECTION_NAMES from "../constants/collection.js";
import mongooseDelete from "mongoose-delete";

const constantsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

constantsSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

// mongoose.set("debug", true);
export default mongoose.model(COLLECTION_NAMES.CONSTANTS, constantsSchema);
