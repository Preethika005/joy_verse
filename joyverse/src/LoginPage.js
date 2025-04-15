import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = { username, password };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("username", result.username);
        localStorage.setItem("role", result.role); // Save the role if needed elsewhere
  
        // Redirect based on role
        if (result.role === "child") {
          navigate("/welcomepage");
        } else if (result.role === "therapist") {
          navigate("/therapistdashboard"); // Change this to your actual therapist route
        } else {
          alert("Unknown role. Please contact support.");
        }
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">🌈 JoyVerse Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Let's Go! 🚀</button>
        {/* <p className="login-link">
          New here? <a href="/registerpage">Register Now</a>
        </p> */}
      </form>
    </div>
  );
};

export default LoginPage;
