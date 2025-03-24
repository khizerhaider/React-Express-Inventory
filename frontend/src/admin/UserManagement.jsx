import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000"; // Backend API URL

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch users from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Update user role (promote/demote)
  const handleUpdateRole = async (id, newRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();
      setMessage(data.message);
      setUsers(users.map((user) => (user._id === id ? { ...user, role: newRole } : user)));
    } catch (error) {
      setMessage("Error updating user role");
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      setMessage("Error deleting user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>
      <p>{message}</p>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role === "admin" ? (
                  <button onClick={() => handleUpdateRole(user._id, "user")}>Demote to User</button>
                ) : (
                  <button onClick={() => handleUpdateRole(user._id, "admin")}>Promote to Admin</button>
                )}
                <button onClick={() => handleDeleteUser(user._id)} style={{ marginLeft: "10px" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
