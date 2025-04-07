import Tax from "../models/Tax.js";
import ApiFeatures from "../utils/apiFeatures.js";
import TaxManager from "../managers/taxManager.js";
import { CONSTANTS } from "../constants/constants.js";

// Create a Tax Entry
export const createTax = async (req, res) => {
  try {
    const taxEntry = await TaxManager.createTaxEntry(req.user?._id, req.body);
    res.status(201).json({
      success: true,
      taxEntry,
    });
  } catch (error) {
    console.error("Error creating tax:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get All Taxes (With Filters, Search, Pagination)
export const getAllTaxes = async (req, res) => {
  try {
    const { perPage, page } = req.query;
    const query = Tax.find();
    const apiFeature = new ApiFeatures(query, req.query)
      .search([
        "vehicleNumber",
        "mobileNumber",
        "state",
        "category",
        "isCompleted",
      ])
      .filter()
      .pagination(Number(perPage) || 10);

    const data = await apiFeature.query.lean();
    const totalTaxes = data.length;
    const totalPages = Math.ceil(totalTaxes / (Number(perPage) || 10));

    res.status(200).json({
      success: true,
      count: totalTaxes,
      totalPages,
      currentPage: Number(page) || 1,
      taxes: data,
    });
  } catch (error) {
    console.error("Error fetching taxes:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get a Tax Entry by ID
export const getTaxById = async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await Tax.findById(id).lean();
    if (!tax) {
      return res
        .status(404)
        .json({ success: false, message: "Tax entry not found" });
    }

    res
      .status(200)
      .json({ success: true, tax, message: "Tax entry fetched successfully" });
  } catch (error) {
    console.error("Error fetching tax by ID:", error);
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
    console.error("Error fetching user tax history:", error);
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
    })
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

// 1743955948850, 1743953168962, 1743948571467, 1743940040950 - fail
// 1743955519312, 1743956145604, 1743949648549, 1743948442748 - success



// NOT USED YET
// 1743937994685, 1743930495310, 1743897729530, 1743902989119 - fail
// 1743939191420, 1743938613959, 1743938333824, 1743938085027 - success



// CREATED via App
// 1743960614887