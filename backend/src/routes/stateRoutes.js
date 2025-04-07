import express from "express";
import {
  createState,
  getAllStates,
  updateState,
} from "../controllers/stateController.js";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../middlewares/authMiddlewares.js";
import { USER_ROLES } from "../constants/constants.js";

const stateRoutes = express.Router();

stateRoutes.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  createState
);
stateRoutes.get(
  "/",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  getAllStates
);

stateRoutes.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles(USER_ROLES.ADMIN),
  updateState
);

export default stateRoutes;
