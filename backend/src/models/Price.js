import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import {
  MODES,
  SEAT_CAPACITY,
  STATUS,
  TAX_MODES,
} from "../constants/constants.js";
import COLLECTION_NAMES from "../constants/collection.js";
import { VEHICLE_TYPES } from "../constants/constants.js";

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
    price1: {
      type: Number,
      required: true,
    },
    price2: {
      type: Number,
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
    vehicleType: {
      type: String,
      enum: Object.values(VEHICLE_TYPES),
    },
    weight: {
      type: Number,
    },
  },
  { timestamps: true }
);

priceSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

export default mongoose.model(COLLECTION_NAMES.PRICE, priceSchema);
