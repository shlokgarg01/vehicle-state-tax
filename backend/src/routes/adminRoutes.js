import express from "express";
import asyncHandler from "express-async-handler";
import {
  changeManagerPassword,
  deleteEmployee,
  deleteUser,
  searchUsers,
  updateEmployee,
  updateUser,
  viewManagers,
} from "../controllers/adminController.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";
import { USER_ROLES } from "../constants/constants.js";

const adminRoutes = express.Router();

/**
 * @route   GET /api/v1/admin/managers
 * @desc    Fetch all managers with search, filter, and pagination
 * @access  Admin Only
 */
adminRoutes.get(
  "/managers",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  viewManagers
);

/**
 * @route   DELETE /api/v1/admin/user/:id
 * @desc    Delete a user by ID
 * @access  Admin Only
 */
adminRoutes.delete(
  "/user/:id",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  deleteUser
);

/**
 * @route   PUT /api/v1/admin/user/:id
 * @desc    Update user details (name, email, role)
 * @access  Admin Only
 */
adminRoutes.put(
  "/user/:id",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  updateUser
);

/**
 * @route   DELETE /api/v1/admin/employee/:id
 * @desc    Delete an employee by ID (Admin cannot delete themselves)
 * @access  Admin Only
 */
adminRoutes.delete(
  "/employee/:id",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  deleteEmployee
);

/**
 * @route   PUT /api/v1/admin/employee/:id
 * @desc    Update employee details (username, email)
 * @access  Admin Only
 */
adminRoutes.put(
  "/employee/:id",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  updateEmployee
);

/**
 * @route   PUT /api/v1/admin/change-password/:managerId
 * @desc    Allows an admin to change a manager's password
 * @access  Admin Only
 */
adminRoutes.put(
  "/change-password/:managerId",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  changeManagerPassword
);

export default adminRoutes;
