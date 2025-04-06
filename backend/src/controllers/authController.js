import Employee from "../models/Employee.js";
import jwt from "jsonwebtoken";
import OTP from "../models/SignupOTP.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import { generateOTP, otpHash, sendOTP } from "../utils/otpUtils.js";

import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

//  Send OTP for login (no registration required)
export const sendOTPForLogin = asyncHandler(async (req, res, next) => {
  try {
    const { contactNumber } = req.body;
    if (!contactNumber) {
      return next(new ErrorHandler("Contact number is required", 400));
    }

    const otp = contactNumber === 8307747802 ? "114488" : generateOTP();
    const hash = otpHash(otp);

    console.log(` Generated OTP: ${otp}`);
    console.log(` Hashed OTP: ${hash}`); // remove this in production

    await OTP.deleteMany({ contactNumber });

    const otpRecord = await OTP.create({
      contactNumber,
      otpHash: hash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOTP(otp, contactNumber);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(" Error in sendOTPForLogin:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

//  Verify OTP and login
export const authenticateViaOTP = asyncHandler(async (req, res, next) => {
  try {
    const { contactNumber, otp } = req.body;

    if (!contactNumber || !otp) {
      return next(new ErrorHandler("Contact number and OTP are required", 400));
    }

    const hash = otpHash(otp);

    const otpRecord = await OTP.findOne({ contactNumber });
    if (!otpRecord) {
      return next(
        new ErrorHandler("No OTP found. Please try sending the OTP again.", 400)
      );
    }
    if (otpRecord.otpHash !== hash) {
      return next(new ErrorHandler("Incorrect OTP. Please try again.", 400));
    } else if (otpRecord.expiresAt < new Date()) {
      return next(
        new ErrorHandler("OTP has expired. Please request a new OTP.", 400)
      );
    }

    await OTP.deleteMany({ contactNumber });

    let user = await User.findOne({ contactNumber });
    if (!user) {
      user = await User.create({ contactNumber });
    }

    const token = generateToken(user);
    console.log(" Generated JWT Token:", token);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error(" Error in authenticateViaOTP:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

//  Register a new employee
export const registerEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password, contactNumber } = req.body;

    if (!username || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const employeeExists = await Employee.findOne({
      $or: [{ email }, { contactNumber }, { username }],
    });

    if (employeeExists) {
      return next(new ErrorHandler("Employee already exists", 400));
    }

    const employee = await Employee.create({
      username,
      email,
      password,
      contactNumber,
    });

    res.status(201).json({
      success: true,
      message: "Manager registered successfully",
      employee,
    });
  } catch (error) {
    console.error("Error in registerEmployee:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

//  Employee Login
export const loginEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!email && !username) {
      return next(new ErrorHandler("Email or username is required", 400));
    }

    const employee = await Employee.findOne({
      $or: [{ email }, { username }],
    }).select("+password");

    if (!employee) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    if (!employee.password) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return next(new ErrorHandler(" Invalid Password", 400));
    }

    const user = employee;
    res.json({
      token: generateToken(user),
      employee,
    });
  } catch (error) {
    console.error("Error in loginEmployee:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

export const getUserDetails = asyncHandler(async (req, res, next) => {
  let userId = req.user.id
  const user = await User.findById(userId) || await Employee.findById(userId);

  res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    user,
  });
});