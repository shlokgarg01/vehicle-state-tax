import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

// Middleware to protect routes with JWT authentication
export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  let token = req.headers["authorization"] || null;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource.", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedData.id);

  if (!user) {
    return next(
      new ErrorHandler("Invalid authentication token. Please login.", 401)
    );
  }

  req.user = user;
  next();
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
