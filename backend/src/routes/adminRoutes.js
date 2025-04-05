import express from "express";
import {
  // changeManagerPassword,
  deleteEmployee,
  deleteUser,
  searchUsers,
  updateEmployee,
  viewManagers,
} from "../controllers/adminController.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";
import { USER_ROLES } from "../constants/constants.js";

const adminRoutes = express.Router();

adminRoutes.get(
  "/users",
  isAuthenticatedUser,
  authorizeRoles([USER_ROLES.ADMIN]),
  searchUsers
);

adminRoutes.get(
  "/managers",
  isAuthenticatedUser,
  authorizeRoles([USER_ROLES.ADMIN]),
  viewManagers
);

adminRoutes.delete(
  "/user/:id",
  isAuthenticatedUser,
  authorizeRoles([USER_ROLES.ADMIN]),
  deleteUser
);

adminRoutes.delete(
  "/employee/:id",
  isAuthenticatedUser,
  authorizeRoles([USER_ROLES.ADMIN]),
  deleteEmployee
);

adminRoutes.put(
  "/employee/:id",
  isAuthenticatedUser,
  authorizeRoles([USER_ROLES.ADMIN]),
  updateEmployee
);

export default adminRoutes;
