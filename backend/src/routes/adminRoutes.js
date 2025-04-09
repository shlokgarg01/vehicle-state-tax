import express from "express";
import {
  deleteEmployee,
  searchUsers,
  updateEmployee,
  viewManagers,
  createEmployee,
} from "../controllers/adminController.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";
import CONSTANTS from "../constants/constants.js";

const adminRoutes = express.Router();

// create employee
adminRoutes.post(
  "/employee/create",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  createEmployee
);

// view employee
adminRoutes.get(
  "/employee",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  viewManagers
);

//  update employee
adminRoutes.put(
  "/employee/:id",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  updateEmployee
);

// delete employee
adminRoutes.delete(
  "/employee/:id",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  deleteEmployee
);

// get users
adminRoutes.get(
  "/users",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  searchUsers
);

export default adminRoutes;
