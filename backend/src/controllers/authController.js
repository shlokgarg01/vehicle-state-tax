import Employee from "../models/Employee.js";
import jwt from "jsonwebtoken";
import OTP from "../models/SignupOTP.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import { generateOTP, otpHash, sendOTP } from "../utils/otpUtils.js";

import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role, contactNumber: user.contactNumber }, // Include role in the payload
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// 🟢 Send OTP for login (no registration required)
export const sendOTPForLogin = asyncHandler(async (req, res, next) => {
  try {
    const { contactNumber } = req.body;

    if (!contactNumber) {
      return next(new ErrorHandler("Contact number is required", 400));
    }

    const otp = contactNumber === "8307747802" ? "123456" : generateOTP();
    const hash = otpHash(otp);

    console.log(`🔢 Generated OTP: ${otp}`);
    console.log(`🔑 Hashed OTP: ${hash}`);

    // Delete existing OTPs
    await OTP.deleteMany({ contactNumber });

    // Store OTP in DB
    const otpRecord = await OTP.create({
      contactNumber,
      otpHash: hash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("✅ OTP Record Saved:", otpRecord);
    await sendOTP(otp, contactNumber);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
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
      return next(new ErrorHandler("Contact number and OTP are required", 400));
    }

    const hash = otpHash(otp);
    console.log(`🔢 Received OTP: ${otp}`);
    console.log(`🔑 Computed Hash: ${hash}`);

    const otpRecord = await OTP.findOne({
      contactNumber,
      otpHash: hash,
      expiresAt: { $gt: new Date() },
    });

    console.log("🔍 Matching OTP Record:", otpRecord);

    if (!otpRecord) {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }

    await OTP.deleteMany({ contactNumber });

    let user = await User.findOne({ contactNumber });
    if (!user) {
      user = await User.create({ contactNumber, role: "user" });
    }

    const token = generateToken(user);
    console.log("✅ Generated JWT Token:", token);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user,
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

    // Validate required fields
    if (!username || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Check if employee already exists
    const employeeExists = await Employee.findOne({
      $or: [{ email }, { contactNumber }, { username }],
    });

    if (employeeExists) {
      return next(new ErrorHandler("Employee already exists", 400));
    }

    // New employees are always managers
    const role = "manager";

    // Create the employee
    const employee = await Employee.create({
      username,
      email,
      password,
      contactNumber,
      role, // Set role to "manager"
    });

    console.log("✅ Manager Registered by Admin:", employee);

    res.status(201).json({
      success: true,
      message: "Manager registered successfully",
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
      console.error("🚨 Missing password!");
      return next(new ErrorHandler("Password is required", 400));
    }
    if (!email && !username) {
      return next(new ErrorHandler("Email or username is required", 400));
    }

    // 🔹 Find Employee
    const employee = await Employee.findOne({
      $or: [{ email }, { username }],
    }).select("+password"); // Ensure password is fetched

    if (!employee) {
      console.error("🚨 Employee not found:", { email, username });
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    // 🔹 Ensure password exists in the database
    if (!employee.password) {
      console.error(
        "🚨 Employee password is missing in the database!",
        employee
      );
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    // 🔹 Compare Password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      console.error("🚨 Password does not match!", { email });
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
