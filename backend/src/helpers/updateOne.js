import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
// import { ErrorHandler } from "./errorHandlerUtils.js";

/**
 * Generic update controller for any Mongoose model.
 *
 * @param {Model} Model - Mongoose model
 * @param {string} modelName - Friendly name for error messages/logs
 * @param {Object} options
 * @param {string[]} options.fieldsToCheckUnique - Fields to check for uniqueness before update
 * @param {string[]} options.sanitizeFields - Fields to trim (e.g. strings like name, email)
 * @param {boolean} options.selectPassword - Whether to include password field in doc
 */
export const updateOne = (Model, modelName = "Document", options = {}) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      fieldsToCheckUnique = [],
      sanitizeFields = [],
      selectPassword = false,
      customValidation = null,
    } = options;

    let query = Model.findById(id);
    if (selectPassword) query = query.select("+password");

    let doc = await query;
    if (!doc) throw new ErrorHandler(`${modelName} not found`, 404);

    const body = { ...req.body };

    // Sanitize fields (trim)
    sanitizeFields.forEach((field) => {
      if (typeof body[field] === "string") {
        body[field] = body[field].trim();
      }
    });

    // Uniqueness checks
    for (const field of fieldsToCheckUnique) {
      const newValue = body[field];
      if (
        newValue &&
        newValue !== String(doc[field]) // Cast to string for consistency
      ) {
        const existing = await Model.findOne({ [field]: newValue });
        if (existing && String(existing._id) !== String(id)) {
          throw new ErrorHandler(`${field} is already taken`, 400);
        }
      }
    }
    // Run custom logic like compound uniqueness check or normalization
    if (typeof customValidation === "function") {
      await customValidation({ body, doc, req });
    }

    // Assign only updated fields
    Object.keys(body).forEach((key) => {
      doc[key] = body[key];
    });

    await doc.save();

    res.status(200).json({
      success: true,
      message: `${modelName} updated successfully`,
      data: doc,
    });
  });
