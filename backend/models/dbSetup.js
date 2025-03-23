import pool from "../config/db.js";

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'seller'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        stock INT NOT NULL,
        seller_id INT REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("✅ Tables created successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    process.exit(1);
  }
};

// Run the function
createTables();
