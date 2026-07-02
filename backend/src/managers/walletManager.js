import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import WithdrawalRequest from "../models/WithdrawalRequest.js";
import SavedPayoutDetail from "../models/SavedPayoutDetail.js";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import CONSTANTS from "../constants/constants.js";
import ConstantsManager from "./constantsManager.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

const REFUND_DEDUCTION_PERCENT_KEY = "REFUND_DEDUCTION_PERCENT";
const MAX_SAVED_PAYOUT_DETAILS = 20;

class WalletManager {
  static normalizePayoutTitle = (title) => {
    const normalized = String(title || "").trim();
    if (!normalized) {
      throw new ErrorHandler("Title is required", 400);
    }
    if (normalized.length > 80) {
      throw new ErrorHandler("Title must be 80 characters or less", 400);
    }
    return normalized;
  };

  static bankDetailsFromSavedRecord = (record = {}) => ({
    accountHolderName: record.accountHolderName,
    accountNumber: record.accountNumber,
    ifscCode: record.ifscCode,
    bankName: record.bankName,
    upiId: record.upiId,
  });

  static formatSavedPayoutDetail = (record) => ({
    _id: record._id,
    title: record.title,
    bankDetails: this.bankDetailsFromSavedRecord(record),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

  static validateBankDetails = (bankDetails = {}) => {
    const {
      accountHolderName = "",
      accountNumber = "",
      ifscCode = "",
      bankName = "",
      upiId = "",
    } = bankDetails;

    const normalized = {
      accountHolderName: String(accountHolderName).trim(),
      accountNumber: String(accountNumber).trim(),
      ifscCode: String(ifscCode).trim(),
      bankName: String(bankName).trim(),
      upiId: String(upiId).trim(),
    };

    const hasUpi = Boolean(normalized.upiId);
    const hasFullBank =
      normalized.accountHolderName &&
      normalized.accountNumber &&
      normalized.ifscCode &&
      normalized.bankName;
    const hasPartialBank =
      normalized.accountHolderName ||
      normalized.accountNumber ||
      normalized.ifscCode ||
      normalized.bankName;

    if (!hasUpi && !hasFullBank) {
      if (hasPartialBank) {
        throw new ErrorHandler(
          "All bank details are required when UPI ID is not provided",
          400
        );
      }
      throw new ErrorHandler(
        "Either UPI ID or complete bank details are required for withdrawal",
        400
      );
    }

    return normalized;
  };

  static resolveWithdrawalBankDetails = async (
    userId,
    { bankDetails, savedPayoutDetailId }
  ) => {
    if (savedPayoutDetailId) {
      const saved = await SavedPayoutDetail.findOne({
        _id: savedPayoutDetailId,
        userId,
      });
      if (!saved) {
        throw new ErrorHandler("Saved payout detail not found", 404);
      }
      return this.validateBankDetails(this.bankDetailsFromSavedRecord(saved));
    }

    if (!bankDetails) {
      throw new ErrorHandler(
        "Either savedPayoutDetailId or bank details are required",
        400
      );
    }

    return this.validateBankDetails(bankDetails);
  };

  static getSavedPayoutDetails = async (userId) => {
    const payoutDetails = await SavedPayoutDetail.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return payoutDetails.map((record) => this.formatSavedPayoutDetail(record));
  };

  static createSavedPayoutDetail = async (userId, { title, bankDetails }) => {
    const normalizedTitle = this.normalizePayoutTitle(title);
    const normalizedBankDetails = this.validateBankDetails(bankDetails);

    const existingCount = await SavedPayoutDetail.countDocuments({ userId });
    if (existingCount >= MAX_SAVED_PAYOUT_DETAILS) {
      throw new ErrorHandler(
        `You can save up to ${MAX_SAVED_PAYOUT_DETAILS} payout details`,
        400
      );
    }

    const duplicateTitle = await SavedPayoutDetail.findOne({
      userId,
      title: normalizedTitle,
    });
    if (duplicateTitle) {
      throw new ErrorHandler("A saved detail with this title already exists", 400);
    }

    const payoutDetail = await SavedPayoutDetail.create({
      userId,
      title: normalizedTitle,
      ...normalizedBankDetails,
    });

    return this.formatSavedPayoutDetail(payoutDetail);
  };

  static updateSavedPayoutDetail = async (
    userId,
    payoutDetailId,
    { title, bankDetails }
  ) => {
    const payoutDetail = await SavedPayoutDetail.findOne({
      _id: payoutDetailId,
      userId,
    });
    if (!payoutDetail) {
      throw new ErrorHandler("Saved payout detail not found", 404);
    }

    if (title !== undefined) {
      const normalizedTitle = this.normalizePayoutTitle(title);
      const duplicateTitle = await SavedPayoutDetail.findOne({
        userId,
        title: normalizedTitle,
        _id: { $ne: payoutDetailId },
      });
      if (duplicateTitle) {
        throw new ErrorHandler("A saved detail with this title already exists", 400);
      }
      payoutDetail.title = normalizedTitle;
    }

    if (bankDetails !== undefined) {
      const normalizedBankDetails = this.validateBankDetails(bankDetails);
      Object.assign(payoutDetail, normalizedBankDetails);
    }

    await payoutDetail.save();
    return this.formatSavedPayoutDetail(payoutDetail);
  };

  static deleteSavedPayoutDetail = async (userId, payoutDetailId) => {
    const payoutDetail = await SavedPayoutDetail.findOneAndDelete({
      _id: payoutDetailId,
      userId,
    });
    if (!payoutDetail) {
      throw new ErrorHandler("Saved payout detail not found", 404);
    }
    return this.formatSavedPayoutDetail(payoutDetail);
  };

  static getOrCreateWallet = async (userId) => {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      try {
        wallet = await Wallet.create({ userId, balance: 0, heldBalance: 0 });
      } catch (error) {
        if (error.code === 11000) {
          wallet = await Wallet.findOne({ userId });
        } else {
          throw error;
        }
      }
    }
    return wallet;
  };

  static getAvailableBalance = (wallet) => {
    return Math.max(0, wallet.balance - wallet.heldBalance);
  };

  static getWithdrawalDeductionPercent = async () => {
    const percent = await ConstantsManager.getNumericConstant(
      REFUND_DEDUCTION_PERCENT_KEY,
      0
    );
    return Math.min(100, Math.max(0, percent));
  };

  static getWalletDebitAmount = (withdrawal) =>
    withdrawal.walletDebitAmount ?? withdrawal.amount;

  static getPayoutAmount = (withdrawal) =>
    withdrawal.payoutAmount ?? withdrawal.amount;

  static calculateWithdrawalAmounts = (walletDebitInput, deductionPercent) => {
    const walletDebitAmount = Math.floor(Number(walletDebitInput));
    const percent = Math.min(100, Math.max(0, Number(deductionPercent) || 0));
    const payoutAmount = Math.floor(
      walletDebitAmount - (walletDebitAmount * percent) / 100
    );
    const deductionAmount = walletDebitAmount - payoutAmount;

    return {
      walletDebitAmount,
      payoutAmount,
      deductionPercent: percent,
      deductionAmount,
    };
  };

  static getWalletSummary = async (userId) => {
    const wallet = await this.getOrCreateWallet(userId);
    const withdrawalDeductionPercent = await this.getWithdrawalDeductionPercent();
    return {
      balance: wallet.balance,
      heldBalance: wallet.heldBalance,
      availableBalance: this.getAvailableBalance(wallet),
      withdrawalDeductionPercent,
    };
  };

  static _recordTransaction = async ({
    userId,
    walletId,
    type,
    amount,
    balanceAfter,
    withdrawalRequestId,
    orderId,
    description,
  }) => {
    return WalletTransaction.create({
      userId,
      walletId,
      type,
      amount,
      balanceAfter,
      withdrawalRequestId,
      orderId,
      description,
    });
  };

  static credit = async ({
    userId,
    amount,
    type,
    withdrawalRequestId,
    orderId,
    description,
  }) => {
    if (amount <= 0) {
      throw new ErrorHandler("Credit amount must be greater than zero", 400);
    }

    const wallet = await this.getOrCreateWallet(userId);
    const updatedWallet = await Wallet.findOneAndUpdate(
      { _id: wallet._id },
      { $inc: { balance: amount } },
      { new: true }
    );

    return this._recordTransaction({
      userId,
      walletId: updatedWallet._id,
      type,
      amount,
      balanceAfter: updatedWallet.balance,
      withdrawalRequestId,
      orderId,
      description,
    });
  };

  static debitForTax = async ({ userId, amount, orderId }) => {
    if (amount <= 0) return null;

    const wallet = await this.getOrCreateWallet(userId);
    const updatedWallet = await Wallet.findOneAndUpdate(
      {
        _id: wallet._id,
        $expr: {
          $gte: [{ $subtract: ["$balance", "$heldBalance"] }, amount],
        },
      },
      { $inc: { balance: -amount } },
      { new: true }
    );

    if (!updatedWallet) {
      throw new ErrorHandler("Insufficient wallet balance", 400);
    }

    return this._recordTransaction({
      userId,
      walletId: updatedWallet._id,
      type: CONSTANTS.WALLET_TRANSACTION_TYPE.TAX_DEBIT,
      amount,
      balanceAfter: updatedWallet.balance,
      orderId,
      description: `Tax payment for order ${orderId}`,
    });
  };

  static rollbackTaxDebit = async ({ userId, amount, orderId }) => {
    if (amount <= 0) return null;

    return this.credit({
      userId,
      amount,
      type: CONSTANTS.WALLET_TRANSACTION_TYPE.PAYMENT_ROLLBACK,
      orderId,
      description: `Gateway payment failed — wallet amount refunded for order ${orderId}`,
    });
  };

  static creditRefund = async ({ userId, amount, orderId }) => {
    if (amount <= 0) {
      throw new ErrorHandler("Refund amount must be greater than zero", 400);
    }

    return this.credit({
      userId,
      amount,
      type: CONSTANTS.WALLET_TRANSACTION_TYPE.REFUND_CREDIT,
      orderId,
      description: `Refund credited to wallet for order ${orderId}`,
    });
  };

  static createWithdrawalRequest = async (userId, withdrawalData) => {
    const { amount, bankDetails, savedPayoutDetailId } = withdrawalData;

    if (!amount || amount <= 0) {
      throw new ErrorHandler("Withdrawal amount must be greater than zero", 400);
    }

    const deductionPercent = await this.getWithdrawalDeductionPercent();
    const {
      walletDebitAmount,
      payoutAmount,
      deductionPercent: appliedPercent,
      deductionAmount,
    } = this.calculateWithdrawalAmounts(amount, deductionPercent);

    if (walletDebitAmount <= 0) {
      throw new ErrorHandler("Withdrawal amount must be greater than zero", 400);
    }

    if (payoutAmount <= 0) {
      throw new ErrorHandler(
        "Withdrawal amount is too low after processing fee",
        400
      );
    }

    const normalizedBankDetails = await this.resolveWithdrawalBankDetails(
      userId,
      { bankDetails, savedPayoutDetailId }
    );
    const wallet = await this.getOrCreateWallet(userId);

    const updatedWallet = await Wallet.findOneAndUpdate(
      {
        _id: wallet._id,
        $expr: {
          $gte: [{ $subtract: ["$balance", "$heldBalance"] }, walletDebitAmount],
        },
      },
      { $inc: { heldBalance: walletDebitAmount } },
      { new: true }
    );

    if (!updatedWallet) {
      throw new ErrorHandler("Insufficient wallet balance", 400);
    }

    try {
      const withdrawalRequest = await WithdrawalRequest.create({
        userId,
        amount: payoutAmount,
        walletDebitAmount,
        payoutAmount,
        deductionPercent: appliedPercent,
        deductionAmount,
        bankDetails: normalizedBankDetails,
        status: CONSTANTS.WITHDRAWAL_STATUS.PENDING,
      });

      const holdTxn = await this._recordTransaction({
        userId,
        walletId: updatedWallet._id,
        type: CONSTANTS.WALLET_TRANSACTION_TYPE.WITHDRAWAL_HOLD,
        amount: walletDebitAmount,
        balanceAfter: updatedWallet.balance,
        withdrawalRequestId: withdrawalRequest._id,
        description: `Withdrawal hold for request ${withdrawalRequest._id} (payout ₹${payoutAmount})`,
      });

      withdrawalRequest.holdTransactionId = holdTxn._id;
      await withdrawalRequest.save();

      return withdrawalRequest;
    } catch (error) {
      await Wallet.findOneAndUpdate(
        { _id: wallet._id },
        { $inc: { heldBalance: -walletDebitAmount } }
      );
      throw error;
    }
  };

  static completeWithdrawal = async (withdrawalId, processedBy, proofScreenshotUrl) => {
    const withdrawal = await WithdrawalRequest.findById(withdrawalId);
    if (!withdrawal) {
      throw new ErrorHandler("Withdrawal request not found", 404);
    }
    if (withdrawal.status !== CONSTANTS.WITHDRAWAL_STATUS.PENDING) {
      throw new ErrorHandler("Withdrawal request is not pending", 400);
    }

    const wallet = await Wallet.findOne({ userId: withdrawal.userId });
    if (!wallet) {
      throw new ErrorHandler("Wallet not found", 404);
    }

    const walletDebitAmount = this.getWalletDebitAmount(withdrawal);

    const updatedWallet = await Wallet.findOneAndUpdate(
      {
        _id: wallet._id,
        heldBalance: { $gte: walletDebitAmount },
        balance: { $gte: walletDebitAmount },
      },
      {
        $inc: {
          balance: -walletDebitAmount,
          heldBalance: -walletDebitAmount,
        },
      },
      { new: true }
    );

    if (!updatedWallet) {
      throw new ErrorHandler("Unable to complete withdrawal", 400);
    }

    try {
      await this._recordTransaction({
        userId: withdrawal.userId,
        walletId: updatedWallet._id,
        type: CONSTANTS.WALLET_TRANSACTION_TYPE.WITHDRAWAL_DEBIT,
        amount: walletDebitAmount,
        balanceAfter: updatedWallet.balance,
        withdrawalRequestId: withdrawal._id,
        description: `Withdrawal completed for request ${withdrawal._id} (payout ₹${this.getPayoutAmount(withdrawal)})`,
      });

      withdrawal.status = CONSTANTS.WITHDRAWAL_STATUS.COMPLETED;
      withdrawal.proofScreenshotUrl = proofScreenshotUrl;
      withdrawal.processedBy = processedBy;
      withdrawal.processedAt = new Date();
      await withdrawal.save();

      return withdrawal;
    } catch (error) {
      await Wallet.findOneAndUpdate(
        { _id: wallet._id },
        {
          $inc: {
            balance: walletDebitAmount,
            heldBalance: walletDebitAmount,
          },
        }
      );
      throw error;
    }
  };

  static rejectWithdrawal = async (withdrawalId, processedBy, rejectionReason) => {
    const withdrawal = await WithdrawalRequest.findById(withdrawalId);
    if (!withdrawal) {
      throw new ErrorHandler("Withdrawal request not found", 404);
    }
    if (withdrawal.status !== CONSTANTS.WITHDRAWAL_STATUS.PENDING) {
      throw new ErrorHandler("Withdrawal request is not pending", 400);
    }

    const wallet = await Wallet.findOne({ userId: withdrawal.userId });
    if (!wallet) {
      throw new ErrorHandler("Wallet not found", 404);
    }

    const walletDebitAmount = this.getWalletDebitAmount(withdrawal);

    const updatedWallet = await Wallet.findOneAndUpdate(
      { _id: wallet._id, heldBalance: { $gte: walletDebitAmount } },
      { $inc: { heldBalance: -walletDebitAmount } },
      { new: true }
    );

    if (!updatedWallet) {
      throw new ErrorHandler("Unable to reject withdrawal", 400);
    }

    try {
      await this._recordTransaction({
        userId: withdrawal.userId,
        walletId: updatedWallet._id,
        type: CONSTANTS.WALLET_TRANSACTION_TYPE.WITHDRAWAL_RELEASE,
        amount: walletDebitAmount,
        balanceAfter: updatedWallet.balance,
        withdrawalRequestId: withdrawal._id,
        description: `Withdrawal hold released for request ${withdrawal._id}`,
      });

      withdrawal.status = CONSTANTS.WITHDRAWAL_STATUS.REJECTED;
      withdrawal.rejectionReason = rejectionReason || "";
      withdrawal.processedBy = processedBy;
      withdrawal.processedAt = new Date();
      await withdrawal.save();

      return withdrawal;
    } catch (error) {
      await Wallet.findOneAndUpdate(
        { _id: wallet._id },
        { $inc: { heldBalance: walletDebitAmount } }
      );
      throw error;
    }
  };

  static getTransactions = async (userId, { page = 1, perPage = 20 } = {}) => {
    const skip = (page - 1) * perPage;
    const [transactions, total] = await Promise.all([
      WalletTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),
      WalletTransaction.countDocuments({ userId }),
    ]);
    return { transactions, total, page, perPage };
  };

