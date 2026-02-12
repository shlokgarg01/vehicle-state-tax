import CONSTANTS from "../constants/constants.js";

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Helper function to normalize category values (convert keys to values)
  normalizeCategoryValue(value) {
    // If value is a key in TAX_CATEGORIES, return the actual value
    if (CONSTANTS.TAX_CATEGORIES[value]) {
      return CONSTANTS.TAX_CATEGORIES[value];
    }
    // If value is a key in MODES, return the actual value
    if (CONSTANTS.MODES[value]) {
      return CONSTANTS.MODES[value];
    }
    // Otherwise return as-is
    return value;
  }

  search(fields = []) {
    if (this.queryStr.search && fields.length > 0) {
      const keyword = this.queryStr.search.trim();

      const searchConditions = fields.map((field) => {
        if (field === "seatCapacity") {
          // Exact match for seatCapacity
          return { [field]: keyword };
        }

        if (["string", "text"].includes(typeof this.queryStr[field])) {
          return { [field]: { $regex: keyword, $options: "i" } };
        }

        // Handle number fields as string using $expr + $regexMatch
        return {
          $expr: {
            $regexMatch: {
              input: { $toString: `$${field}` },
              regex: keyword,
              options: "i",
            },
          },
        };
      });

      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  sort(defaultSort = "-createdAt") {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    ["search", "page", "perPage", "sort"].forEach((key) => delete queryCopy[key]);

    const mongoFilter = [];

    // Fields that should use exact match (enum fields, IDs, etc.)
    // These fields benefit from index usage and don't need regex matching
    const exactMatchFields = [
      "status",
      "category",
      "taxMode",
      "vehicleType",
      "seatCapacity",
      "userId",
      "whoCompleted",
      "orderId",
      "paymentId",
      "isCompleted",
      "isWhatsAppNotificationSent",
      "isAmountRefunded",
    ];

    Object.entries(queryCopy).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return;
      }

      // Array of values → use $in for exact match fields, OR of regex matches for others
      // Check arrays FIRST before checking exact match fields
      if (Array.isArray(value)) {
        if (exactMatchFields.includes(key)) {
          // Normalize category values if needed
          const normalizedValue = key === "category" 
            ? value.map(v => this.normalizeCategoryValue(v))
            : value;
          mongoFilter.push({ [key]: { $in: normalizedValue } });
        } else {
          const orConditions = value.map((val) => ({
            $expr: {
              $regexMatch: {
                input: { $toString: `$${key}` },
                regex: val.toString(),
                options: "i",
              },
            },
          }));
          mongoFilter.push({ $or: orConditions });
        }
      }

      // Object-based filters like { price: { gte: 1000 } }
      else if (typeof value === "object") {
        const ops = {};
        Object.entries(value).forEach(([op, val]) => {
          ops[`$${op}`] = val;
        });
        mongoFilter.push({ [key]: ops });
      }

      // Exact match for enum fields and IDs - uses indexes efficiently
      // This handles single values (not arrays, not objects)
      else if (exactMatchFields.includes(key)) {
        // Normalize category values if needed (convert keys like "BORDER_TAX" to values like "border_tax")
        const normalizedValue = key === "category" 
          ? this.normalizeCategoryValue(value)
          : value;
        mongoFilter.push({ [key]: normalizedValue });
      }

      // Partial string or number match for non-enum fields
      else {
        mongoFilter.push({
          $expr: {
            $regexMatch: {
              input: { $toString: `$${key}` },
              regex: value.toString(),
              options: "i",
            },
          },
        });
      }
    });

    if (mongoFilter.length > 0) {
      this.query = this.query.find({ $and: mongoFilter });
    }

    return this;
  }

  pagination(resultPerPage = 10) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
export default ApiFeatures;
