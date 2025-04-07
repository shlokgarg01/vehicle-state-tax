import express from "express";
import {
  authenticateViaOTP,
  getUserDetails,
  loginEmployee,
  registerEmployee,
  sendOTPForLogin,
} from "../controllers/authController.js";
import CONSTANTS from "../constants/constants.js";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../middlewares/authMiddlewares.js";

const authRoutes = express.Router();

authRoutes.post("/verify-otp", authenticateViaOTP);
authRoutes.post("/send-otp", sendOTPForLogin);
authRoutes.get("/me", isAuthenticatedUser, getUserDetails); // API to get the logged-in user details

authRoutes.post("/login", loginEmployee);
authRoutes.post(
  "/register",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  registerEmployee
);

export default authRoutes;
