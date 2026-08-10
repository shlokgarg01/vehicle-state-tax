import express from "express";
import { getMyReferral, getReferralLeaderboard, updateMyDisplayName, adminListReferrals, adminReferralStats } from "../controllers/referralController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/authMiddlewares.js";
import CONSTANTS from "../constants/constants.js";
const referralRoutes = express.Router();

referralRoutes.get("/me", isAuthenticatedUser, getMyReferral);
referralRoutes.get("/leaderboard", isAuthenticatedUser, getReferralLeaderboard);
referralRoutes.patch("/profile", isAuthenticatedUser, updateMyDisplayName);

referralRoutes.get(
  "/admin/list",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  adminListReferrals
);

referralRoutes.get(
  "/admin/stats",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  adminReferralStats
);

export default referralRoutes;
