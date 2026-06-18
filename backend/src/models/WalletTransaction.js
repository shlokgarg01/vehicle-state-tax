import mongoose from "mongoose";
import CONSTANTS from "../constants/constants.js";
import COLLECTION_NAMES from "../constants/collection.js";

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.WALLET,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(CONSTANTS.WALLET_TRANSACTION_TYPE),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    withdrawalRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.WITHDRAWAL_REQUEST,
    },
    orderId: { type: String },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

walletTransactionSchema.index({ userId: 1, createdAt: -1 });
walletTransactionSchema.index({ orderId: 1 });
walletTransactionSchema.index({ withdrawalRequestId: 1 });

export default mongoose.model(
  COLLECTION_NAMES.WALLET_TRANSACTION,
  walletTransactionSchema
);
