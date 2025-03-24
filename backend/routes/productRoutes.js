import express from "express";
import { 
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllProducts); // Get all products
router.get("/:id", getProductById); // Get specific product

// Protected routes (authentication required)
router.post("/", authMiddleware, addProduct); // Add new product
router.put("/:id", authMiddleware, updateProduct); // Update product
router.delete("/:id", authMiddleware, deleteProduct); // Delete product
router.get("/seller/myproducts", authMiddleware, getSellerProducts); // Get products by authenticated seller

export default router;