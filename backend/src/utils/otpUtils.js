import crypto from "crypto";

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create hash of OTP for secure storage
export const otpHash = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// Mock SMS sending function
export const sendOTP = async (otp, contactNumber) => {
  console.log(`OTP for ${contactNumber}: ${otp}`);
  // In production, integrate with SMS gateway like Twilio, AWS SNS, etc.
};
