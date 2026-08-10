import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ReferralManager from "../managers/referralManager.js";
import User from "../models/User.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

export const getMyReferral = catchAsyncErrors(async (req, res) => {
  const data = await ReferralManager.getMyReferralSummary(req.user._id);
  res.status(200).json({ success: true, data });
});

export const getReferralLeaderboard = catchAsyncErrors(async (req, res) => {
  const data = await ReferralManager.getLeaderboard(req.user._id);
  res.status(200).json({ success: true, data });
});

export const updateMyDisplayName = catchAsyncErrors(async (req, res, next) => {
  const displayName = String(req.body?.displayName ?? "").trim().slice(0, 80);
  if (!displayName) {
    return next(new ErrorHandler("Display name is required", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { displayName },
    { new: true }
  ).select("displayName referralCode contactNumber");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated",
    user,
  });
});

export const adminListReferrals = catchAsyncErrors(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit, 10) || 25)
  );
  const { status, search } = req.query;

  const data = await ReferralManager.listReferralsForAdmin({
    page,
    limit,
    status,
    search,
  });

  res.status(200).json({ success: true, data });
});

export const adminReferralStats = catchAsyncErrors(async (req, res) => {
  const { search } = req.query;
  const stats = await ReferralManager.getAdminStats({ search });
  res.status(200).json({ success: true, data: stats });
});
