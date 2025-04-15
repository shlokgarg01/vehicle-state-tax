class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    this.mongoFilter = {}; //  store the internal filter
  }

  search(fields = []) {
    if (this.queryStr.search && fields.length > 0) {
      const keyword = this.queryStr.search.trim();

      const searchConditions = fields.map((field) => {
        if (["string", "text"].includes(typeof this.queryStr[field])) {
          return { [field]: { $regex: keyword, $options: "i" } };
        }
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
    this.query = this.query.sort(this.queryStr.sort || defaultSort);
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    ["search", "page", "perPage", "sort"].forEach(
      (key) => delete queryCopy[key]
    );

    const mongoFilter = {};

    Object.entries(queryCopy).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return;
      }

      if (Array.isArray(value)) {
        mongoFilter[key] = { $in: value };
      } else if (typeof value === "object") {
        mongoFilter[key] = {};
        Object.entries(value).forEach(([op, val]) => {
          mongoFilter[key][`$${op}`] = val;
        });
      } else if (typeof value === "string" && isNaN(value)) {
        mongoFilter[key] = { $regex: value.trim(), $options: "i" };
      } else {
        mongoFilter[key] = isNaN(value) ? value : Number(value);
      }
    });

    this.mongoFilter = mongoFilter; // Save for external use
    this.query = this.query.find(mongoFilter);
    return this;
  }

  pagination(resultPerPage = 10) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }

  // Define this so getFeatures can use it
  getFilter() {
    return this.mongoFilter;
  }
}
export default ApiFeatures;
