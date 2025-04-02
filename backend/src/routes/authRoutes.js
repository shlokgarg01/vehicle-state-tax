import express from "express";
import asyncHandler from "express-async-handler";
import {
  // registerUser,
  // loginUser,
  // assignManagerRole,
  // deleteUser,
  // updateUser,
  // sendOTP,
  authenticateViaOTP,
  loginEmployee,
  registerEmployee,
  sendOTPForLogin,
} from "../controllers/authController.js";
import { USER_ROLES } from "../constants/constants.js";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../middlewares/authMiddlewares.js";
// import { protect, authorizeRoles } from "../middlewares/authMiddlewares.js";
import asyncHandler from "express-async-handler";
const router = express.Router();

// // Register route
// router.post("/register", authorizeRoles(), asyncHandler(registerUser));

// // Login route
// router.post("/login", asyncHandler(loginUser));

// // Admin route (accessible only by admins)
// router.get(
//   "/admin",
//   protect,
//   authorizeRoles("admin"),
//   asyncHandler((req, res) => {
//     res.json({ message: "Welcome, Admin!" });
//   })
// );

// // Manager route (accessible only by managers)
// router.get(
//   "/manager-dashboard",
//   protect,
//   authorizeRoles("manger"),
//   asyncHandler((req, res) => {
//     res.json({ message: "Welcome to the manager dashboard" });
//   })
// ); // Token required

// // Admin routes
// router.delete(
//   "/delete/:userId",
//   protect,
//   authorizeRoles("admin"),
//   asyncHandler(deleteUser)
// );
// router.put(
//   "/update/:userId",
//   protect,
//   authorizeRoles("admin"),
//   asyncHandler(updateUser)
// );
// router.put(
//   "/assign-manager/:userId",
//   protect,
//   authorizeRoles("admin"),
//   asyncHandler(assignManagerRole)
// );
// // import express from "express";

// // const router = express.Router();

router.post("/verify-otp", authenticateViaOTP);
router.post("/send-otp", sendOTPForLogin);
router.post(
  "/register",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  asyncHandler(registerEmployee)
);
router.post("/login", asyncHandler(loginEmployee));

// export default router;

export default router;
