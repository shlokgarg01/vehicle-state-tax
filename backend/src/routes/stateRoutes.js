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
import CONSTANTS from "../constants/constants.js";

const stateRoutes = express.Router();

stateRoutes.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  createState
);
stateRoutes.get(
  "/",
  isAuthenticatedUser,
  getAllStates
);

stateRoutes.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  updateState
);

export default stateRoutes;
