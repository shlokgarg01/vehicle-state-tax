import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Middleware to protect routes with JWT authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found, authorization denied");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid or expired token, authorization denied");
    }
  } else {
    res.status(401);
    throw new Error("No token provided, authorization denied");
  }
});

// Middleware to allow access only for admins
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied, admin only");
  }
};

// Middleware to allow access only for managers
const manager = (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied, manager only");
  }
};

// Middleware to check for multiple roles (admin or manager)
const adminOrManager = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "manager")) {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied, admin or manager only");
  }
};
// change --> single for function

export { protect, admin, manager, adminOrManager };
