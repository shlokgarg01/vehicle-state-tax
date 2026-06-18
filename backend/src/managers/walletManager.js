import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import WithdrawalRequest from "../models/WithdrawalRequest.js";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import CONSTANTS from "../constants/constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

class WalletManager {
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

  static getWalletSummary = async (userId) => {
    const wallet = await this.getOrCreateWallet(userId);
    return {
      balance: wallet.balance,
      heldBalance: wallet.heldBalance,
      availableBalance: this.getAvailableBalance(wallet),
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
    const { amount, bankDetails } = withdrawalData;

    if (!amount || amount <= 0) {
      throw new ErrorHandler("Withdrawal amount must be greater than zero", 400);
    }

    const normalizedBankDetails = this.validateBankDetails(bankDetails);
    const wallet = await this.getOrCreateWallet(userId);

    const updatedWallet = await Wallet.findOneAndUpdate(
      {
        _id: wallet._id,
        $expr: {
          $gte: [{ $subtract: ["$balance", "$heldBalance"] }, amount],
        },
      },
      { $inc: { heldBalance: amount } },
      { new: true }
    );

    if (!updatedWallet) {
      throw new ErrorHandler("Insufficient wallet balance", 400);
    }

    try {
      const withdrawalRequest = await WithdrawalRequest.create({
        userId,
        amount,
        bankDetails: normalizedBankDetails,
        status: CONSTANTS.WITHDRAWAL_STATUS.PENDING,
      });

      const holdTxn = await this._recordTransaction({
        userId,
        walletId: updatedWallet._id,
        type: CONSTANTS.WALLET_TRANSACTION_TYPE.WITHDRAWAL_HOLD,
        amount,
        balanceAfter: updatedWallet.balance,
        withdrawalRequestId: withdrawalRequest._id,
        description: `Withdrawal hold for request ${withdrawalRequest._id}`,
      });

      withdrawalRequest.holdTransactionId = holdTxn._id;
      await withdrawalRequest.save();

      return withdrawalRequest;
    } catch (error) {
      await Wallet.findOneAndUpdate(
        { _id: wallet._id },
        { $inc: { heldBalance: -amount } }
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

    const updatedWallet = await Wallet.findOneAndUpdate(
      {
        _id: wallet._id,
        heldBalance: { $gte: withdrawal.amount },
        balance: { $gte: withdrawal.amount },
      },
      {
        $inc: {
          balance: -withdrawal.amount,
          heldBalance: -withdrawal.amount,
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
        amount: withdrawal.amount,
        balanceAfter: updatedWallet.balance,
        withdrawalRequestId: withdrawal._id,
        description: `Withdrawal completed for request ${withdrawal._id}`,
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
            balance: withdrawal.amount,
            heldBalance: withdrawal.amount,
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

    const updatedWallet = await Wallet.findOneAndUpdate(
      { _id: wallet._id, heldBalance: { $gte: withdrawal.amount } },
      { $inc: { heldBalance: -withdrawal.amount } },
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
        amount: withdrawal.amount,
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
        { $inc: { heldBalance: withdrawal.amount } }
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

  static getAllWithdrawals = async ({ page = 1, perPage = 20, status } = {}) => {
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * perPage;

    const [total, pending, completed, rejected] = await Promise.all([
      WithdrawalRequest.countDocuments(filter),
      WithdrawalRequest.countDocuments({ status: CONSTANTS.WITHDRAWAL_STATUS.PENDING }),
      WithdrawalRequest.countDocuments({ status: CONSTANTS.WITHDRAWAL_STATUS.COMPLETED }),
      WithdrawalRequest.countDocuments({ status: CONSTANTS.WITHDRAWAL_STATUS.REJECTED }),
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

    return { withdrawals, total, page, perPage, counts };
  };
}

export default WalletManager;
