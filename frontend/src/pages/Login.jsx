import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        alert("Login successful!");
        // Redirect user after successful login (e.g., to dashboard)
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={styles.input} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>{message}</p>
      <button onClick={() => navigate("/register")} style={styles.switchButton}>Go to Register</button>
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "auto", textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" },
  input: { display: "block", width: "100%", marginBottom: "10px", padding: "8px" },
  button: { width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  switchButton: { marginTop: "10px", padding: "5px 10px", border: "none", backgroundColor: "#6c757d", color: "white", borderRadius: "5px", cursor: "pointer" }
};

export default Login;
