import express from "express";
import {
  createPrice,
  getAllPrices,
  updatePrice,
} from "../controllers/priceController.js";
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
  createPrice
);

router.get(
  "/",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  getAllPrices
);

router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  updatePrice
);

export default router;
