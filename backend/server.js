import express from "express";

import cors from "cors";
import authRoutes from "./routes/authRoutes.js"; // ✅ Importing routes
import productRoutes from "./routes/productRoutes.js";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET); // ✅ Debugging step

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ PostgreSQL connection error:", err));

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);  // ✅ Ensure this correctly mounts auth routes
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.get("/", (req, res) => {
    res.send("E-commerce API is running...");
});
// ✅ Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`📩 Received ${req.method} request to ${req.url}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
});
