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
    const { category, ...taxData } = req.body;
    const TaxModel = getTaxModel(category);

    if (!TaxModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tax category" });
    }

    const taxEntry = new TaxModel({ ...taxData, category });
    await taxEntry.save();

    res.status(201).json({
      success: true,
      message: "Tax entry created successfully",
      taxEntry,
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
/**
 * @route   GET /api/taxes
 * @desc    Fetch all taxes with search, filter, and pagination functionality.
 * @query   {string} [search] - Search for text fields (vehicleNumber, mobileNumber, state, category, etc.).
 * @query   {string} [category] - Filter by tax category (BorderTax, RoadTax, AllIndiaPermit, AllIndiaTax).
 * @query   {number} [amount] - Exact amount filter (e.g., ?amount=5000).
 * @query   {number} [amount[gte]] - Filter taxes where amount is greater than or equal (e.g., ?amount[gte]=1000).
 * @query   {number} [amount[lte]] - Filter taxes where amount is less than or equal (e.g., ?amount[lte]=5000).
 * @query   {number} [seatCapacity] - Exact seat capacity filter.
 * @query   {number} [seatCapacity[gt]] - Filter seat capacity greater than a number.Ws
 * @query   {string} [createdAt[gte]] - Fetch taxes created after a specific date (format: YYYY-MM-DD).
 * @query   {string} [createdAt[lte]] - Fetch taxes created before a specific date.
 * @query   {number} [perPage] - Number of results per page for pagination (default: 10).
 * @query   {number} [page] - Page number for pagination (default: 1).
 * @returns {Object} JSON response with paginated tax records.
 *
 * @example
 * // Search taxes by vehicle number or mobile number
 * GET /api/taxes?search=ABC1234
 *
 * // Filter by category
 * GET /api/taxes?category=RoadTax
 *
 * // Get taxes within an amount range
 * GET /api/taxes?amount[gte]=2000&amount[lte]=7000
 *
 * // Get only paid taxes
 * GET /api/taxes?isPaid=true
 *
 * // Fetch records created after January 1, 2024
 * GET /api/taxes?createdAt[gte]=2024-01-01
 *
 * // Pagination Example (fetch 20 results on page 2)
 * GET /api/taxes?perPage=20&page=2
 *
 */
// category=BorderTax
// ?mobileNumber=99
// ?vehicleNumber=ABC1234
// ?state=Delhi
// category=BorderTax&state=Maharashtra
