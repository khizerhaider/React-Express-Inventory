import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "ecommerce_db",
    password: process.env.DB_PASSWORD || "#swagtheonemanarmy",
    port: process.env.DB_PORT || 5432,
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL "))
    .catch(err => console.error("PostgreSQL connection error:", err));

export default pool;
