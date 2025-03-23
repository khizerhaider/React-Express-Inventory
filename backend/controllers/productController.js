import pool from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

export const addProduct = async (req, res) => {
  const { name, price, category, stock, seller_id } = req.body;

  try {
    const query = "INSERT INTO products (name, price, category, stock, seller_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [name, price, category, stock, seller_id];

    const result = await pool.query(query, values);
    res.json({ message: "Product added successfully", product: result.rows[0] });
  } catch (error) {
    res.status(400).json({ message: "Failed to add product", error });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM products WHERE id = $1";
    await pool.query(query, [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete product", error });
  }
};
