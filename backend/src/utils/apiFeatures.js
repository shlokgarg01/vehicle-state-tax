class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(fields = []) {
    if (this.queryStr.search && fields.length > 0) {
      const keyword = this.queryStr.search.trim();

      const searchConditions = fields.map((field) => {
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

    const mongoFilter = {};

    Object.entries(queryCopy).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return;
      }

      if (Array.isArray(value)) { // Handling array values with OR condition
        mongoFilter[key] = { $in: value };
      }
      else if (typeof value === "object") {
        mongoFilter[key] = {};
        Object.entries(value).forEach(([op, val]) => {
          mongoFilter[key][`$${op}`] = val;
        });
      }
      else if (typeof value === "string" && isNaN(value)) { // Handling String values
        mongoFilter[key] = { $regex: value.trim(), $options: "i" };
      }
      else { // Handling integer
        mongoFilter[key] = isNaN(value) ? value : Number(value);
      }
    });

    this.query = this.query.find(mongoFilter);
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
