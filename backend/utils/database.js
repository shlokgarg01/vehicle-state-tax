const ErrorHandler = require("./errorHandler");

class Database {
  constructor(model) {
    this.model = model;
  }

  deleteById = async (id) => {
    return await this.model.delete({ _id: id });
  };

  createRecord = async (data) => {
    let rec = await this.model.create(data);
    if (!rec) {
      throw new ErrorHandler(
        "Error while creating record. Please try after sometime.",
        400
      );
    }

    return rec;
  };

  findById = async (id) => {
    return await this.model.findById(id);
  };

  find = async (params = {}, sortParams = {}) => {
    return await this.model.find(params).sort(sortParams);
  };

  findOne = async (data, selectFields = [], populateFields = []) => {
    return await this.model.findOne(data).populate(populateFields).select(`+${selectFields.join(" +")}`);
  };

  findByIdAndUpdate = async (id, updateParams = {}) => {
    let record = await this.model.findByIdAndUpdate(id, updateParams, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    return record;
  };

  countDocuments = async (params = {}) => {
    return await this.model.countDocuments(params);
  };

  sort = async (params) => {
    return await this.model.sort(params);
  };
}

module.exports = Database;
