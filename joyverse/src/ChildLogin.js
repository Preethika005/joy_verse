import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function ChildLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "child_user" && password === "password123") {
      alert("Login successful!");
      navigate("/games");
    } else {
      alert("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Child Login</h2>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
        <p className="switch">
          Not registered? <span className="link" onClick={() => navigate("/child-register")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default ChildLogin;
