import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";
import Employee from "../models/Employee.js";
import { USER_ROLES } from "../constants/constants.js";

// search users
// search contact with exact Number
export const searchUsers = asyncHandler(async (req, res) => {
  try {
    const resultPerPage = Number(req.query.perPage) || 10;

    const apiFeatures = new ApiFeatures(User.find(), req.query)
      .search(["contactNumber"])
      .filter()
      .pagination(resultPerPage);

    const users = await apiFeatures.query;

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error in searchUsers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// view managers
export const viewManagers = asyncHandler(async (req, res) => {
  try {
    const resultPerPage = Number(req.query.perPage) || 10;
    const baseQuery = Employee.find().select("-password");
    const apiFeatures = new ApiFeatures(baseQuery, req.query)
      .search(["username", "email", "contactNumber"])
      .filter();

    // Get filter object **after search + filter applied**
    const filter = apiFeatures.query.getFilter();

    // Pagination applied last
    apiFeatures.pagination(resultPerPage);

    const [managers, totalManagers] = await Promise.all([
      apiFeatures.query,
      Employee.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      managers,
      totalManagers,
      totalPages: Math.ceil(totalManagers / resultPerPage),
      currentPage: Number(req.query.page) || 1,
    });
  } catch (error) {
    console.error("Error in viewManagers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// delete employee
export const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findById(id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  if (employee.role === USER_ROLES.ADMIN) {
    res.status(403);
    throw new Error("Admin cannot delete themselves");
  }
  await employee.deleteOne();
  res.status(200).json({ success: true, message: "Employee deleted successfully" });
});

// update employee
export const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const employee = await Employee.findById(id).select("+password");
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // Restrict admin from editing another admin
  const isSelfUpdate = req.user._id.toString() === employee._id.toString();
  const isAdminEditingAdmin =
    employee.role === USER_ROLES.ADMIN && !isSelfUpdate;

  if (isAdminEditingAdmin && req.user.role !== USER_ROLES.ADMIN) {
    res.status(403);
    throw new Error("You are not allowed to modify another admin");
  }

  if (username) employee.username = username;
  if (email) employee.email = email;
  if (password) employee.password = password; // Will be hashed via pre-save hook

  await employee.save();

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    employee: {
      _id: employee._id,
      username: employee.username,
      email: employee.email,
      role: employee.role,
      status: employee.status,
    },
  });
});
