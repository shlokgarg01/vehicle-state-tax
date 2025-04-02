import express from "express";
import asyncHandler from "express-async-handler";
import {
  registerUser,
  loginUser,
  assignManagerRole,
  deleteUser,
  updateUser,
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Register route
router.post("/register", asyncHandler(registerUser));

// Login route
router.post("/login", asyncHandler(loginUser));

// Admin route (accessible only by admins)
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  asyncHandler((req, res) => {
    res.json({ message: "Welcome, Admin!" });
  })
);

// Manager route (accessible only by managers)
router.get(
  "/manager-dashboard",
  protect,
  authorizeRoles("manger"),
  asyncHandler((req, res) => {
    res.json({ message: "Welcome to the manager dashboard" });
  })
); // Token required

// Admin routes
router.delete(
  "/delete/:userId",
  protect,
  authorizeRoles("admin"),
  asyncHandler(deleteUser)
);
router.put(
  "/update/:userId",
  protect,
  authorizeRoles("admin"),
  asyncHandler(updateUser)
);
router.put(
  "/assign-manager/:userId",
  protect,
  authorizeRoles("admin"),
  asyncHandler(assignManagerRole)
);

export default router;
