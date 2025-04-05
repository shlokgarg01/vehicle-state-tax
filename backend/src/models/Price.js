import mongoose from "mongoose";
import {
  MODES,
  SEAT_CAPACITY,
  STATUS,
  TAX_MODES,
} from "../constants/constants.js";
import COLLECTION_NAMES from "../constants/collection.js";
import MongooseDelete from "mongoose-delete";

const priceSchema = new mongoose.Schema(
  {
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    mode: {
      type: String,
      enum: Object.values(MODES),
      required: true,
    },
    taxMode: {
      type: String,
      enum: Object.values(TAX_MODES),
      required: true,
    },
    seatCapacity: {
      type: String,
      required: true,
      enum: Object.values(SEAT_CAPACITY),
    },
    price: {
      type: Number,
      required: true,
    },
    serviceCharge: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);
priceSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: "all", // Makes .find() ignore deleted docs by default
});
export default mongoose.model(COLLECTION_NAMES.PRICE, priceSchema);
