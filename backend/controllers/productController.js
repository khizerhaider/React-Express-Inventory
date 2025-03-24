import pool from "../config/db.js"; // PostgreSQL connection

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    console.log("🔍 Checking req.user:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found." });
    }

    let query = 'SELECT id, name, price, category, stock, seller_id FROM products';
    const values = [];

    if (req.user.role === 'seller') {
      query += ' WHERE seller_id = $1';
      values.push(req.user.id);
    }

    const { rows } = await pool.query(query, values);
    console.log("✅ Products fetched:", rows);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
      if (req.user.role !== 'admin' && req.user.role !== 'seller') {
        return res.status(403).json({ message: "Access denied" });
      }
  
      const { name, price, category, stock } = req.body;
      const seller_id = req.user.id;  // Attach seller ID from auth
  
      const query = 'INSERT INTO products (name, price, category, stock, seller_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [name, price, category, stock, seller_id];
  
      const { rows } = await pool.query(query, values);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("❌ Error creating product:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, category, stock } = req.body;
  
      let query = 'UPDATE products SET name=$1, price=$2, category=$3, stock=$4 WHERE id=$5 RETURNING *';
      let values = [name, price, category, stock, id];
  
      if (req.user.role !== 'admin') {
        query += ' AND seller_id=$6';
        values.push(req.user.id);
      }
  
      const { rows } = await pool.query(query, values);
  
      if (rows.length === 0) return res.status(403).json({ message: "Unauthorized to update this product" });
  
      res.json(rows[0]);
    } catch (error) {
      console.error("❌ Error updating product:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      let query = 'DELETE FROM products WHERE id=$1';
      let values = [id];
  
      if (req.user.role !== 'admin') {
        query += ' AND seller_id=$2';
        values.push(req.user.id);
      }
  
      const { rowCount } = await pool.query(query, values);
  
      if (rowCount === 0) return res.status(403).json({ message: "Unauthorized to delete this product" });
  
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      res.status(500).json({ message: "Server error" });
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