  static getWithdrawals = async (userId, { page = 1, perPage = 20, status } = {}) => {
    const filter = { userId };
    if (status) filter.status = status;

    const skip = (page - 1) * perPage;
    const [withdrawals, total] = await Promise.all([
      WithdrawalRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate("processedBy", "username")
        .lean(),
      WithdrawalRequest.countDocuments(filter),
    ]);
    return { withdrawals, total, page, perPage };
  };

  static buildCreatedAtFilter = (startDate, endDate) => {
    const createdAt = {};
    if (startDate) {
      createdAt.$gte = new Date(`${startDate}T00:00:00+05:30`);
    }
    if (endDate) {
      createdAt.$lte = new Date(`${endDate}T23:59:59.999+05:30`);
    }
    return Object.keys(createdAt).length ? createdAt : null;
  };

  static getAllWithdrawals = async ({
    page = 1,
    perPage = 20,
    status,
    startDate,
    endDate,
  } = {}) => {
    const filter = {};
    if (status) filter.status = status;

    const createdAtFilter = this.buildCreatedAtFilter(startDate, endDate);
    if (createdAtFilter) filter.createdAt = createdAtFilter;

    const skip = (page - 1) * perPage;
    const countBase = createdAtFilter ? { createdAt: createdAtFilter } : {};

    const [total, pending, completed, rejected, totalRefundedAgg] = await Promise.all([
      WithdrawalRequest.countDocuments(filter),
      WithdrawalRequest.countDocuments({
        ...countBase,
        status: CONSTANTS.WITHDRAWAL_STATUS.PENDING,
      }),
      WithdrawalRequest.countDocuments({
        ...countBase,
        status: CONSTANTS.WITHDRAWAL_STATUS.COMPLETED,
      }),
      WithdrawalRequest.countDocuments({
        ...countBase,
        status: CONSTANTS.WITHDRAWAL_STATUS.REJECTED,
      }),
      WithdrawalRequest.aggregate([
        {
          $match: {
            ...countBase,
            status: CONSTANTS.WITHDRAWAL_STATUS.COMPLETED,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ["$payoutAmount", "$amount"] } },
          },
        },
      ]),
    ]);

    const counts = {
      all: pending + completed + rejected,
      pending,
      completed,
      rejected,
    };

    let withdrawals;

    if (status) {
      withdrawals = await WithdrawalRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate("userId", "contactNumber")
        .populate("processedBy", "username")
        .lean();
    } else {
      withdrawals = await WithdrawalRequest.aggregate([
        { $match: filter },
        {
          $addFields: {
            statusOrder: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$status", CONSTANTS.WITHDRAWAL_STATUS.PENDING] },
                    then: 0,
                  },
                  {
                    case: { $eq: ["$status", CONSTANTS.WITHDRAWAL_STATUS.COMPLETED] },
                    then: 1,
                  },
                  {
                    case: { $eq: ["$status", CONSTANTS.WITHDRAWAL_STATUS.REJECTED] },
                    then: 2,
                  },
                ],
                default: 3,
              },
            },
          },
        },
        { $sort: { statusOrder: 1, createdAt: -1 } },
        { $skip: skip },
        { $limit: perPage },
        {
          $lookup: {
            from: User.collection.name,
            localField: "userId",
            foreignField: "_id",
            as: "userPop",
          },
        },
        { $unwind: { path: "$userPop", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: Employee.collection.name,
            localField: "processedBy",
            foreignField: "_id",
            as: "processedByPop",
          },
        },
        { $unwind: { path: "$processedByPop", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            userId: {
              _id: "$userPop._id",
              contactNumber: "$userPop.contactNumber",
            },
            processedBy: {
              _id: "$processedByPop._id",
              username: "$processedByPop.username",
            },
          },
        },
        { $project: { userPop: 0, processedByPop: 0, statusOrder: 0 } },
      ]);
    }

    const totalRefunded = totalRefundedAgg[0]?.total ?? 0;

    return { withdrawals, total, page, perPage, counts, totalRefunded };
  };
}

export default WalletManager;
