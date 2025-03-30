import express from "express";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// Create New Products - /api/v1/product/new
router.post("/new", adminOnly, singleUpload, newProduct);

// Get latest 10 products - /api/v1/product/latest
router.get("/latest", getLatestProducts);

// Get all unique categories - /api/v1/product/categories
router.get("/categories", getAllCategories);

// Get all Products - /api/v1/product/admin-products
router.get("/admin-products", getAdminProducts);

// Get all products with filters
router.get("/all", getAllProducts);

router.route("/:id")
.get(getSingleProduct)
.put(adminOnly, singleUpload, updateProduct)
.delete(adminOnly, deleteProduct);

export default router;