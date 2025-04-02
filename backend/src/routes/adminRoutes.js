import express from "express";
import asyncHandler from "express-async-handler";
import {
  viewUsers,
  searchUsers,
  viewManagers,
  resetPassword,
  bulkDeleteUsers,
  sendNotification,
  // increaseManagerLimit,
  // blockUser,
  // softDeleteUser,
} from "../controllers/adminController.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";

const adminRoutes = express.Router();

// View all users
adminRoutes.get(
  "/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  asyncHandler(viewUsers)
);

// Search/filter users
adminRoutes.get(
  "/users/search",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  asyncHandler(searchUsers)
);

// View managers
adminRoutes.get(
  "/managers",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  asyncHandler(viewManagers)
);

// Reset user password
adminRoutes.put(
  "/reset-password/:userId",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  asyncHandler(resetPassword)
);

// Bulk delete users
adminRoutes.post(
  "/bulk-delete",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  asyncHandler(bulkDeleteUsers)
);

// Send system notifications
adminRoutes.post(
  "/send-notification",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  asyncHandler(sendNotification)
);

// Increase manager limit
// adminRoutes.put(
//   "/increase-manager-limit",
//   protect,
//   authorizeRoles("admin"),
// //   asyncHandler(increaseManagerLimit)
// // );

// // Block a user
// // adminRoutes.put("/block-user/:userId", protect, admin, asyncHandler(blockUser));

// // Soft delete a user
// adminRoutes.put(
//   "/soft-delete/:userId",
//   protect,
//   authorizeRoles("admin"),
//   asyncHandler(softDeleteUser)
// );

export default adminRoutes;
