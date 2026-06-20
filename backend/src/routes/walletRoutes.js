import express from "express";
import {
  getWalletBalance,
  getWalletTransactions,
  createWithdrawalRequest,
  getUserWithdrawals,
  getSavedPayoutDetails,
  createSavedPayoutDetail,
  updateSavedPayoutDetail,
  deleteSavedPayoutDetail,
} from "../controllers/walletController.js";
import { isAuthenticatedUser } from "../middlewares/authMiddlewares.js";

const walletRoutes = express.Router();

walletRoutes.get("/balance", isAuthenticatedUser, getWalletBalance);
walletRoutes.get("/transactions", isAuthenticatedUser, getWalletTransactions);
walletRoutes.get("/payout-details", isAuthenticatedUser, getSavedPayoutDetails);
walletRoutes.post("/payout-details", isAuthenticatedUser, createSavedPayoutDetail);
walletRoutes.put("/payout-details/:id", isAuthenticatedUser, updateSavedPayoutDetail);
walletRoutes.delete("/payout-details/:id", isAuthenticatedUser, deleteSavedPayoutDetail);
walletRoutes.post("/withdraw", isAuthenticatedUser, createWithdrawalRequest);
walletRoutes.get("/withdrawals", isAuthenticatedUser, getUserWithdrawals);

export default walletRoutes;
