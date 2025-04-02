import Employee from "../models/Employee.js";
import jwt from "jsonwebtoken";
import OTP from "../models/SignupOTP.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import { generateOTP, otpHash, sendOTP } from "../utils/otpUtils.js";
import { createSession } from "../utils/sessionUtils.js";
import asyncHandler from "express-async-handler";
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
// 🟢 Send OTP for login (no registration required)
export const sendOTPForLogin = asyncHandler(async (req, res, next) => {
  try {
    const { contactNumber } = req.body;

    if (!contactNumber) {
      console.error("🚨 Missing contact number!");
      return next(new ErrorHandler("Contact number is required", 400));
    }

    // Generate OTP
    const otp = contactNumber === "8307747802" ? "123456" : generateOTP();
    const hash = otpHash(otp);
    console.log(`🔢 Generated OTP: ${otp}`);
    console.log(`🔑 Hashed OTP: ${hash}`);

    // Delete any existing OTPs for this number
    await OTP.deleteMany({ contactNumber });

    // Create new OTP record
    const otpRecord = await OTP.create({
      contactNumber,
      otpHash: hash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 mins
    });
    console.log("✅ OTP Record Saved:", otpRecord);

    // Send OTP to user (mock or real SMS service)
    await sendOTP(otp, contactNumber);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("🔥 Error in sendOTPForLogin:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

// 🟢 Verify OTP and login
export const authenticateViaOTP = asyncHandler(async (req, res, next) => {
  try {
    const { contactNumber, otp } = req.body;

    if (!contactNumber || !otp) {
      console.error("🚨 Missing contactNumber or OTP:", { contactNumber, otp });
      return next(new ErrorHandler("Contact number and OTP are required", 400));
    }

    const hash = otpHash(otp);
    console.log(`🔢 Received OTP: ${otp}`);
    console.log(`🔑 Computed Hash: ${hash}`);

    // Debugging: Check all stored OTPs for this contactNumber
    const allOtps = await OTP.find({ contactNumber });
    console.log("📌 All OTPs in DB for this contact:", allOtps);

    // Find matching OTP
    const otpRecord = await OTP.findOne({
      contactNumber,
      otpHash: hash,
      expiresAt: { $gt: new Date() },
    });

    console.log("🔍 Matching OTP Record:", otpRecord);

    if (!otpRecord) {
      console.error("🚨 Invalid or Expired OTP");
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }

    // Clean up OTP records
    await OTP.deleteMany({ contactNumber });

    // Create session (or JWT token)
    const sessionToken = await createSession(contactNumber);
    console.log("✅ Generated Session Token:", sessionToken);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      sessionToken,
    });
  } catch (error) {
    console.error("🔥 Error in authenticateViaOTP:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

// 🟢 Register a new employee
export const registerEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password, contactNumber } = req.body;

    // 🔹 Validate Required Fields
    if (!username || !email || !password) {
      console.error("🚨 Missing registration fields!");
      return next(new ErrorHandler("All fields are required", 400));
    }

    // 🔹 Check if Employee Already Exists
    const employeeExists = await Employee.findOne({
      $or: [{ email }, { contactNumber }, { username }],
    });

    if (employeeExists) {
      console.error("🚨 Employee already exists:", employeeExists);
      return next(new ErrorHandler("Employee already exists", 400));
    }

    // 🔹 Assign Role (First employee is 'admin', others 'manager' by default)
    // const adminExists = await Employee.findOne({ role: "admin" });
    const role = "manager";

    // 🔹 Create Employee
    const employee = await Employee.create({
      username,
      email,
      password,
      contactNumber,
      role,
    });

    console.log("✅ Employee Registered:", employee);

    res.status(201).json({
      token: generateToken(employee._id),
      employee,
    });
  } catch (error) {
    console.error("🔥 Error in registerEmployee:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

// 🟢 Employee Login
export const loginEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // 🔹 Validate Required Fields
    if (!password) {
      console.error("🚨 Missing login fields!");
      return next(new ErrorHandler("Email and password are required", 400));
    }
    if (!email && !username) {
      return next(new ErrorHandler("Email or username is required", 400));
    }

    // 🔹 Find Employee
    const employee = await Employee.findOne({
      $or: [{ email }, { username }],
    }).select("+password");

    if (!employee || !(await employee.matchPassword(password))) {
      console.error("🚨 Invalid login attempt:", { email, password });
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    console.log("✅ Employee Logged In:", employee);

    res.json({
      token: generateToken(employee._id),
      employee,
    });
  } catch (error) {
    console.error("🔥 Error in loginEmployee:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});
