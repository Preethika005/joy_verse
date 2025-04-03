import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function TherapistLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    alert("Login successful!");
    navigate("/therapist-dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Therapist Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
export default TherapistLogin;