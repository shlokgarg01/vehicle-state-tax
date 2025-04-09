import express from "express";
import {
  authenticateViaOTP,
  getUserDetails,
  loginEmployee,
  logoutUser,
  sendOTPForLogin,
} from "../controllers/authController.js";
import { isAuthenticatedUser } from "../middlewares/authMiddlewares.js";

const authRoutes = express.Router();

authRoutes.post("/verify-otp", authenticateViaOTP);
authRoutes.post("/send-otp", sendOTPForLogin);
authRoutes.get("/me", isAuthenticatedUser, getUserDetails);

authRoutes.post("/login", loginEmployee);
authRoutes.get("/logout", isAuthenticatedUser, logoutUser);

export default authRoutes;
