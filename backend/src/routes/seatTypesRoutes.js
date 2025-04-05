import express from "express";
import {
  createSeatType,
  getSeatTypes,
  deleteSeatType,
} from "../controllers/seatController.js";

const seatTypeRoutes = express.Router();

seatTypeRoutes.post("/", createSeatType); // add seat type
seatTypeRoutes.get("/", getSeatTypes); // get all seat types
seatTypeRoutes.delete("/:id", deleteSeatType); // delete seat type

export default seatTypeRoutes;
