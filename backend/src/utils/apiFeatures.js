class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(fields = []) {
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
    ["search", "page", "perPage"].forEach((key) => delete queryCopy[key]);

    const mongoFilter = {};

    Object.entries(queryCopy).forEach(([key, value]) => {
      // Handle JSON operators like ?age[gte]=20
      if (typeof value === "object") {
        mongoFilter[key] = {};
        Object.entries(value).forEach(([op, val]) => {
          mongoFilter[key][`$${op}`] = val;
        });
      }
      // Apply partial match for strings (e.g., username=j → $regex)
      else if (typeof value === "string" && isNaN(value)) {
        mongoFilter[key] = { $regex: value.trim(), $options: "i" };
      }
      // Apply exact match for numbers
      else {
        mongoFilter[key] = value;
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
