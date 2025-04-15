import crypto from "crypto";
import { sendOtpSMS } from "./sendNotifications.js";

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create hash of OTP for secure storage
export const otpHash = (otp) => {
  return String(crypto.createHash("sha256").update(otp).digest("hex"));
};

export const sendOTP = async (otp, contactNumber) => {
  sendOtpSMS({contactNumbers: contactNumber, otp});
};
