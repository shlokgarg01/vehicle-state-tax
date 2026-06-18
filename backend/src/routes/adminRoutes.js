import express from "express";
import {
  deleteEmployee,
  searchUsers,
  updateEmployee,
  viewManagers,
  createEmployee,
  dashboardAnalytics,
  triggerUsersExport,
} from "../controllers/adminController.js";
import { resendTaxWhatsAppNotification, refundTaxToWallet } from "../controllers/taxController.js";
import {
  getAllWithdrawals,
  completeWithdrawal,
  rejectWithdrawal,
} from "../controllers/walletController.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";
import CONSTANTS from "../constants/constants.js";

const adminRoutes = express.Router();

// create employee
adminRoutes.post(
  "/employee/create",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  createEmployee
);

// view employee
adminRoutes.get(
  "/employee",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  viewManagers
);

//  update employee
adminRoutes.put(
  "/employee/:id",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  updateEmployee
);

// delete employee
adminRoutes.delete(
  "/employee/:id",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  deleteEmployee
);

// get users
adminRoutes.get(
  "/users",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  searchUsers
);

// dashboard

adminRoutes.get(
  "/dashboard",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN, CONSTANTS.USER_ROLES.MANAGER]),
  dashboardAnalytics
);

// resend tax via WhatsApp
adminRoutes.post(
  "/tax/send-whatsapp",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN, CONSTANTS.USER_ROLES.MANAGER]),
  resendTaxWhatsAppNotification
);

// trigger user export background job
adminRoutes.post(
  "/users/export",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  triggerUsersExport
);

// wallet withdrawals
adminRoutes.get(
  "/wallet/withdrawals",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  getAllWithdrawals
);

adminRoutes.put(
  "/wallet/withdrawals/:id/complete",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  completeWithdrawal
);

adminRoutes.put(
  "/wallet/withdrawals/:id/reject",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  rejectWithdrawal
);

// refund tax to wallet
adminRoutes.post(
  "/tax/:id/refund-to-wallet",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN, CONSTANTS.USER_ROLES.MANAGER]),
  refundTaxToWallet
);

export default adminRoutes;
