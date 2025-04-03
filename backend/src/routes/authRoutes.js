import express from "express";
import {
  authenticateViaOTP,
  loginEmployee,
  registerEmployee,
  sendOTPForLogin,
} from "../controllers/authController.js";
import { USER_ROLES } from "../constants/constants.js";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../middlewares/authMiddlewares.js";

const authRoutes = express.Router();

authRoutes.post("/verify-otp", authenticateViaOTP);
authRoutes.post("/send-otp", sendOTPForLogin);
authRoutes.post(
  "/register",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  registerEmployee
);
authRoutes.post("/login", loginEmployee);

export default authRoutes;
