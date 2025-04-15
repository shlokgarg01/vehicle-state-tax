import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";
import Employee from "../models/Employee.js";
import CONSTANTS from "../constants/constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import bcrypt from "bcryptjs";
import { updateOne } from "../helpers/updateOne.js";
import { createOne } from "../helpers/createOne.js";
import { getFeatures } from "../helpers/getFeautres.js";
import { deleteOne } from "../helpers/deleteOne.js";

// create employee
export const createEmployee = createOne(Employee, "Employee", {
  requiredFields: ["username", "password"],
  uniqueFields: ["username", "email", "contactNumber"],
  sanitizeFields: ["username", "email", "contactNumber"],
  responseData: (emp) => ({
    _id: emp._id,
    username: emp.username,
    email: emp.email,
    contactNumber: emp.contactNumber,
    role: emp.role,
    status: emp.status,
  }),
});
// view employee
// * /employee?search=khushi&perPage=5&page=1
export const viewManagers = asyncHandler(async (req, res) => {
  const result = await getFeatures({
    Model: Employee,
    req,
    res,
    searchFields: ["username", "email", "contactNumber"],
    projection: "-password", // Exclude password from results
    defaultLimit: 10,
    lean: true,
    customFilter: { role: "manager" }, // Only show managers
  });

  if (result?.success) {
    res.status(200).json({
      success: true,
      managers: result.docs,
      totalManagers: result.filteredCount,
      totalCount: result.totalCount,
      resultsPerPage: result.resultsPerPage,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Failed to fetch managers",
    });
  }
});

// update employee
export const updateEmployee = updateOne(Employee, "Employee", {
  fieldsToCheckUnique: ["email", "contactNumber"],
  sanitizeFields: ["email", "username", "contactNumber"],
  selectPassword: true, // optional if updating password
});

// delete employee

export const deleteEmployee = deleteOne(
  Employee,
  "Employee",
  async (doc, req) => {
    if (doc.role === "admin") {
      throw new ErrorHandler("Admin cannot be deleted", 403);
    }
    if (doc._id.toString() === req.user._id.toString()) {
      throw new ErrorHandler("You cannot delete yourself", 403);
    }
  }
  // enable soft delete via mongoose-delete
);

// search
export const searchUsers = asyncHandler(async (req, res) => {
  const result = await getFeatures({
    Model: User,
    req,
    res,
    searchFields: ["contactNumber"],
    defaultLimit: 10,
    lean: false,
    sort: "-createdAt", // optional sort
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});
