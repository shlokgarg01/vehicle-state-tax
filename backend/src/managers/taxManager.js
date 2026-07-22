import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import CONSTANTS from "../constants/constants.js";
import Tax from "../models/Tax.js";
import State from "../models/State.js";
import Price from "../models/Price.js";
import WalletManager from "./walletManager.js";
import { getPaymentGateway } from "../services/paymentGateway.js";
import { parseCustomDate } from "../helpers/dateHelper.js";

class TaxManager {
  constructor() {}

  static computeCommission = async ({
    category,
    taxMode,
    startDate,
    endDate,
    seatCapacity,
    state,
  }) => {
    let price = null;
    if (
      [CONSTANTS.MODES.BORDER_TAX, CONSTANTS.MODES.ROAD_TAX].includes(category)
    ) {
      const stateDoc = await State.findOne({
        name: state?.toLowerCase(),
        mode: category,
        status: CONSTANTS.STATUS.ACTIVE,
      });
      price = await Price.findOne({
        mode: category,
        taxMode,
        seatCapacity,
        state: stateDoc?._id,
        status: CONSTANTS.STATUS.ACTIVE,
      });
    } else {
      price = await Price.findOne({
        mode: category,
        taxMode,
        seatCapacity,
        status: CONSTANTS.STATUS.ACTIVE,
      });
    }

    if (taxMode === "days") {
      const start = parseCustomDate(startDate);
      const end = parseCustomDate(endDate);
      const numberOfDays =
        Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (numberOfDays <= 2) return 30;
      if (numberOfDays <= 5) return 50;
      if (numberOfDays <= 9) return 70;
      return 100;
    }

    return price?.serviceCharge || 0;
  };

  static createTaxEntry = async (userId, taxData) => {
    let taxEntry = new Tax({
      ...taxData,
      userId,
    });
    taxEntry = await taxEntry.save();

    const populatedEntry = await Tax.findOne({ orderId: taxEntry.orderId });
    return populatedEntry;
  };

  static createPaymentLink = async (
    orderId,
    amount,
    mobileNumber,
    options = {}
  ) => {
    const gateway = await getPaymentGateway();
    return gateway.createPaymentLink(
      orderId,
      amount,
      mobileNumber,
      options
    );
  };

  static getPaymentStatus = async (orderId) => {
    const gateway = await getPaymentGateway();
    return gateway.getPaymentStatus(orderId);
  };

  static getTaxByOrderId = async (orderId) => {
    const tax = await Tax.findOne({ orderId }).lean();
    if (!tax) throw new ErrorHandler("Tax entry not found", 404);
    return tax;
  };

