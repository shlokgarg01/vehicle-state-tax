class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(fields = ["firstName"]) {
    if (this.queryStr.keyword) {
      const keyword = this.queryStr.keyword;

      // Get the schema of the model
      const schemaPaths = this.query.model.schema.paths;
      const searchConditions = fields.map((field) => {
        const fieldType = schemaPaths[field]?.instance; // Check the field type in schema
        if (fieldType === "Number") {
          return isNaN(keyword) ? null : { [field]: Number(keyword) }; // Convert keyword to Number for numeric fields
        } else {
          return { [field]: { $regex: keyword, $options: "i" } }; // Use regex for strings
        }
      });
      this.query = this.query.find({ $or: searchConditions.filter(Boolean) }); // Remove null values
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "perPage"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // filter for createdAt
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
