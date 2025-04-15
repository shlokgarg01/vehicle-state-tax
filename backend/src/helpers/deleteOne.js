import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

/**
 * Deletes (soft or hard) a document using mongoose-delete plugin.
 *
 * @param {Model} Model - Mongoose model (must use mongoose-delete plugin)
 * @param {string} modelName - For user-friendly messages
 * @param {Function} customCheck - Optional pre-delete validation (e.g. check role)
 * @param {Object} options - { softDelete: true }
 */
export const deleteOne = (
  Model,
  modelName = "Document",
  customCheck = null,
  options = { softDelete: true }
) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.length < 12) {
      throw new ErrorHandler("Invalid or missing ID", 400);
    }

    // Fetch the document (supporting soft-deleted ones if needed)
    const fetchFn = Model.findByIdWithDeleted || Model.findById;
    const doc = await fetchFn.call(Model, id);

    if (!doc) {
      throw new ErrorHandler(`${modelName} not found`, 404);
    }

    // Prevent deleting already soft-deleted doc when soft delete is disabled
    if (doc.deleted && !options.softDelete) {
      throw new ErrorHandler(`${modelName} is already soft deleted`, 400);
    }

    // Optional validation logic
    if (customCheck && typeof customCheck === "function") {
      await customCheck(doc, req); // throw inside if unauthorized
    }

    // Delete: soft or hard
    if (options.softDelete) {
      if (!doc.deleted) {
        await doc.delete(); // from mongoose-delete
      }
    } else {
      await doc.remove(); // permanent removal
    }

    res.status(200).json({
      success: true,
      message: `${modelName} ${
        options.softDelete ? "soft deleted" : "permanently deleted"
      } successfully`,
    });
  });
