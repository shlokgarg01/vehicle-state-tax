import mongoose from "mongoose";
import CONSTANTS from "../constants/constants.js";
import COLLECTION_NAMES from "../constants/collection.js";

const withdrawalRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    walletDebitAmount: {
      type: Number,
      min: 1,
    },
    payoutAmount: {
      type: Number,
      min: 1,
    },
    deductionPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    deductionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.WITHDRAWAL_STATUS),
      default: CONSTANTS.WITHDRAWAL_STATUS.PENDING,
    },
    bankDetails: {
      accountHolderName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
      bankName: { type: String, default: "" },
      upiId: { type: String, default: "" },
    },
    proofScreenshotUrl: { type: String, default: "" },
    rejectionReason: { type: String, default: "" },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.EMPLOYEE,
    },
    processedAt: { type: Date },
    holdTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.WALLET_TRANSACTION,
    },
  },
  { timestamps: true }
);

withdrawalRequestSchema.index({ userId: 1, createdAt: -1 });
withdrawalRequestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model(
  COLLECTION_NAMES.WITHDRAWAL_REQUEST,
  withdrawalRequestSchema
);
