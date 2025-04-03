import {
  BorderTax,
  RoadTax,
  AllIndiaPermit,
  AllIndiaTax,
} from "../models/Tax.js";
import ApiFeatures from "../utils/apiFeatures.js";

// 🔹 Utility Function to Select Tax Model Based on Category
const getTaxModel = (category) => {
  switch (category) {
    case "BorderTax":
      return BorderTax;
    case "RoadTax":
      return RoadTax;
    case "AllIndiaPermit":
      return AllIndiaPermit;
    case "AllIndiaTax":
      return AllIndiaTax;
    default:
      return null;
  }
};

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

    const taxEntry = new TaxModel(taxData);
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
    const { category, search, sort, perPage, page } = req.query;
    let taxModels = [BorderTax, RoadTax, AllIndiaPermit, AllIndiaTax];

    // If category provided, only fetch that category's data
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

    // 🔹 Fetch data from each model (Without applying filters yet)
    for (const model of taxModels) {
      const data = await model.find().lean(); // Convert Mongoose docs to plain objects
      taxData = [...taxData, ...data]; // Merge results
    }

    // 🔹 Apply Search (Only if `search` query is present)
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive regex
      taxData = taxData.filter(
        (tax) =>
          searchRegex.test(tax.taxMode) ||
          searchRegex.test(tax.mobileNumber) ||
          searchRegex.test(tax.vehicleNumber) ||
          searchRegex.test(tax.seatCapacity) ||
          searchRegex.test(tax.category) ||
          searchRegex.test(tax.amount) ||
          searchRegex.test(tax.date)
      );
    }

    // 🔹 Apply Sorting (Default: newest first)
    if (sort) {
      taxData = taxData.sort((a, b) =>
        sort.startsWith("-") // Descending
          ? b[sort.substring(1)] - a[sort.substring(1)]
          : a[sort] - b[sort]
      );
    } else {
      // Default sorting by createdAt (Descending)
      taxData = taxData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // 🔹 Apply Pagination
    const totalTaxes = taxData.length;
    const resultPerPage = Number(perPage) || 10;
    const currentPage = Number(page) || 1;
    const startIndex = (currentPage - 1) * resultPerPage;
    const paginatedData = taxData.slice(startIndex, startIndex + resultPerPage);

    res.status(200).json({
      success: true,
      count: paginatedData.length,
      totalTaxes,
      totalPages: Math.ceil(totalTaxes / resultPerPage),
      currentPage,
      taxes: paginatedData,
    });
  } catch (error) {
    console.error("Error fetching taxes:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get a Tax Entry by ID
export const getTaxById = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id).lean();

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

// ✅ Update a Tax Entry
// export const updateTax = async (req, res) => {
//   try {
//     const updatedTax = await Tax.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//       lean: true,
//     });

//     if (!updatedTax) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Tax entry not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Tax entry updated successfully",
//       updatedTax,
//     });
//   } catch (error) {
//     console.error("Error updating tax:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // ✅ Delete a Tax Entry
// export const deleteTax = async (req, res) => {
//   try {
//     const deletedTax = await Tax.findByIdAndDelete(req.params.id).lean();

//     if (!deletedTax) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Tax entry not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Tax entry deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting tax:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
