import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import Employee from "../models/Employee.js";

// Middleware to protect routes with JWT authentication
export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  // Check if token exists and starts with "Bearer "
  if (!token || !token.startsWith("Bearer ")) {
    return next(new ErrorHandler("Please login to access this resource.", 401));
  }

  try {
    // Extract token (remove "Bearer ")
    token = token.split(" ")[1];

    // Verify token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from DB
    const user =
      (await User.findById(decodedData.userId)) ||
      (await Employee.findById(decodedData.userId));

    if (!user) {
      return next(
        new ErrorHandler("Invalid authentication token. Please login.", 401)
      );
    }

    // Attach user to request object
    req.user = user;
    req.role = decodedData.role;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token.", 401));
  }
});
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied, required roles: ${roles.join(", ")}`);
    }
    next();
  };
};

// change --> single for function

// export { authorizeRoles };
