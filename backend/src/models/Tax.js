import mongoose from "mongoose";
import { TAX_MODES, LOADING_VEHICLE_TYPES } from "../constants/constants.js";
import COLLECTION_NAMES from "../constants/collection.js";

const BaseTaxSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    seatCapacity: { type: String },
    taxMode: {
      type: String,
      enum: Object.values(TAX_MODES),
      required: true,
    },
    startDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    fileUrl: { type: String, default: "" },
    isCompleted: { type: Boolean, default: false },
    orderId: { type: String, default: "", required: true },
    paymentId: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
    },
    chasisNumber: { type: String },
  },
  { timestamps: true }
);

const BorderTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj,
  state: { type: String, required: true, lowercase: true },
  border: { type: String, required: true },
  endDate: { type: Date },
});

const BorderTax = mongoose.model(COLLECTION_NAMES.BORDER_TAX, BorderTaxSchema);

const LoadingVehicleTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj,
  state: { type: String, required: true, lowercase: true },

  border: { type: String, required: true },
  vehicleType: {
    type: String,
    required: true,
    enum: Object.values(LOADING_VEHICLE_TYPES),
  },
  weight: { type: Number, required: true },
});

const LoadingVehicle = mongoose.model(
  COLLECTION_NAMES.LOADING_VEHICLE,
  LoadingVehicleTaxSchema
);

const RoadTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj,
});

const RoadTax = mongoose.model(COLLECTION_NAMES.ROAD_TAX, RoadTaxSchema);

const AllIndiaPermitSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj,
});

const AllIndiaPermit = mongoose.model(
  COLLECTION_NAMES.ALL_INDIA_PERMIT,
  AllIndiaPermitSchema
);

const AllIndiaTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj,
});

const AllIndiaTax = mongoose.model(
  COLLECTION_NAMES.ALL_INDIA_TAX,
  AllIndiaTaxSchema
);

export { BorderTax, RoadTax, AllIndiaPermit, AllIndiaTax, LoadingVehicle };
