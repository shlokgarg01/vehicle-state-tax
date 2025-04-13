import Tax from "../models/Tax.js";
import ApiFeatures from "../utils/apiFeatures.js";
import TaxManager from "../managers/taxManager.js";
import CONSTANTS from "../constants/constants.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { uploadFile } from "../helpers/uploadHelpers.js";

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
      message: "Internal server error in creating atax",
      error: error,
    });
  }
};

// Get All Taxes (With Filters, Search, Pagination)
export const getAllTaxes = async (req, res) => {
  try {
    // const { perPage = 10, page = 1 } = req.query;
    const page = req.query.page ? Number(req.query.page) : null;
    const perPage = req.query.perPage ? Number(req.query.perPage) : null;

    // Apply filters & search on base query for total count
    const countQuery = Tax.find();
    const apiFeatureForCount = new ApiFeatures(countQuery, req.query)
      .search([
        "vehicleNumber",
        "mobileNumber",
        "state",
        "category",
        "isCompleted",
        "status",
      ])
      .filter();

    const filteredCount = await apiFeatureForCount.query.countDocuments();

    // Apply same filters, search, and pagination for paginated results
    const paginatedQuery = Tax.find().populate("whoCompleted");
    const apiFeature = new ApiFeatures(paginatedQuery, req.query)
      .search([
        "vehicleNumber",
        "mobileNumber",
        "state",
        "category",
        "isCompleted",
        "status",
      ])
      .filter()
      .sort("-createdAt")
      .pagination(Number(perPage));

    const taxes = await apiFeature.query.lean();

    res.status(200).json({
      success: true,
      count: filteredCount,
      totalPages: Math.ceil(filteredCount / Number(perPage)),
      currentPage: Number(page),
      taxes,
    });
  } catch (error) {
    console.error("getAllTaxes error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    const taxes = await Tax.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User tax history fetched successfully",
      data: { taxes },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createTaxAndPaymentURL = async (req, res) => {
  try {
    const { orderId, amount, mobileNumber, category, ...taxData } = req.body;

    const paymentLink = await TaxManager.createPaymentLink(
      orderId,
      amount,
      mobileNumber
    );
    const taxEntry = await TaxManager.createTaxEntry(req.user?._id, {
      ...taxData,
      category,
      orderId,
      amount,
      mobileNumber,
      paymentLink,
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
    const isPaymentCompleted = await TaxManager.getPaymentStatus(orderId);

    if (isPaymentCompleted) {
      let tax = await TaxManager.getTaxByOrderId(orderId);
      if (tax.status === CONSTANTS.ORDER_STATUS.CREATED) {
        tax = await TaxManager.updateTaxByOrderId(orderId, {
          status: CONSTANTS.ORDER_STATUS.CONFIRMED,
        });
        res.status(200).json({
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
    tax = await TaxManager.updateTaxByOrderId(orderId, {
      fileUrl: uploadResponse.url,
      isCompleted: true,
      whoCompleted: req.user._id,
      status: CONSTANTS.ORDER_STATUS.CLOSED,
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
