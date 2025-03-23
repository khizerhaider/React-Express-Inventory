import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"; // ✅ Importing routes
import productRoutes from "./routes/productRoutes.js";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ecommerce_db",
    password: "#swagtheonemanarmy",
    port: 5432
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ PostgreSQL connection error:", err));

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);  // ✅ Ensure this correctly mounts auth routes
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.get("/", (req, res) => {
    res.send("E-commerce API is running...");
});
