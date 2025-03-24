import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; // ✅ Ensure correct DB import

export const registerUser = async (req, res) => {
    try {
        console.log("📩 Received registration request:", req.body);

        const { username, password, role = 'seller' } = req.body; // Default role = 'seller'
        
        if (!username || !password) {
            return res.status(400).json({ message: "❌ Username and password are required" });
        }

        // Check if user already exists
        const checkUserQuery = "SELECT * FROM users WHERE username = $1";
        const existingUser = await pool.query(checkUserQuery, [username]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "❌ User already exists" });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert new user with role
        const insertUserQuery = "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role";
        const { rows } = await pool.query(insertUserQuery, [username, hashedPassword, role]);

        console.log("✅ User registered:", rows[0]);

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: rows[0].id, username: rows[0].username, role: rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ✅ Respond with user data (without password)
        res.status(201).json({
            message: "🎉 User registered successfully",
            user: rows[0],
            token
        });

    } catch (error) {
        console.error("❌ Registration failed:", error);
        res.status(500).json({ message: "❌ Registration failed", error: error.message });
    }
};




export const loginUser = async (req, res) => {
  try {
    console.log("📩 Received LOGIN request with body:", req.body);

    const { username, password } = req.body;

    // Check if user exists
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(query, [username]);

    if (rows.length === 0) {
      console.log("❌ User not found:", username);
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = rows[0];

    // ✅ Compare hashed password with entered password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Incorrect password for user:", username);
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("✅ Token generated:", token);  // ✅ Log the token

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, role: user.role },
      token  // ✅ Include token in response
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
