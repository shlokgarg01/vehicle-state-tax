import express from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/authMiddlewares.js";
import {
  createConstant,
  getConstantValue,
} from "../controllers/constantsController.js";
import CONSTANTS from "../constants/constants.js";

const constantRoutes = express.Router();

constantRoutes.post(
  "/new",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  createConstant
);
constantRoutes.get("/:key", isAuthenticatedUser, getConstantValue);

export default constantRoutes;
