import express from "express";
import {
  createTaxMode,
  getAllTaxModes,
  updateTaxMode,
} from "../controllers/taxModeController.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";
import { USER_ROLES } from "../constants/constants.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  createTaxMode
);

router.get(
  "/",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  getAllTaxModes
);

router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  updateTaxMode
);

export default router;
