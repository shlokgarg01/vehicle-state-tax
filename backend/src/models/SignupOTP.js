import mongoose from "mongoose";

const signupOTPSchema = new mongoose.Schema({
  contactNumber: { type: Number, required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: {
    type: Number,
    default: 0,
    max: 5,
  },
});

const OTP = mongoose.model("OTP", signupOTPSchema);
export default OTP;
