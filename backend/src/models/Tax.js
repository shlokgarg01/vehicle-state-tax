import mongoose from "mongoose";
import CONSTANTS from "../constants/constants.js";
import COLLECTION_NAMES from "../constants/collection.js";

const taxSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    seatCapacity: { type: String },
    taxMode: {
      type: String,
      enum: Object.values(CONSTANTS.TAX_MODES),
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(CONSTANTS.TAX_CATEGORIES),
    },
    whoCompleted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.EMPLOYEE,
    }, // id of the employee who completed the Tax i.e. who uploaded the tax.
    startDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    fileUrl: { type: String, default: "" },
    isCompleted: { type: Boolean, default: false },
    isWhatsAppNotificationSent: { type: Boolean, default: false },
    orderId: { type: String, default: "", required: true, unique: true },
    paymentId: { type: String, default: "" },
    paymentLink: { type: String, default: "" },
    state: { type: String, lowercase: true },
    border: { type: String },
    endDate: { type: Date },
    vehicleType: {
      type: String,
      enum: [...Object.values(CONSTANTS.VEHICLE_TYPES), null, ""],
      required: false,
    },
    weight: { type: Number },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
    },
    chasisNumber: { type: String },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.ORDER_STATUS),
      default: CONSTANTS.ORDER_STATUS.CREATED,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.set("debug", true);
export default mongoose.model(COLLECTION_NAMES.TAX, taxSchema);
