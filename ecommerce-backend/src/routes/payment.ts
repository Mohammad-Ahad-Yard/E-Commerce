import express from "express";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", createPaymentIntent);

router.get("/discount", applyDiscount);

router.post("/coupon/new", adminOnly, newCoupon);

router.get("/coupon/all", adminOnly, allCoupons);

router.delete("/coupon/:id", adminOnly, deleteCoupon);

export default router;
