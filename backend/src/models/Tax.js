import mongoose from "mongoose";
import { TAX_MODES, VEHICLE_TYPES } from "../constants/constants.js";

const BaseTaxSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true }, //
    mobileNumber: { type: String, required: true }, //
    seatCapacity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SeatType",
      required: false, // or true, depending on your need
    },

    taxMode: {
      type: String,
      enum: Object.values(TAX_MODES),
      required: true,
    },
    taxFromTo: { type: Date, required: true }, //
    amount: { type: Number }, //
    file_url: { type: String, default: "" }, //
    is_completed: { type: Boolean, default: false }, //
    order_id: { type: String, default: "" }, //
    payment_id: { type: String, default: "" }, //
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //
  },
  { timestamps: true }
);
// export default BaseTaxSchema;
const BorderTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj, // Inherit s
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true,
  },

  borderCity: { type: String, required: true }, //
  taxUptoDate: { type: Date, required: true }, //
});
const BorderTax = mongoose.model("BorderTax", BorderTaxSchema);
const LoadingVehicleTaxSchema = new mongoose.Schema({
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true,
  },

  vehicleNumber: { type: String, required: true }, //
  mobileNumber: { type: String, required: true }, //

  taxMode: {
    type: String,
    enum: Object.values(TAX_MODES),
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: Object.values(VEHICLE_TYPES),
  },
  weight: { type: Number, required: true }, //
});
const LoadingVehicle = mongoose.model(
  "LoadingVehicle",
  LoadingVehicleTaxSchema
);

const RoadTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj, // Inherit s
  taxMode: {
    type: String,
    enum: [TAX_MODES.YEARLY, TAX_MODES.QUARTERLY],
    required: true,
  },
  chassisNumber: { type: String, required: true }, //
});

const RoadTax = mongoose.model("RoadTax", RoadTaxSchema);
const AllIndiaPermitSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj, // Inherit s
  taxMode: {
    type: String,
    enum: [TAX_MODES.YEARLY],
    required: true,
  },
  chassisNumber: { type: String, required: true }, //
});

const AllIndiaPermit = mongoose.model("AllIndiaPermit", AllIndiaPermitSchema);
const AllIndiaTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj, // Inherit s
  taxMode: {
    type: String,
    enum: [TAX_MODES.YEARLY, TAX_MODES.QUARTERLY],
    required: true,
  },
  chassisNumber: { type: String, required: true }, //
});

const AllIndiaTax = mongoose.model("AllIndiaTax", AllIndiaTaxSchema);
export { BorderTax, RoadTax, AllIndiaPermit, AllIndiaTax, LoadingVehicle };
