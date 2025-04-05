import express from "express";
import {
  createState,
  getAllStates,
  deleteState,
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
  authorizeRoles([USER_ROLES.ADMIN]),
  createState
);
stateRoutes.get("/", isAuthenticatedUser, getAllStates);
stateRoutes.delete(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles([USER_ROLES.ADMIN]),
  deleteState
);

export default stateRoutes;