  static updateTaxByOrderId = async (orderId, updateData) => {
    const taxEntry = await Tax.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!taxEntry) throw new ErrorHandler("Tax not found", 404);
    return taxEntry;
  };

  static cancelTax = async (taxId, cancellationReason) => {
    const reason = String(cancellationReason || "").trim();
    if (!reason) {
      throw new ErrorHandler("Cancellation reason is required", 400);
    }

    const tax = await Tax.findById(taxId);
    if (!tax) {
      throw new ErrorHandler("Tax not found", 404);
    }
    if (tax.status !== CONSTANTS.ORDER_STATUS.CONFIRMED) {
      throw new ErrorHandler("Only confirmed orders can be cancelled", 400);
    }

    return Tax.findByIdAndUpdate(
      taxId,
      {
        status: CONSTANTS.ORDER_STATUS.CANCELLED,
        cancellationReason: reason,
      },
      { new: true, runValidators: true }
    );
  };

  static createTaxWithWalletPayment = async (userId, taxData) => {
    const { orderId, amount, mobileNumber, backendUrl, ...rest } = taxData;
    const walletSummary = await WalletManager.getWalletSummary(userId);
    const walletAmount = Math.min(walletSummary.availableBalance, amount);
    const gatewayAmount = amount - walletAmount;

    let taxEntry;
    let paymentLink = "";

    try {
      taxEntry = await Tax.create({
        ...rest,
        orderId,
        amount,
        mobileNumber,
        userId,
        paymentMethod: CONSTANTS.PAYMENT_METHOD.WALLET,
        walletAmountPaid: walletAmount,
        gatewayAmountPaid: gatewayAmount,
        paymentStatus:
          gatewayAmount > 0
            ? CONSTANTS.PAYMENT_STATUS.PENDING
            : CONSTANTS.PAYMENT_STATUS.COMPLETED,
        status:
          gatewayAmount > 0
            ? CONSTANTS.ORDER_STATUS.CREATED
            : CONSTANTS.ORDER_STATUS.CONFIRMED,
        paymentLink: "",
      });

      if (walletAmount > 0) {
        await WalletManager.debitForTax({
          userId,
          amount: walletAmount,
          orderId,
        });
      }
    } catch (error) {
      if (taxEntry?._id) {
        await Tax.findByIdAndUpdate(taxEntry._id, {
          status: CONSTANTS.ORDER_STATUS.CANCELLED,
          paymentStatus: CONSTANTS.PAYMENT_STATUS.FAILED,
        });
      }
      throw error;
    }

    if (gatewayAmount > 0) {
      try {
        paymentLink = await this.createPaymentLink(
          orderId,
          gatewayAmount,
          mobileNumber,
          { backendUrl }
        );
        taxEntry = await this.updateTaxByOrderId(orderId, { paymentLink });
      } catch (error) {
        if (walletAmount > 0) {
          await WalletManager.rollbackTaxDebit({
            userId,
            amount: walletAmount,
            orderId,
          });
        }
        await this.updateTaxByOrderId(orderId, {
          paymentStatus: CONSTANTS.PAYMENT_STATUS.FAILED,
          status: CONSTANTS.ORDER_STATUS.CANCELLED,
        });
        throw error;
      }
    }

    return {
      paymentLink,
      taxEntry,
      walletAmountPaid: walletAmount,
      gatewayAmountPaid: gatewayAmount,
      requiresGateway: gatewayAmount > 0,
    };
  };

  static createTaxWithWalletUpiPayment = async (userId, taxData) => {
    const { orderId, amount, mobileNumber, ...rest } = taxData;
    const walletSummary = await WalletManager.getWalletSummary(userId);
    const walletAmount = Math.min(walletSummary.availableBalance, amount);
    const upiAmount = amount - walletAmount;

    let taxEntry;

    try {
      taxEntry = await Tax.create({
        ...rest,
        orderId,
        amount,
        mobileNumber,
        userId,
        paymentMethod: CONSTANTS.PAYMENT_METHOD.WALLET,
        walletAmountPaid: walletAmount,
        gatewayAmountPaid: upiAmount,
        paymentStatus:
          upiAmount > 0
            ? CONSTANTS.PAYMENT_STATUS.PENDING
            : CONSTANTS.PAYMENT_STATUS.COMPLETED,
        status:
          upiAmount > 0
            ? CONSTANTS.ORDER_STATUS.PAYMENT_PENDING
            : CONSTANTS.ORDER_STATUS.CONFIRMED,
        paymentLink: "",
      });

      if (walletAmount > 0) {
        await WalletManager.debitForTax({
          userId,
          amount: walletAmount,
          orderId,
        });
      }
    } catch (error) {
      if (taxEntry?._id) {
        await Tax.findByIdAndUpdate(taxEntry._id, {
          status: CONSTANTS.ORDER_STATUS.CANCELLED,
          paymentStatus: CONSTANTS.PAYMENT_STATUS.FAILED,
        });
      }
      throw error;
    }

    return {
      taxEntry,
      walletAmountPaid: walletAmount,
      upiAmount,
      requiresUpi: upiAmount > 0,
    };
  };

  static refundTaxToWallet = async (taxId) => {
    const tax = await Tax.findById(taxId);
    if (!tax) {
      throw new ErrorHandler("Tax not found", 404);
    }

    if (tax.refundedToWallet) {
      throw new ErrorHandler("Tax amount already refunded to wallet", 400);
    }

    if (tax.status !== CONSTANTS.ORDER_STATUS.CANCELLED) {
      throw new ErrorHandler("Only cancelled orders can be refunded to wallet", 400);
    }

    if (!tax.userId) {
      throw new ErrorHandler("Tax is not linked to a user", 400);
    }

    const eligibleFrom = new Date(
      `${CONSTANTS.WALLET_REFUND_ELIGIBLE_FROM}T00:00:00+05:30`
    );
    if (new Date(tax.createdAt) < eligibleFrom) {
      throw new ErrorHandler(
        "Wallet refund is not available for orders before 19 June 2026",
        400
      );
    }

    const updatedTax = await Tax.findOneAndUpdate(
      {
        _id: taxId,
        refundedToWallet: { $ne: true },
        status: CONSTANTS.ORDER_STATUS.CANCELLED,
        userId: { $ne: null },
      },
      {
        refundedToWallet: true,
        isAmountRefunded: true,
      },
      { new: true }
    );

    if (!updatedTax) {
      throw new ErrorHandler("Tax cannot be refunded to wallet", 400);
    }

    try {
      await WalletManager.creditRefund({
        userId: updatedTax.userId,
        amount: updatedTax.amount,
        orderId: updatedTax.orderId,
      });
    } catch (error) {
      await Tax.findByIdAndUpdate(taxId, {
        status: tax.status,
        refundedToWallet: false,
        isAmountRefunded: tax.isAmountRefunded,
      });
      throw error;
    }

    return updatedTax;
  };

  static rollbackFailedHybridPayment = async (tax) => {
    if (
      tax.walletAmountPaid <= 0 ||
      tax.paymentStatus === CONSTANTS.PAYMENT_STATUS.COMPLETED ||
      tax.paymentStatus === CONSTANTS.PAYMENT_STATUS.FAILED
    ) {
      return;
    }

    await WalletManager.rollbackTaxDebit({
      userId: tax.userId,
      amount: tax.walletAmountPaid,
      orderId: tax.orderId,
    });

    await this.updateTaxByOrderId(tax.orderId, {
      paymentStatus: CONSTANTS.PAYMENT_STATUS.FAILED,
      status: CONSTANTS.ORDER_STATUS.CANCELLED,
      walletAmountPaid: 0,
    });
  };

  // This picks orders in created status from last 2 hrs & checks if payment is completed.
  // If payment is completed, update the order status to confirmed.
  // For hybrid wallet+gateway orders stuck past 2hrs, auto-refund wallet portion.
  static updateTaxStatusViaCron = async () => {
    const twoHourAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const taxes = await Tax.find({
      status: CONSTANTS.ORDER_STATUS.CREATED,
      createdAt: { $gte: twoHourAgo },
    }).select("orderId walletAmountPaid gatewayAmountPaid paymentStatus userId paymentMethod -_id");

    for (const tax of taxes) {
      const paymentStatus = await this.getPaymentStatus(tax.orderId);
      if (paymentStatus) {
        await this.updateTaxByOrderId(tax.orderId, {
          status: CONSTANTS.ORDER_STATUS.CONFIRMED,
          paymentStatus: CONSTANTS.PAYMENT_STATUS.COMPLETED,
        });
      }
    }

    const staleHybridTaxes = await Tax.find({
      status: CONSTANTS.ORDER_STATUS.CREATED,
      paymentMethod: CONSTANTS.PAYMENT_METHOD.WALLET,
      gatewayAmountPaid: { $gt: 0 },
      walletAmountPaid: { $gt: 0 },
      paymentStatus: CONSTANTS.PAYMENT_STATUS.PENDING,
      createdAt: { $lt: twoHourAgo },
    }).lean();

    for (const tax of staleHybridTaxes) {
      await this.rollbackFailedHybridPayment(tax);
    }
  };

  static cancelStalePaymentPendingOrders = async () => {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const staleTaxes = await Tax.find({
      status: CONSTANTS.ORDER_STATUS.PAYMENT_PENDING,
      createdAt: { $lt: cutoff },
    }).lean();

    for (const tax of staleTaxes) {
      if (tax.walletAmountPaid > 0 && tax.userId) {
        await WalletManager.rollbackTaxDebit({
          userId: tax.userId,
          amount: tax.walletAmountPaid,
          orderId: tax.orderId,
        });
      }

      await Tax.findByIdAndUpdate(tax._id, {
        status: CONSTANTS.ORDER_STATUS.CANCELLED,
        paymentStatus: CONSTANTS.PAYMENT_STATUS.FAILED,
        cancellationReason:
          "Auto-cancelled: payment not received within 48 hours",
        walletAmountPaid: 0,
      });
    }
  };
}

export default TaxManager;
