import express from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/authMiddlewares.js";
import CONSTANTS from "../constants/constants.js";
import { createCities, getCitiesOfState } from "../controllers/citiesController.js";

const citiesRoutes = express.Router();

citiesRoutes.post(
  "/new",
  isAuthenticatedUser,
  authorizeRoles([CONSTANTS.USER_ROLES.ADMIN]),
  createCities
);
citiesRoutes.get("/:state", isAuthenticatedUser, getCitiesOfState);

export default citiesRoutes;
