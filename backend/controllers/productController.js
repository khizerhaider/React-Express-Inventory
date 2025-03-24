import pool from "../config/db.js"; // PostgreSQL connection

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    let query = "SELECT * FROM products WHERE 1=1"; // 1=1 helps avoid syntax issues
    const values = [];
    let paramIndex = 1;

    // Filter by category
    if (req.query.category) {
      query += ` AND category = $${paramIndex}`;
      values.push(req.query.category);
      paramIndex++;
    }

    // Filter by price range
    if (req.query.minPrice && req.query.maxPrice) {
      query += ` AND price BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      values.push(req.query.minPrice, req.query.maxPrice);
      paramIndex += 2;
    }

    // Execute query with parameters
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    const seller_id = req.user.id; // Get seller_id from authenticated user
    
    // Basic validation
    if (!name || !price || !category || !stock) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const result = await pool.query(
      "INSERT INTO products (name, price, category, stock, seller_id, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [name, price, category, stock, seller_id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, stock } = req.body;
    const user = req.user;
    
    // First check if product exists
    const productCheck = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Check if user is admin or the seller of this product
    if (user.role !== "admin" && user.id !== productCheck.rows[0].seller_id) {
      return res.status(403).json({ error: "Not authorized to update this product" });
    }
    
    // Update product
    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, category = $3, stock = $4 WHERE id = $5 RETURNING *",
      [name, price, category, stock, id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    // First check if product exists
    const productCheck = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Check if user is admin or the seller of this product
    if (user.role !== "admin" && user.id !== productCheck.rows[0].seller_id) {
      return res.status(403).json({ error: "Not authorized to delete this product" });
    }
    
    // Delete product
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get products by seller (only their products)
export const getSellerProducts = async (req, res) => {
  try {
    const seller_id = req.user.id;
    const result = await pool.query("SELECT * FROM products WHERE seller_id = $1", [seller_id]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};