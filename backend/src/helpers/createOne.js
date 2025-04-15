import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

/**
 * Generic create controller for any Mongoose model.
 *
 * @param {Model} Model - Mongoose model
 * @param {string} modelName - Friendly name for logs/errors
 * @param {Object} options
 * @param {string[]} options.requiredFields - Required fields for creation
 * @param {string[]} options.uniqueFields - Fields to check for exact uniqueness
 * @param {string[]} options.caseInsensitiveFields - Fields to check uniqueness case-insensitively
 * @param {string[]} options.sanitizeFields - Fields to trim (e.g. email, mode)
 * @param {Object[]} options.uniqueConditions - Array of conditional uniqueness checks: { condition, type, message }
 * @param {(doc: any) => any} [options.responseData] - Optional transformer for the response shape
 * @param {Object} [options.defaultFields] - Default values to apply if not provided in request
 */
export const createOne = (
  Model,
  modelName = "Document",
  {
    requiredFields = [],
    uniqueFields = [],
    caseInsensitiveFields = [],
    sanitizeFields = [],
    uniqueConditions = [],
    responseData,
    defaultFields = {},
  } = {}
) =>
  asyncHandler(async (req, res) => {
    const body = { ...defaultFields, ...req.body };

    // Sanitize fields
    sanitizeFields.forEach((field) => {
      if (typeof body[field] === "string") {
        body[field] = body[field].trim();
      }
    });

    // Check required fields
    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        (typeof body[field] === "string" && body[field].trim() === "")
      ) {
        throw new ErrorHandler(`Field '${field}' is required`, 400);
      }
    }

    // Check case-sensitive unique fields
    for (const field of uniqueFields) {
      if (body[field]) {
        const existing = await Model.findOne({ [field]: body[field] });
        if (existing) {
          throw new ErrorHandler(
            `${modelName} with ${field} '${body[field]}' already exists`,
            400
          );
        }
      }
    }

    // Check case-insensitive unique fields
    for (const field of caseInsensitiveFields) {
      if (body[field]) {
        const regex = new RegExp(`^${body[field]}$`, "i");
        const existing = await Model.findOne({ [field]: regex });
        if (existing) {
          throw new ErrorHandler(
            `${modelName} with ${field} '${body[field]}' already exists (case-insensitive)`,
            400
          );
        }
      }
    }

    // Complex unique conditions
    for (const item of uniqueConditions) {
      const { condition, type = "and", message } = item;
      const mongoOperator =
        type === "or" ? "$or" : type === "nor" ? "$nor" : "$and";

      const queryArray = Object.entries(condition).reduce((acc, [key, val]) => {
        if (body[key] !== undefined) {
          acc.push({ [key]: body[key] });
        }
        return acc;
      }, []);

      if (queryArray.length === Object.keys(condition).length) {
        const exists = await Model.findOne({ [mongoOperator]: queryArray });
        if (exists) {
          throw new ErrorHandler(
            message || `${modelName} with condition [${type}] already exists`,
            400
          );
        }
      }
    }

    // Create document
    const doc = await Model.create(body);

    if (!doc) {
      throw new ErrorHandler(`Failed to create ${modelName}`, 400);
    }

    // Transform response shape if needed
    const responsePayload = responseData ? responseData(doc) : doc;

    res.status(201).json({
      success: true,
      message: `${modelName} created successfully`,
      data: responsePayload,
    });
  });
