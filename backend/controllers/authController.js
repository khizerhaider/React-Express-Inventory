import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const registerUser = async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check if user exists
        const checkUserQuery = "SELECT * FROM users WHERE username = $1";
        const existingUser = await pool.query(checkUserQuery, [username]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const insertUserQuery = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";
        const newUser = await pool.query(insertUserQuery, [username, hashedPassword]);

        console.log("User registered:", newUser.rows[0]);
        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check if user exists
        const checkUserQuery = "SELECT * FROM users WHERE username = $1";
        const userResult = await pool.query(checkUserQuery, [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const user = userResult.rows[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username } });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }

};
