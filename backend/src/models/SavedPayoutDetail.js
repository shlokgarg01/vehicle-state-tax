import mongoose from "mongoose";
import COLLECTION_NAMES from "../constants/collection.js";

const savedPayoutDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    accountHolderName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    ifscCode: { type: String, default: "" },
    bankName: { type: String, default: "" },
    upiId: { type: String, default: "" },
  },
  { timestamps: true }
);

savedPayoutDetailSchema.index({ userId: 1, createdAt: -1 });
savedPayoutDetailSchema.index({ userId: 1, title: 1 });

export default mongoose.model(
  COLLECTION_NAMES.SAVED_PAYOUT_DETAIL,
  savedPayoutDetailSchema
);
