import express from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/authMiddlewares.js";
import {
  createConstant,
  getConstantByKey,
  updateConstantByKey,
} from "../controllers/constantsController.js";
import CONSTANTS from "../constants/constants.js";

const constantsRoutes = express.Router();

constantsRoutes.get("/:key", isAuthenticatedUser, getConstantByKey);
constantsRoutes.put(
  "/:key",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  updateConstantByKey
);

constantsRoutes.post(
  "/new",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  createConstant
);

export default constantsRoutes;
