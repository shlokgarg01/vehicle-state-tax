import mongoose from "mongoose";
import CONSTANTS from "../constants/constants.js";
import COLLECTION_NAMES from "../constants/collection.js";

const pushNotificationsHistorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      enum: Object.values(CONSTANTS.PUSH_NOTIFICATION_AUDIENCE),
      default: CONSTANTS.PUSH_NOTIFICATION_AUDIENCE.ALL,
    },
    minAppVersion: {
      type: String,
      default: "",
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.EMPLOYEE,
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.PUSH_NOTIFICATION_STATUS),
      default: CONSTANTS.PUSH_NOTIFICATION_STATUS.PENDING,
    },
    targetedUsers: {
      type: Number,
      default: 0,
    },
    tokensQueued: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    failureCount: {
      type: Number,
      default: 0,
    },
    invalidTokensCleared: {
      type: Number,
      default: 0,
    },
    failureReasons: [
      {
        _id: false,
        code: { type: String, default: "" },
        message: { type: String, default: "" },
        count: { type: Number, default: 0 },
      },
    ],
    errorMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

pushNotificationsHistorySchema.index({ createdAt: -1 });

const MODEL_NAME = "pushnotificationhistory";

export default mongoose.model(
  MODEL_NAME,
  pushNotificationsHistorySchema,
  COLLECTION_NAMES.PUSH_NOTIFICATIONS_HISTORY
);
