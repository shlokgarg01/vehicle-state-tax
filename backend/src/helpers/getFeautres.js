import ApiFeatures from "../utils/apiFeatures.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

/**
 * Flexible API feature utility for search, filter, sort, paginate, and more.
 */
export const getFeatures = async ({
  Model,
  req,
  res,
  searchFields = [],
  populate = null,
  projection = "",//
  defaultSort = "-createdAt",
  defaultLimit = 10,
  customFilter = {},
  lean = true,
}) => {
  try {
    const resultsPerPage = Number(req.query.perPage) || defaultLimit;
    const currentPage = Number(req.query.page) || 1;

    // Construct base query
    let query = Model.find(customFilter, projection);
    if (populate) query = query.populate(populate);
    if (lean) query = query.lean();

    // Apply all features
    const apiFeatures = new ApiFeatures(query, req.query)
      .search(searchFields)
      .filter()
      .sort(defaultSort)
      .pagination(resultsPerPage);

    const queryFilter = apiFeatures.getFilter?.() || {};

    // Parallel query execution for performance
    const [docs, filteredCount, totalCount] = await Promise.all([
      apiFeatures.query,
      Model.countDocuments({ ...customFilter, ...queryFilter }),
      Model.estimatedDocumentCount(),
    ]);

    const totalPages = Math.ceil(filteredCount / resultsPerPage);

    return {
      success: true,
      docs,
      filteredCount,
      totalCount,
      currentPage,
      resultsPerPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  } catch (error) {
    console.error("getFeatures error:", error);

    if (res) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error in getFeatures",
        error: error.message || error,
      });
    } else {
      throw new ErrorHandler("getFeatures failed:" + error.message);
    }
  }
};
