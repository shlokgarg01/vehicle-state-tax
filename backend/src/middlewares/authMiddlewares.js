import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import Employee from "../models/Employee.js";
import config from "../config/config.js";
// Middleware to protect routes with JWT authentication
export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  let token = null;

  // Get token from Bearer format
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource.", 401));
  }

  try {
    const decodedData = jwt.verify(token, config.jwtSecret);

    const user =
      (await User.findById(decodedData.userId)) ||
      (await Employee.findById(decodedData.userId));

    if (!user) {
      return next(new ErrorHandler("User not found for this token.", 401));
    }

    req.user = user;
    req.role = decodedData.role;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return next(new ErrorHandler("Invalid or expired token.", 401));
  }
});

//  Middleware: Role-based access control
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied, required roles: ${roles.join(", ")}`);
    }
    next();
  };
};
