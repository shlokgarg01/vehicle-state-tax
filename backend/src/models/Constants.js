import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import COLLECTION_NAMES from "../constants/collection.js";

const Schema = mongoose.Schema;

const constantsSchema = new Schema(
  {
    key: {
      type: String,
      required: [true, "Key is required"],
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      required: [true, "Value is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

constantsSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

const Constants = mongoose.model(COLLECTION_NAMES.CONSTANTS, constantsSchema);
export default Constants;
