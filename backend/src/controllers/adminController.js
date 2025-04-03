import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";
import Employee from "../models/Employee.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import bcrypt from "bcryptjs";

/**
 * @description Search users by contact number
 * @route GET /users/search
 * @access Admin
 */
export const searchUsers = asyncHandler(async (req, res) => {
  try {
    const apiFeatures = new ApiFeatures(
      User.find().select("-password"),
      req.query
    )
      .search(["contactNumber"])
      .filter()
      .pagination(10);

    const users = await apiFeatures.query;
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("🔥 Error in searchUsers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/**
 * @description View all managers with filters and pagination
 * @route GET /managers
 * @access Admin
 */
export const viewManagers = asyncHandler(async (req, res) => {
  try {
    const resultPerPage = Number(req.query.perPage) || 10;
    let apiFeatures = new ApiFeatures(
      Employee.find({ role: "manager" }).select("-password"),
      req.query
    )
      .search(["username", "email", "contactNumber"])
      .filter();

    const totalManagers = await Employee.countDocuments(
      apiFeatures.query.getFilter()
    );
    apiFeatures = apiFeatures.pagination(resultPerPage);
    const managers = await apiFeatures.query;

    res.status(200).json({
      success: true,
      managers,
      totalManagers,
      totalPages: Math.ceil(totalManagers / resultPerPage),
      currentPage: Number(req.query.page) || 1,
    });
  } catch (error) {
    console.error("🔥 Error in viewManagers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/**
 * @description Delete a user by ID
 * @route DELETE /user/:id
 * @access Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.status(200).json({ message: "User deleted successfully" });
});

/**
 * @description Delete an employee by ID (Admins cannot be deleted)
 * @route DELETE /employee/:id
 * @access Admin
 */
export const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findById(id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  if (employee.role === "admin") {
    res.status(403);
    throw new Error("Admin cannot delete themselves");
  }
  await employee.deleteOne();
  res.status(200).json({ message: "Employee deleted successfully" });
});

/**
 * @description Update user details (only name, email, and role)
 * @route PUT /user/:id
 * @access Admin
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Cannot modify another admin");
  }

  user.name = name || user.name;
  user.email = email || user.email;
  if (role && (role === "user" || role === "manager")) {
    user.role = role;
  }

  await user.save();
  res.status(200).json({ message: "User updated successfully", user });
});

/**
 * @description Update employee details (username, email)
 * @route PUT /employee/:id
 * @access Admin
 */
export const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  const employee = await Employee.findById(id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  employee.username = username || employee.username;
  employee.email = email || employee.email;

  await employee.save();
  res.status(200).json({ message: "Employee updated successfully", employee });
});

/**
 * @description Change a manager's password (Only Admins can do this)
 * @route PUT /change-password/:managerId
 * @access Admin
 */
export const changeManagerPassword = asyncHandler(async (req, res, next) => {
  try {
    const { managerId } = req.params;
    const { newPassword } = req.body;

    if (req.user.role !== "admin") {
      return next(
        new ErrorHandler("Unauthorized: Only admins can change passwords", 403)
      );
    }

    const manager = await Employee.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return next(new ErrorHandler("Manager not found", 404));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    manager.password = hashedPassword;
    await manager.save();

    res.status(200).json({
      success: true,
      message: "Manager's password updated successfully",
    });
  } catch (error) {
    console.error("🔥 Error changing manager password:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});
