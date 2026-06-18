import express from "express";
import {
  getWalletBalance,
  getWalletTransactions,
  createWithdrawalRequest,
  getUserWithdrawals,
} from "../controllers/walletController.js";
import { isAuthenticatedUser } from "../middlewares/authMiddlewares.js";

const walletRoutes = express.Router();

walletRoutes.get("/balance", isAuthenticatedUser, getWalletBalance);
walletRoutes.get("/transactions", isAuthenticatedUser, getWalletTransactions);
walletRoutes.post("/withdraw", isAuthenticatedUser, createWithdrawalRequest);
walletRoutes.get("/withdrawals", isAuthenticatedUser, getUserWithdrawals);

export default walletRoutes;
