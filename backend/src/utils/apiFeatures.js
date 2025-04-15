class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
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
    ["search", "page", "perPage"].forEach((key) => delete queryCopy[key]);

    const mongoFilter = [];

    Object.entries(queryCopy).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return;
      }

      // Exact match override (e.g., seatCapacity)
      if (key === "seatCapacity") {
        mongoFilter.push({ [key]: value });
      }

      // Array of values → OR of regex matches
      else if (Array.isArray(value)) {
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

      // Object-based filters like { price: { gte: 1000 } }
      else if (typeof value === "object") {
        const ops = {};
        Object.entries(value).forEach(([op, val]) => {
          ops[`$${op}`] = val;
        });
        mongoFilter.push({ [key]: ops });
      }

      // Partial string or number match
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
