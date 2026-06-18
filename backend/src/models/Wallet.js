import mongoose from "mongoose";
import COLLECTION_NAMES from "../constants/collection.js";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    heldBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

walletSchema.index({ userId: 1 });

export default mongoose.model(COLLECTION_NAMES.WALLET, walletSchema);
