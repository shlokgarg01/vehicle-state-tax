import express from "express";

import authRoutes from "./authRoutes.js";
import taxRoutes from "./taxRoutes.js";
import bannerRoutes from "./bannerRoutes.js";
import adminRoutes from "./adminRoutes.js";
import stateRoutes from "./stateRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tax", taxRoutes);
router.use("/banner", bannerRoutes);
router.use("/admin", adminRoutes);
router.use("/state", stateRoutes);

export default router;
