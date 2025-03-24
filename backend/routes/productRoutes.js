import express from "express";
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getSellerProducts } from "../controllers/productController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // ✅ Fix

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllProducts); // Get all products
router.get("/:id", getProductById); // Get specific product

// Protected routes (authentication required)
router.post("/", verifyToken, addProduct); // ✅ Require authentication
router.put("/:id", verifyToken, updateProduct); // ✅ Require authentication
router.delete("/:id", verifyToken, deleteProduct); // ✅ Require authentication
router.get("/seller/myproducts", verifyToken, getSellerProducts); // ✅ Require authentication

export default router;
