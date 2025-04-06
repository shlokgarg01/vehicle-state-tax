import { taxModels } from "../constants/constants.js";
import {
  BorderTax,
  RoadTax,
  AllIndiaPermit,
  AllIndiaTax,
  LoadingVehicle,
} from "../models/Tax.js";
import ApiFeatures from "../utils/apiFeatures.js";

const getTaxModel = (category) => taxModels[category] || null;

// Create a Tax Entry
export const createTax = async (req, res) => {
  try {
    const { category, ...taxData } = req.body;
    const TaxModel = getTaxModel(category);

    if (!TaxModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tax category" });
    }
    const userId = req.user?._id;

    let taxEntry = new TaxModel({
      ...taxData,
      category,
      user_id: userId,
    });
    taxEntry = await taxEntry.save();

    const populatedEntry = await TaxModel.findById(taxEntry._id);
    res.status(201).json({
      success: true,
      taxEntry: {
        ...populatedEntry.toObject(),
      },
    });
  } catch (error) {
    console.error("Error creating tax:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get All Taxes (With Filters, Search, Pagination)
export const getAllTaxes = async (req, res) => {
  try {
    const { category, perPage, page } = req.query;
    const TaxModel = getTaxModel(category);
    if (!TaxModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tax category" });
    }

    const query = TaxModel.find();
    const apiFeature = new ApiFeatures(query, req.query)
      .search(["vehicleNumber", "mobileNumber", "state", "category", "isCompleted"])
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
    const { id, category } = req.params;
    const TaxModel = getTaxModel(category);

    if (!TaxModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tax category" });
    }
    const tax = await TaxModel.findById(id).lean();

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

    // Query all tax collections
    const [borderTaxes, roadTaxes, aipTaxes, aiTaxes, loadingVehicles] =
      await Promise.all([
        BorderTax.find({ user_id: userId })
          .populate("state")
          .sort({ createdAt: -1 }),
        RoadTax.find({ user_id: userId })
          .populate("state")
          .sort({ createdAt: -1 }),
        AllIndiaPermit.find({ user_id: userId }).sort({ createdAt: -1 }),
        AllIndiaTax.find({ user_id: userId }).sort({ createdAt: -1 }),
        LoadingVehicle.find({ user_id: userId }).sort({ createdAt: -1 }),
      ]);

    res.status(200).json({
      success: true,
      message: "User tax history fetched successfully",
      data: {
        borderTaxes,
        roadTaxes,
        allIndiaPermits: aipTaxes,
        allIndiaTaxes: aiTaxes,
        loadingVehicles,
      },
    });
  } catch (error) {
    console.error("Error fetching user tax history:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};