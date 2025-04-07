import mongoose from "mongoose";
import { TAX_MODELS } from "../constants/constants.js";

export const getTaxModel = (category) => mongoose.model(TAX_MODELS[category]) || null;