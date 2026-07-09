import "../config/firebase/firebaseAdmin.js";
import { getApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import CONSTANTS from "../constants/constants.js";
import { isAppVersionAtOrAbove } from "../helpers/versionHelper.js";
import PushNotificationsHistory from "../models/PushNotificationsHistory.js";
import User from "../models/User.js";
import ConstantsManager from "./constantsManager.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

const INVALID_FCM_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
  "messaging/invalid-argument",
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class PushNotificationManager {
  static APP_MIN_VERSION_KEY = "min_app_version";

  static collectEligibleTokens = async (minAppVersion) => {
    const tokens = [];
    let targetedUsers = 0;

    const cursor = User.find({
      fcmToken: { $exists: true, $nin: ["", null] },
    })
      .select("fcmToken appVersion")
      .lean()
      .cursor();

    for await (const user of cursor) {
      if (!isAppVersionAtOrAbove(user.appVersion, minAppVersion)) {
        continue;
      }

      targetedUsers += 1;
      tokens.push(user.fcmToken);
    }

    return { tokens, targetedUsers };
  };

  static collectFailureReasons = (responses) => {
    const reasonMap = new Map();

    responses.forEach((response) => {
      if (response.success) return;

      const code = response.error?.code || "unknown";
      const message = response.error?.message || "Unknown error";
      const key = `${code}::${message}`;
      const existing = reasonMap.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        reasonMap.set(key, { code, message, count: 1 });
      }
    });

    return Array.from(reasonMap.values());
  };

  static mergeFailureReasons = (existingReasons, newReasons) => {
    const reasonMap = new Map();

    [...existingReasons, ...newReasons].forEach(({ code, message, count }) => {
      const key = `${code}::${message}`;
      const existing = reasonMap.get(key);

      if (existing) {
        existing.count += count;
      } else {
        reasonMap.set(key, { code, message, count });
      }
    });

    return Array.from(reasonMap.values());
  };

  static clearInvalidTokens = async (tokens, responses) => {
    const invalidTokens = [];

    responses.forEach((response, index) => {
      if (response.success) return;
      const errorCode = response.error?.code;
      if (errorCode && INVALID_FCM_TOKEN_CODES.has(errorCode)) {
        invalidTokens.push(tokens[index]);
      }
    });

    if (!invalidTokens.length) {
      return 0;
    }

    const result = await User.updateMany(
      { fcmToken: { $in: invalidTokens } },
      { $set: { fcmToken: "" } }
    );

    return result.modifiedCount || 0;
  };

  static sendTokenBatch = async (tokens, { title, body }) => {
    const messaging = getMessaging(getApp());
    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
    });

    const invalidTokensCleared = await this.clearInvalidTokens(
      tokens,
      response.responses
    );

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokensCleared,
      failureReasons: this.collectFailureReasons(response.responses),
    };
  };

  static processNotification = async (notificationId) => {
    const notification = await PushNotificationsHistory.findById(notificationId);
    if (!notification) return;

    try {
      await PushNotificationsHistory.findByIdAndUpdate(notificationId, {
        status: CONSTANTS.PUSH_NOTIFICATION_STATUS.PROCESSING,
        errorMessage: "",
        failureReasons: [],
      });

      const minAppVersion = await ConstantsManager.getConstantValue(
        this.APP_MIN_VERSION_KEY,
        "0"
      );

      const { tokens, targetedUsers } = await this.collectEligibleTokens(
        minAppVersion
      );

      await PushNotificationsHistory.findByIdAndUpdate(notificationId, {
        minAppVersion,
        targetedUsers,
        tokensQueued: tokens.length,
      });

      if (!tokens.length) {
        await PushNotificationsHistory.findByIdAndUpdate(notificationId, {
          status: CONSTANTS.PUSH_NOTIFICATION_STATUS.COMPLETED,
        });
        return;
      }

      let successCount = 0;
      let failureCount = 0;
      let invalidTokensCleared = 0;
      let failureReasons = [];
      const batchSize = CONSTANTS.FCM_BATCH_SIZE;

      for (let index = 0; index < tokens.length; index += batchSize) {
        const batch = tokens.slice(index, index + batchSize);
        const batchResult = await this.sendTokenBatch(batch, {
          title: notification.title,
          body: notification.body,
        });

        successCount += batchResult.successCount;
        failureCount += batchResult.failureCount;
        invalidTokensCleared += batchResult.invalidTokensCleared;
        failureReasons = this.mergeFailureReasons(
          failureReasons,
          batchResult.failureReasons
        );

        if (index + batchSize < tokens.length) {
          await sleep(100);
        }
      }

      await PushNotificationsHistory.findByIdAndUpdate(notificationId, {
        status: CONSTANTS.PUSH_NOTIFICATION_STATUS.COMPLETED,
        successCount,
        failureCount,
        invalidTokensCleared,
        failureReasons,
      });
    } catch (error) {
      console.error("Push notification processing failed:", error);
      await PushNotificationsHistory.findByIdAndUpdate(notificationId, {
        status: CONSTANTS.PUSH_NOTIFICATION_STATUS.FAILED,
        errorMessage: error.message || "Failed to send push notification",
      });
    }
  };

  static queueNotification = async ({ title, body, sentBy }) => {
    const notification = await PushNotificationsHistory.create({
      title: title.trim(),
      body: body.trim(),
      audience: CONSTANTS.PUSH_NOTIFICATION_AUDIENCE.ALL,
      sentBy,
      status: CONSTANTS.PUSH_NOTIFICATION_STATUS.PENDING,
    });

    setImmediate(() => {
      this.processNotification(notification._id).catch((error) => {
        console.error("Push notification processing failed:", error);
      });
    });

    return notification;
  };

  static getNotifications = async ({ page = 1, perPage = 20 } = {}) => {
    const skip = (page - 1) * perPage;

    const [notifications, total] = await Promise.all([
      PushNotificationsHistory.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate("sentBy", "username")
        .lean(),
      PushNotificationsHistory.countDocuments(),
    ]);

    return { notifications, total, page, perPage };
  };

  static validatePayload = ({ title, body }) => {
    const trimmedTitle = String(title || "").trim();
    const trimmedBody = String(body || "").trim();

    if (!trimmedTitle) {
      throw new ErrorHandler("Notification title is required", 400);
    }
    if (!trimmedBody) {
      throw new ErrorHandler("Notification body is required", 400);
    }
    if (trimmedTitle.length > 120) {
      throw new ErrorHandler("Notification title is too long", 400);
    }
    if (trimmedBody.length > 1000) {
      throw new ErrorHandler("Notification body is too long", 400);
    }

    return { title: trimmedTitle, body: trimmedBody };
  };
}

export default PushNotificationManager;
