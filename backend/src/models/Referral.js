import mongoose from "mongoose";
import COLLECTION_NAMES from "../constants/collection.js";
import CONSTANTS from "../constants/constants.js";

const referralSchema = new mongoose.Schema(
  {
    referrerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
      index: true,
    },
    refereeUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
      unique: true,
    },
    referrerDisplayName: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    refereeDisplayName: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.REFERRAL_STATUS),
      default: CONSTANTS.REFERRAL_STATUS.PENDING,
      index: true,
    },
    qualifyingOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tax",
    },
    qualifyingOrderClosedAt: {
      type: Date,
    },
    revertedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

referralSchema.index({ referrerUserId: 1, status: 1 });
referralSchema.index({ qualifyingOrderClosedAt: 1, status: 1 });

const Referral = mongoose.model(COLLECTION_NAMES.REFERRAL, referralSchema);
export default Referral;
