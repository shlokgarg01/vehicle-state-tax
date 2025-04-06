import mongoose from "mongoose";
import { TAX_MODES, LOADING_VEHICLE_TYPES } from "../constants/constants.js";
import COLLECTION_NAMES from "../constants/collection.js";

const BaseTaxSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
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

const BorderTaxSchema = BaseTaxSchema.clone();
BorderTaxSchema.add({
  ...BaseTaxSchema.obj,
  state: { type: String, required: true, lowercase: true },
  border: { type: String, required: true },
  endDate: { type: Date },
});


const LoadingVehicleTaxSchema = BaseTaxSchema.clone();
LoadingVehicleTaxSchema.add({
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


const RoadTaxSchema = BaseTaxSchema.clone();
const AllIndiaPermitSchema = BaseTaxSchema.clone();
const AllIndiaTaxSchema = BaseTaxSchema.clone();

mongoose.set("debug", true);

const LoadingVehicle = mongoose.model( COLLECTION_NAMES.LOADING_VEHICLE, LoadingVehicleTaxSchema );
const RoadTax = mongoose.model(COLLECTION_NAMES.ROAD_TAX, RoadTaxSchema);
const AllIndiaTax = mongoose.model( COLLECTION_NAMES.ALL_INDIA_TAX, AllIndiaTaxSchema );
const AllIndiaPermit = mongoose.model( COLLECTION_NAMES.ALL_INDIA_PERMIT, AllIndiaPermitSchema );
const BorderTax = mongoose.model(COLLECTION_NAMES.BORDER_TAX, BorderTaxSchema);

export { BorderTax, RoadTax, AllIndiaPermit, AllIndiaTax, LoadingVehicle };
