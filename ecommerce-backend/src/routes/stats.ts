import express from "express";
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from "../controllers/stats.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.get("/stats", adminOnly, getDashboardStats);

router.get("/pie", adminOnly, getPieCharts);

router.get("/bar", adminOnly, getBarCharts);

router.get("/line", adminOnly, getLineCharts);

export default router;