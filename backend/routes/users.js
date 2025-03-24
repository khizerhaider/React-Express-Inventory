import express from "express";
import pool from "../config/db.js"; // PostgreSQL connection
import authMiddleware from "../middleware/authMiddleware.js"; // Import authentication middleware

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await pool.query("SELECT role FROM users WHERE id = $1", [req.user.id]);

        if (!user.rows.length || user.rows[0].role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update user role (Only accessible by admin)
router.put("/users/:id/role", authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    // Only allow 'user' or 'admin' roles
    if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    try {
        const result = await pool.query("UPDATE users SET role = $1 WHERE id = $2 RETURNING *", [role, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User role updated successfully", user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
