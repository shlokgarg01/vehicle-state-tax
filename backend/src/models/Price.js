import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import CONSTANTS from "../constants/constants.js";
import COLLECTION_NAMES from "../constants/collection.js";

const priceSchema = new mongoose.Schema(
  {
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.STATE,
      required: true,
    },
    mode: {
      type: String,
      enum: Object.values(CONSTANTS.MODES),
      required: true,
    },
    taxMode: {
      type: String,
      enum: Object.values(CONSTANTS.TAX_MODES),
      required: true,
    },
    seatCapacity: {
      type: String,
      required: true,
      enum: Object.values(CONSTANTS.SEAT_CAPACITY),
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
      enum: Object.values(CONSTANTS.STATUS),
      default: CONSTANTS.STATUS.ACTIVE,
    },
    vehicleType: {
      type: String,
      enum: Object.values(CONSTANTS.VEHICLE_TYPES),
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
