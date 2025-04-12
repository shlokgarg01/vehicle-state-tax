import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import Employee from "../models/Employee.js";
import config from "../config/config.js";
import catchAsyncErrors from "./catchAsyncErrors.js";

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token || !token.startsWith("Bearer ")) {
    return next(new ErrorHandler("Please login to access this resource.", 401));
  }
  token = token.split(" ")[1];

  const decodedData = jwt.verify(token, config.JWT.secret);
  const user =
    (await User.findById(decodedData.userId)) ||
    (await Employee.findById(decodedData.userId));
  if (!user) {
    return next(
      new ErrorHandler("Invalid authentication token. Please login.", 401)
    );
  }

  req.user = user;
  next();
});

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
