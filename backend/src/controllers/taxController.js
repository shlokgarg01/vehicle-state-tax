import State from "../models/State.js";
import {
  BorderTax,
  RoadTax,
  AllIndiaPermit,
  AllIndiaTax,
  LoadingVehicle,
} from "../models/Tax.js";
import ApiFeatures from "../utils/apiFeatures.js";

// 🔹 Utility Function to Select Tax Model Based on Category
const taxModels = {
  BorderTax,
  RoadTax,
  AllIndiaPermit,
  AllIndiaTax,
  LoadingVehicle,
};
const getTaxModel = (category) => taxModels[category] || null;

// ✅ Create a Tax Entry
export const createTax = async (req, res) => {
  try {
    const { category, state, ...taxData } = req.body;
    const TaxModel = getTaxModel(category);

    if (!TaxModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tax category" });
    }

    let stateId = null;
    if (state) {
      const existingState = await State.findOne({ name: state.trim() });
      if (!existingState) {
        return res.status(400).json({
          success: false,
          message: "Invalid state. Please select a valid state.",
        });
      }
      stateId = existingState._id; // get ObjectId of the state
    }

    const userId = req.user?._id || req.user?.id;

    const taxEntry = new TaxModel({
      ...taxData,
      category,
      user_id: userId,
      ...(stateId && { state: stateId }), // only add state if it exists
    });

    // await taxEntry.save();
    const savedEntry = await taxEntry.save();

    // Populate the 'state' field with its name
    const populatedEntry = await TaxModel.findById(savedEntry._id)
      .populate("state", "name")
      .populate("seatType", "label");
    res.status(201).json({
      success: true,
      taxEntry: {
        ...populatedEntry.toObject(),
        state: populatedEntry.state?.name,
        seatType: populatedEntry.seatType?.label, // 👈 optional: simplify in response
      },
    });
  } catch (error) {
    console.error("Error creating tax:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get All Taxes (With Filters, Search, Pagination)
// ✅ Get All Taxes (Search, Filter, Pagination)
export const getAllTaxes = async (req, res) => {
  try {
    const { category, search, sort, perPage, page, ...filters } = req.query;
    let taxModels = [
      BorderTax,
      RoadTax,
      AllIndiaPermit,
      AllIndiaTax,
      LoadingVehicle,
    ];

    if (category) {
      const TaxModel = getTaxModel(category);
      if (!TaxModel) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid tax category" });
      }
      taxModels = [TaxModel];
    }

    let taxData = [];

    // 🔹 Fetch data from each model (With Filters)
    for (const model of taxModels) {
      let query = model.find();

      // Apply Search
      if (search) {
        const searchRegex = new RegExp(search, "i");
        query = query.or([
          { vehicleNumber: searchRegex },
          { mobileNumber: searchRegex },
          { state: searchRegex },
          { category: searchRegex },
          { amount: searchRegex },
        ]);
      }

      // Apply Filters
      if (filters) {
        for (let key in filters) {
          const value = filters[key];

          if (key.includes("[gte]")) {
            query = query.where(key.replace("[gte]", "")).gte(value);
          } else if (key.includes("[lte]")) {
            query = query.where(key.replace("[lte]", "")).lte(value);
          } else if (key.includes("[gt]")) {
            query = query.where(key.replace("[gt]", "")).gt(value);
          } else if (key.includes("[lt]")) {
            query = query.where(key.replace("[lt]", "")).lt(value);
          } else if (
            ["vehicleNumber", "mobileNumber", "state", "category"].includes(key)
          ) {
            // Allow partial match via regex
            query = query.where(key).regex(new RegExp("^" + value, "i")); // Starts with
          } else {
            // Default exact match
            query = query.where(key).equals(value);
          }
        }
      }

      // Apply Sorting
      if (sort) {
        const order = sort.startsWith("-") ? -1 : 1;
        query = query.sort({ [sort.replace("-", "")]: order });
      } else {
        query = query.sort({ createdAt: -1 });
      }

      // Apply Pagination
      const resultPerPage = Number(perPage) || 10;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * resultPerPage;

      query = query.limit(resultPerPage).skip(skip);
      const data = await query.lean();
      taxData = [...taxData, ...data];
    }
    if (taxData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching tax records found.",
      });
    }
    // 🔹 Get Total Count
    const totalTaxes = taxData.length;

    res.status(200).json({
      success: true,
      count: taxData.length,
      totalTaxes,
      totalPages: Math.ceil(totalTaxes / (Number(perPage) || 10)),
      // currentPage,
      taxes: taxData,
    });
  } catch (error) {
    console.error("Error fetching taxes:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get a Tax Entry by ID
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

    res.status(200).json({ success: true, tax });
  } catch (error) {
    console.error("Error fetching tax by ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserTaxHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.params.userId; // Get user ID from request

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

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
// ✅ Get Taxes by Completion Status (Completed or New)
export const getTaxesByStatus = async (req, res) => {
  try {
    const { category } = req.params;
    const { is_completed } = req.query; // "true" or "false" string

    const TaxModel = getTaxModel(category);
    if (!TaxModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tax category" });
    }

    if (!["true", "false"].includes(is_completed)) {
      return res.status(400).json({
        success: false,
        message: "Query param 'is_completed' must be 'true' or 'false'",
      });
    }

    const isCompleted = is_completed === "true"; // Convert to boolean

    const taxes = await TaxModel.find({ is_completed: isCompleted }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: taxes.length,
      category,
      is_completed: isCompleted,
      taxes,
    });
  } catch (error) {
    console.error("Error fetching taxes by status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// category=BorderTax
// ?mobileNumber=99
// ?vehicleNumber=ABC1234
// ?state=Delhi
// category=BorderTax&state=Maharashtra
