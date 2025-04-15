import express from "express";
import {
  createTaxMode,
  getAllTaxModes,
  updateTaxMode,
  deleteTaxMode,
} from "../controllers/taxModeController.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";
import CONSTANTS from "../constants/constants.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles(CONSTANTS.USER_ROLES.ADMIN),
  createTaxMode
);

router.get(
  "/",
  isAuthenticatedUser,
  getAllTaxModes
);

router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles(CONSTANTS.USER_ROLES.ADMIN),
  updateTaxMode
);

router.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles(CONSTANTS.USER_ROLES.ADMIN),
  deleteTaxMode
);

export default router;
