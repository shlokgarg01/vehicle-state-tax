import Tax from "../models/Tax.js";
import State from "../models/State.js";
import Price from "../models/Price.js";
import ApiFeatures from "../utils/apiFeatures.js";
import TaxManager from "../managers/taxManager.js";
import CONSTANTS from "../constants/constants.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { uploadFile } from "../helpers/uploadHelpers.js";
import { parseCustomDate } from '../helpers/dateHelper.js'

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
    delete req.query['sort'];

    // Initial query with deleted: false
    const baseQuery = Tax.find()
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .populate("whoCompleted");

    // Apply filters/search
    let apiFeature = new ApiFeatures(baseQuery, req.query)
      .search()
      .filter();

    // Get count BEFORE pagination — this is filtered count
    const totalTaxes = await Tax.countDocuments(apiFeature.query.getFilter());

    // Apply pagination after counting
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
    const { orderId, amount, mobileNumber, category, ...taxData } = req.body;

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

export const updateTax = async (req, res) => {
  try {
    const { id } = req.params;
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const paymentRedirect = async (req, res) => {
  try {
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