import express from "express";
import {
  createPrice,
  deletePrice,
  getAllPrices,
  updatePrice,
} from "../controllers/priceController.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";
import  CONSTANTS from "../constants/constants.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles(CONSTANTS.USER_ROLES.ADMIN),
  createPrice
);

router.get(
  "/",
  isAuthenticatedUser,
  getAllPrices
);

router.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles(CONSTANTS.USER_ROLES.ADMIN),
  updatePrice
);
router.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles(CONSTANTS.USER_ROLES.ADMIN),
  deletePrice
);

export default router;
