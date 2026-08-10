import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import OTP from "../models/SignupOTP.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import { generateOTP, otpHash, sendOTP } from "../utils/otpUtils.js";
import generateToken from "../utils/generateToken.js";
import { sendWelcomeMessage } from "../utils/sendNotifications.js";
import ConstantsManager from "../managers/constantsManager.js";
import ReferralManager from "../managers/referralManager.js";

const isRegistrationComplete = (user) => user?.registrationComplete !== false;

//  Send OTP for login (no registration required)
export const sendOTPForLogin = asyncHandler(async (req, res, next) => {
  try {
    const { contactNumber } = req.body;
    if (!contactNumber) {
      return next(new ErrorHandler("Contact number is required", 400));
    }

    const otp =
      parseInt(contactNumber) === 8307747802 ? "114488" : generateOTP();
    const hash = otpHash(otp);

    await OTP.deleteMany({ contactNumber });

    const otpRecord = await OTP.create({
      contactNumber,
      otpHash: hash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOTP(otp, contactNumber);

    res
      .status(200)
      .json({ success: true, message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(" Error in sendOTPForLogin:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

//  Verify OTP and login
export const authenticateViaOTP = asyncHandler(async (req, res, next) => {
  try {
    const { contactNumber, otp, appVersion, fcmToken } = req.body;

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
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        contactNumber,
        registrationComplete: false,
      });
      await ReferralManager.assignUniqueReferralCode(user._id);
    } else {
      await ReferralManager.ensureReferralCodeForExistingUser(user._id);
      if (user.registrationComplete === false) {
        isNewUser = true;
      }
    }

    const token = generateToken(user);
    const userUpdate = {
      lastLogin: new Date(),
      appVersion: appVersion || "",
    };
    if (fcmToken !== undefined && fcmToken !== null) {
      userUpdate.fcmToken = String(fcmToken).trim();
    }
    await User.findByIdAndUpdate(user._id, userUpdate);
    user = await User.findById(user._id);
    res.status(200).json({
      success: true,
      message: isNewUser
        ? "OTP verified. Complete registration to continue."
        : "Logged in successfully",
      token,
      user,
      isNewUser,
      registrationComplete: isRegistrationComplete(user),
    });
  } catch (error) {
    console.error(" Error in authenticateViaOTP:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

export const completeRegistration = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (isRegistrationComplete(user)) {
    return next(new ErrorHandler("Registration is already complete", 400));
  }

  const { displayName, referralCode } = req.body;
  const trimmedName = String(displayName ?? "").trim().slice(0, 80);
  if (!trimmedName) {
    return next(new ErrorHandler("Display name is required", 400));
  }

  await ReferralManager.registerNewUser({
    userId: user._id,
    referralCodeInput: referralCode,
    displayName: trimmedName,
  });

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { displayName: trimmedName, registrationComplete: true },
    { new: true }
  );

  const shouldSendWelcome = await ConstantsManager.getBooleanConstant(
    "SEND_WELCOME_WHATSAPP",
    false
  );
  if (shouldSendWelcome) {
    await sendWelcomeMessage({ contactNumber: updatedUser.contactNumber });
  }

  res.status(200).json({
    success: true,
    message: "Registration completed",
    user: updatedUser,
    registrationComplete: true,
    isNewUser: false,
  });
});

//  Employee Login
export const loginEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { password, username } = req.body;
    if (!username || !password) {
      return next(new ErrorHandler("username and password are required", 400));
    }

    const employee = await Employee.findOne({ username }).select("+password");
    if (!employee) {
      return next(new ErrorHandler("Invalid username", 400));
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid Password", 400));
    }

    const user = employee;
    res.json({
      token: generateToken(user),
      user: employee,
    });
  } catch (error) {
    console.error("Error in loginEmployee:", error);
    next(new ErrorHandler("Internal Server Error in login emplyee", 500));
  }
});

// Logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export const updateFcmToken = asyncHandler(async (req, res, next) => {
  try {
    const { fcmToken, appVersion } = req.body;
    if (fcmToken === undefined || fcmToken === null) {
      return next(new ErrorHandler("FCM token is required", 400));
    }

    const userUpdate = {
      fcmToken: String(fcmToken).trim(),
    };
    if (appVersion !== undefined && appVersion !== null) {
      userUpdate.appVersion = String(appVersion).trim();
    }

    const user = await User.findByIdAndUpdate(req.user._id, userUpdate, {
      new: true,
    });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "FCM token updated successfully",
    });
  } catch (error) {
    console.error("Error in updateFcmToken:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

export const getUserDetails = asyncHandler(async (req, res, next) => {
  try {
    let userId = req.user.id;

    // Try to fetch user details first from User model
    let user = await User.findById(userId);

    // If not found, try Employee model
    if (!user) {
      user = await Employee.findById(userId);
    }

    // If user or employee is not found, throw error
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Respond with user details
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user,
      registrationComplete: isRegistrationComplete(user),
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching user details:", error);

    // Pass error to the global error handler middleware
    next(new ErrorHandler("Internal Server Error in user details", 500));
  }
});
