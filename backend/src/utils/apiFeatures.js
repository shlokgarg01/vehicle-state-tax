class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(fields = []) {
    if (this.queryStr.search && fields.length > 0) {
      const keyword = this.queryStr.search.trim();
      const searchConditions = fields.map((field) => ({
        [field]: { $regex: keyword, $options: "i" },
      }));

      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    ["search", "page", "perPage"].forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    try {
      this.query = this.query.find(JSON.parse(queryStr));
    } catch (error) {
      console.error(" Filter Parsing Error:", error);
    }

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeatures;
