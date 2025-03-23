import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import "./config/db.js"; // Ensure PostgreSQL connection is established
import authRoutes from "./routes/authRoutes.js"; // ✅ Correct import



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("E-commerce API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
