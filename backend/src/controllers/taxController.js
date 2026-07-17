import Tax from "../models/Tax.js";
import State from "../models/State.js";
import Price from "../models/Price.js";
import ApiFeatures from "../utils/apiFeatures.js";
import TaxManager from "../managers/taxManager.js";
import CONSTANTS from "../constants/constants.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { uploadFile } from "../helpers/uploadHelpers.js";
import { parseCustomDate } from '../helpers/dateHelper.js'
import { sendTaxViaWhatsApp } from "../utils/sendNotifications.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import ConstantsManager from "../managers/constantsManager.js";
import { resolveBackendUrl } from "../utils/requestUrlUtils.js";
import { verifyPaymentLinkCallback } from "../services/razorpay.js";

// Create a Tax Entry
export const createTax = async (req, res) => {
  try {
    const taxEntry = await TaxManager.createTaxEntry(req.user?._id, req.body);

    res.status(201).json({
      success: true,
      taxEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating the tax",
      error: error,
    });
  }
};

// Get All Taxes (With Filters, Search, Pagination)
export const getAllTaxes = async (req, res) => {
  try {
    const resultsPerPage = parseInt(req.query.perPage) || 10;
    const { sort } = req.query;
    const queryCopy = { ...req.query };
    delete queryCopy.sort;

    let baseQuery = Tax.find();

    const createdAtFilter = {};
    if (queryCopy.startDate) {
      createdAtFilter.$gte = new Date(`${queryCopy.startDate}T00:00:00+05:30`);
      delete queryCopy.startDate;
    }
    if (queryCopy.endDate) {
      createdAtFilter.$lte = new Date(`${queryCopy.endDate}T23:59:59.999+05:30`);
      delete queryCopy.endDate;
    }
    if (Object.keys(createdAtFilter).length > 0) {
      baseQuery = baseQuery.find({ createdAt: createdAtFilter });
    }

    // Apply filters/search BEFORE populate and sort for better performance
    let apiFeature = new ApiFeatures(baseQuery, queryCopy)
      .search()
      .filter();

    const filterObj = apiFeature.query.getQuery ? apiFeature.query.getQuery() : {};
    const totalTaxes = await Tax.countDocuments(filterObj);

    // Sort after filtering to optimize index usage
    apiFeature.query = apiFeature.query.sort({ createdAt: sort === 'asc' ? 1 : -1 });
    apiFeature.query = apiFeature.query.populate("whoCompleted");
    
    apiFeature = apiFeature.pagination(resultsPerPage);
    const taxes = await apiFeature.query;

    res.status(200).json({
      success: true,
      totalTaxes,
      taxes,
      resultsPerPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a Tax Entry by ID
export const getTaxById = async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await Tax.findById(id).lean().populate("whoCompleted");
    if (!tax) {
      return res
        .status(404)
        .json({ success: false, message: "Tax entry not found" });
    }

    res
      .status(200)
      .json({ success: true, tax, message: "Tax entry fetched successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserTaxHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    const taxes = await Tax.find({
      userId,
      status: { $in: [CONSTANTS.ORDER_STATUS.CLOSED, CONSTANTS.ORDER_STATUS.CONFIRMED] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User tax history fetched successfully",
      data: { taxes },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTaxAndPaymentURL = async (req, res) => {
  try {
    const { orderId, amount, mobileNumber, category, paymentMethod, ...taxData } = req.body;
    const backendUrl = resolveBackendUrl(req);

    let price = 0;
    if ([CONSTANTS.MODES.BORDER_TAX, CONSTANTS.MODES.ROAD_TAX].includes(taxData.category)) {
      let state = await State.findOne({ name: taxData.state.toLowerCase(), mode: category, status: CONSTANTS.STATUS.ACTIVE })
      price = await Price.findOne({ mode: category, taxMode: taxData.taxMode, seatCapacity: taxData.seatCapacity, state: state._id, status: CONSTANTS.STATUS.ACTIVE })
    } else {
      price = await Price.findOne({ mode: category, taxMode: taxData.taxMode, seatCapacity: taxData.seatCapacity, status: CONSTANTS.STATUS.ACTIVE })
    }

    let commission = 0
    if (req.body.taxMode === 'days') {
      const startDate = parseCustomDate(req.body.startDate)
      const endDate = parseCustomDate(req.body.endDate)
      const numberOfDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 // Adding 1 to include both start and end dates
      if (numberOfDays <= 2) {
        commission = 30
      } else if (numberOfDays <= 5) {
        commission = 50
      } else if (numberOfDays <= 9) {
        commission = 70
      } else {
        commission = 100
      }
    } else {
      commission = price?.serviceCharge || 0
    }
    taxData.commission = commission

    const selectedPaymentMethod = (paymentMethod || CONSTANTS.PAYMENT_METHOD.GATEWAY).toLowerCase();

    if (selectedPaymentMethod === CONSTANTS.PAYMENT_METHOD.WALLET) {
      const result = await TaxManager.createTaxWithWalletPayment(req.user?._id, {
        ...taxData,
        category,
        orderId,
        amount,
        mobileNumber,
        backendUrl,
      });

      return res.status(200).json({
        success: true,
        message: result.requiresGateway
          ? "Partial wallet payment applied. Complete remaining amount via gateway."
          : "Payment completed via wallet.",
        data: {
          paymentLink: result.paymentLink,
          taxEntry: result.taxEntry,
          walletAmountPaid: result.walletAmountPaid,
          gatewayAmountPaid: result.gatewayAmountPaid,
          requiresGateway: result.requiresGateway,
        },
      });
    }

    const paymentLink = await TaxManager.createPaymentLink(
      orderId,
      amount,
      mobileNumber,
      { backendUrl }
    );
    const taxEntry = await TaxManager.createTaxEntry(req.user?._id, {
      ...taxData,
      category,
      orderId,
      amount,
      mobileNumber,
      paymentLink,
      paymentMethod: CONSTANTS.PAYMENT_METHOD.GATEWAY,
      gatewayAmountPaid: amount,
      paymentStatus: CONSTANTS.PAYMENT_STATUS.PENDING,
    });

    res.status(200).json({
      success: true,
      message: "Payment URL created successfully",
      data: { paymentLink, taxEntry },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const paymentStatusCheck = async (req, res) => {
  try {
    const { orderId } = req.params;
    let tax = await TaxManager.getTaxByOrderId(orderId);

    if (tax.paymentStatus === CONSTANTS.PAYMENT_STATUS.FAILED) {
      return res.status(400).json({
        success: false,
        message: "Payment failed. Wallet amount has been refunded.",
        data: { tax },
      });
    }

    if (
      tax.paymentStatus === CONSTANTS.PAYMENT_STATUS.COMPLETED &&
      tax.status !== CONSTANTS.ORDER_STATUS.CREATED
    ) {
      return res.status(200).json({
        success: true,
        message: "Payment is successful.",
        data: { tax },
      });
    }

    const isPaymentCompleted = await TaxManager.getPaymentStatus(orderId);

    if (isPaymentCompleted) {
      if (tax.status === CONSTANTS.ORDER_STATUS.CREATED) {
        tax = await TaxManager.updateTaxByOrderId(orderId, {
          status: CONSTANTS.ORDER_STATUS.CONFIRMED,
          paymentStatus: CONSTANTS.PAYMENT_STATUS.COMPLETED,
        });
        return res.status(200).json({
          success: true,
          message: "Payment is successful.",
          data: { tax },
        });
      }

      return res.status(200).json({
        success: true,
        message: `Tax is already ${tax.status}.`,
        data: { tax },
      });
    }

    res.status(400).json({
      success: false,
      message: "Payment not completed yet.",
      data: { tax },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const uploadTax = catchAsyncErrors(async (req, res) => {
  const fileData = req.files?.file;
  const orderId = req.body.orderId;
  if (!fileData)
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  if (!orderId)
    return res
      .status(400)
      .json({ success: false, message: "Order Id is required" });

  const uploadResponse = await uploadFile(fileData, "new_taxes");
  let tax = {};
  if (uploadResponse.isUploaded) {
    tax = await TaxManager.getTaxByOrderId(orderId);
    let isWhatsAppNotificationSent = false;

    const shouldSendTaxWA = await ConstantsManager.getBooleanConstant('SEND_TAX_WHATSAPP', false);
    if (shouldSendTaxWA) {
      isWhatsAppNotificationSent = await sendTaxViaWhatsApp({
        contactNumber: tax.mobileNumber,
        vehicleNumber: tax.vehicleNumber,
        fileUrl: uploadResponse.url,
        filename: fileData.name || '',
      });
    }

    tax = await TaxManager.updateTaxByOrderId(orderId, {
      fileUrl: uploadResponse.url,
      isCompleted: true,
      whoCompleted: req.user._id,
      status: CONSTANTS.ORDER_STATUS.CLOSED,
      isWhatsAppNotificationSent,
    });
  }
  res.status(uploadResponse.isUploaded ? 200 : 400).json({
    success: uploadResponse.isUploaded,
    message: uploadResponse.message,
    data: {
      url: uploadResponse.url,
      tax,
    },
  });
});

export const resendTaxWhatsAppNotification = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.body;
  if (!orderId) {
    return next(new ErrorHandler("Order Id is required", 400));
  }

  const tax = await TaxManager.getTaxByOrderId(orderId);
  if (!tax?.fileUrl) {
    return next(new ErrorHandler("Tax file not available to send", 400));
  }

  let isWhatsAppNotificationSent = false;
  const shouldSendTaxWA = await ConstantsManager.getBooleanConstant('SEND_TAX_WHATSAPP', false);
  if (shouldSendTaxWA) {
    isWhatsAppNotificationSent = await sendTaxViaWhatsApp({
      contactNumber: tax.mobileNumber,
      vehicleNumber: tax.vehicleNumber,
      fileUrl: tax.fileUrl,
      filename: tax.fileUrl.split('/').pop() || 'tax-file',
    });
  }

  await TaxManager.updateTaxByOrderId(orderId, {
    isWhatsAppNotificationSent: tax.isWhatsAppNotificationSent || isWhatsAppNotificationSent
  }); // set to true if not already sent

  res.status(200).json({
    success: true,
    message: "WhatsApp notification sent successfully",
    data: { isWhatsAppNotificationSent },
  });
});

export const updateTax = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.status === CONSTANTS.ORDER_STATUS.CANCELLED) {
      const updatedTax = await TaxManager.cancelTax(
        id,
        req.body.cancellationReason
      );
      return res.status(200).json({
        success: true,
        message: "Order cancelled",
        data: { tax: updatedTax },
      });
    }

    const updatedTax = await Tax.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTax) {
      return res.status(404).json({ success: false, message: "Tax not found" });
    }
    res.status(200).json({
      success: true,
      message: "Tax Updated",
      data: {
        tax: updatedTax
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const refundTaxToWallet = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body || {};

  const isAdmin = req.user.role === CONSTANTS.USER_ROLES.ADMIN;
  if (!isAdmin && !req.user.canRefund) {
    return next(new ErrorHandler("You are not allowed to refund to wallet", 403));
  }

  if (!password) {
    return next(new ErrorHandler("Password is required", 400));
  }

  const storedPassword = await ConstantsManager.getConstantValue("REFUND_PASSWORD");
  if (!storedPassword || password !== storedPassword) {
    return next(new ErrorHandler("Invalid refund password", 403));
  }

  const tax = await TaxManager.refundTaxToWallet(id);

  res.status(200).json({
    success: true,
    message: "Full amount refunded to user wallet",
    data: { tax },
  });
});

export const paymentRedirect = async (req, res) => {
  try {
    const callback = verifyPaymentLinkCallback(req.query);
    if (callback.paid && callback.orderId) {
      try {
        const tax = await TaxManager.getTaxByOrderId(callback.orderId);
        if (tax.status === CONSTANTS.ORDER_STATUS.CREATED) {
          await TaxManager.updateTaxByOrderId(callback.orderId, {
            status: CONSTANTS.ORDER_STATUS.CONFIRMED,
            paymentStatus: CONSTANTS.PAYMENT_STATUS.COMPLETED,
          });
        }
      } catch {
        // Show thank-you page even if order lookup fails.
      }
    }

    res.send(`<pre>🎉 धन्यवाद!
🟢 आपकी पेमेंट सफलतापूर्वक प्राप्त हो गई है।

📨 आपका टैक्स 10 मिनट के अंदर भेज दिया जाएगा।
⏳ कृपया थोड़ा इंतज़ार करें।

🛑 यदि कोई समस्या आती है:
📞 10 मिनट बाद WhatsApp कॉल करें
📲 <a href="tel:9001065873">9001065873</a>

💼 वाहन राज्य कर टीम की ओर से
आपका दिन शुभ हो! 🙏</pre>`)
  } catch(error) {
    res.status(500).json({ success: false, message: error.message });
  }
}