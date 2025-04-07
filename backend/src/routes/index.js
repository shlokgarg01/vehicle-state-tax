import express from "express";

import authRoutes from "./authRoutes.js";
import taxRoutes from "./taxRoutes.js";
import bannerRoutes from "./bannerRoutes.js";
import adminRoutes from "./adminRoutes.js";
import stateRoutes from "./stateRoutes.js";
import taxModeRoutes from "./taxModeRoutes.js";
import priceRoutes from "./priceRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tax", taxRoutes);
router.use("/banner", bannerRoutes);
router.use("/admin", adminRoutes);
router.use("/state", stateRoutes);
router.use("/taxMode", taxModeRoutes);
router.use("/price", priceRoutes);

export default router;
