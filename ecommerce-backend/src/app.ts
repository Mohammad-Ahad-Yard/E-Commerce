import express from "express";
import NodeCache from "node-cache";
import morgan from "morgan";
import Stripe from "stripe";
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import  { config } from "dotenv";

config({
    path: "./.env"
});

const app = express();
const PORT = process.env.PORT || 4000;

const mongoURI = process.env.MONGO_URI || "";
connectDB(mongoURI);

const stripeKey = process.env.STRIPE_KEY || "";
export const stripe = new Stripe(stripeKey);

export const nodeCache = new NodeCache(/*{stdTTL: 100}*/);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) =>{
    res.send("API working with /api/v1");
})

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});