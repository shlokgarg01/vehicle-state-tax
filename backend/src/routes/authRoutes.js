import express from "express";
import {
  authenticateViaOTP,
  completeRegistration,
  getUserDetails,
  loginEmployee,
  logoutUser,
  sendOTPForLogin,
  updateFcmToken,
} from "../controllers/authController.js";
import { isAuthenticatedUser } from "../middlewares/authMiddlewares.js";

const authRoutes = express.Router();

authRoutes.post("/verify-otp", authenticateViaOTP);
authRoutes.post(
  "/complete-registration",
  isAuthenticatedUser,
  completeRegistration
);
authRoutes.post("/send-otp", sendOTPForLogin);
authRoutes.get("/me", isAuthenticatedUser, getUserDetails);
authRoutes.put("/fcm-token", isAuthenticatedUser, updateFcmToken);

authRoutes.post("/login", loginEmployee);
authRoutes.get("/logout", isAuthenticatedUser, logoutUser);

export default authRoutes;
