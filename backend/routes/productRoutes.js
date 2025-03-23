import express from "express";
import { getProducts, addProduct, deleteProduct } from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getProducts);
router.post("/", authMiddleware, addProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
