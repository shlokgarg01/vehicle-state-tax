import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import PushNotificationManager from "../managers/pushNotificationManager.js";

export const sendPushNotification = catchAsyncErrors(async (req, res) => {
  const { title, body } = PushNotificationManager.validatePayload(req.body);

  const notification = await PushNotificationManager.queueNotification({
    title,
    body,
    sentBy: req.user._id,
  });

  res.status(202).json({
    success: true,
    message: "Push notification queued successfully",
    data: { notification },
  });
});

export const getPushNotifications = catchAsyncErrors(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const perPage = parseInt(req.query.perPage, 10) || 20;

  const result = await PushNotificationManager.getNotifications({ page, perPage });

  res.status(200).json({
    success: true,
    data: result,
  });
});
