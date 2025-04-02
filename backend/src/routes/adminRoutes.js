import express from "express";
import asyncHandler from "express-async-handler";
import {
  viewUsers,
  searchUsers,
  viewManagers,
  resetPassword,
  bulkDeleteUsers,
  sendNotification,
  increaseManagerLimit,
  // blockUser,
  softDeleteUser,
} from "../controllers/adminController.js";
import { protect, admin } from "../middlewares/authMiddlewares.js";

const adminRoutes = express.Router();

// View all users
adminRoutes.get("/users", protect, admin, asyncHandler(viewUsers));

// Search/filter users
adminRoutes.get("/users/search", protect, admin, asyncHandler(searchUsers));

// View managers
adminRoutes.get("/managers", protect, admin, asyncHandler(viewManagers));

// Reset user password
adminRoutes.put(
  "/reset-password/:userId",
  protect,
  admin,
  asyncHandler(resetPassword)
);

// Bulk delete users
adminRoutes.post("/bulk-delete", protect, admin, asyncHandler(bulkDeleteUsers));

// Send system notifications
adminRoutes.post(
  "/send-notification",
  protect,
  admin,
  asyncHandler(sendNotification)
);

// Increase manager limit
adminRoutes.put(
  "/increase-manager-limit",
  protect,
  admin,
  asyncHandler(increaseManagerLimit)
);

// Block a user
// adminRoutes.put("/block-user/:userId", protect, admin, asyncHandler(blockUser));

// Soft delete a user
adminRoutes.put(
  "/soft-delete/:userId",
  protect,
  admin,
  asyncHandler(softDeleteUser)
);

export default adminRoutes;
