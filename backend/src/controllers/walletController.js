import WalletManager from "../managers/walletManager.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import { uploadFile } from "../helpers/uploadHelpers.js";

export const getWalletBalance = catchAsyncErrors(async (req, res) => {
  const summary = await WalletManager.getWalletSummary(req.user._id);
  res.status(200).json({
    success: true,
    data: summary,
  });
});

export const getWalletTransactions = catchAsyncErrors(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;
  const result = await WalletManager.getTransactions(req.user._id, { page, perPage });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const createWithdrawalRequest = catchAsyncErrors(async (req, res) => {
  const bankDetails =
    req.body.bankDetails || {
      accountHolderName: req.body.accountHolderName,
      accountNumber: req.body.accountNumber,
      ifscCode: req.body.ifscCode,
      bankName: req.body.bankName,
      upiId: req.body.upiId,
    };

  const withdrawal = await WalletManager.createWithdrawalRequest(req.user._id, {
    amount: Number(req.body.amount),
    bankDetails: req.body.savedPayoutDetailId ? undefined : bankDetails,
    savedPayoutDetailId: req.body.savedPayoutDetailId,
  });

  res.status(201).json({
    success: true,
    message: "Withdrawal request submitted",
    data: { withdrawal },
  });
});

export const getSavedPayoutDetails = catchAsyncErrors(async (req, res) => {
  const payoutDetails = await WalletManager.getSavedPayoutDetails(req.user._id);
  res.status(200).json({
    success: true,
    data: { payoutDetails },
  });
});

export const createSavedPayoutDetail = catchAsyncErrors(async (req, res) => {
  const bankDetails =
    req.body.bankDetails || {
      accountHolderName: req.body.accountHolderName,
      accountNumber: req.body.accountNumber,
      ifscCode: req.body.ifscCode,
      bankName: req.body.bankName,
      upiId: req.body.upiId,
    };

  const payoutDetail = await WalletManager.createSavedPayoutDetail(req.user._id, {
    title: req.body.title,
    bankDetails,
  });

  res.status(201).json({
    success: true,
    message: "Payout detail saved",
    data: { payoutDetail },
  });
});

export const updateSavedPayoutDetail = catchAsyncErrors(async (req, res) => {
  const bankDetails =
    req.body.bankDetails !== undefined
      ? req.body.bankDetails || {
          accountHolderName: req.body.accountHolderName,
          accountNumber: req.body.accountNumber,
          ifscCode: req.body.ifscCode,
          bankName: req.body.bankName,
          upiId: req.body.upiId,
        }
      : undefined;

  const payoutDetail = await WalletManager.updateSavedPayoutDetail(
    req.user._id,
    req.params.id,
    {
      title: req.body.title,
      bankDetails,
    }
  );

  res.status(200).json({
    success: true,
    message: "Payout detail updated",
    data: { payoutDetail },
  });
});

export const deleteSavedPayoutDetail = catchAsyncErrors(async (req, res) => {
  const payoutDetail = await WalletManager.deleteSavedPayoutDetail(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Payout detail deleted",
    data: { payoutDetail },
  });
});

export const getUserWithdrawals = catchAsyncErrors(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;
  const { status } = req.query;
  const result = await WalletManager.getWithdrawals(req.user._id, {
    page,
    perPage,
    status,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getAllWithdrawals = catchAsyncErrors(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const { status, startDate, endDate } = req.query;
  const result = await WalletManager.getAllWithdrawals({
    page,
    perPage,
    status,
    startDate,
    endDate,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const completeWithdrawal = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const fileData = req.files?.proofScreenshot;

  if (!fileData) {
    throw new ErrorHandler("Proof screenshot is required", 400);
  }

  const uploadResponse = await uploadFile(fileData, "withdrawal_proofs");
  if (!uploadResponse.isUploaded) {
    throw new ErrorHandler(uploadResponse.message || "Failed to upload proof", 400);
  }

  const withdrawal = await WalletManager.completeWithdrawal(
    id,
    req.user._id,
    uploadResponse.url
  );

  res.status(200).json({
    success: true,
    message: "Withdrawal marked as completed",
    data: { withdrawal },
  });
});

export const rejectWithdrawal = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  const withdrawal = await WalletManager.rejectWithdrawal(
    id,
    req.user._id,
    rejectionReason
  );

  res.status(200).json({
    success: true,
    message: "Withdrawal rejected and amount released back to wallet",
    data: { withdrawal },
  });
});
