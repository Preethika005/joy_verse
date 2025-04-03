import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function ChildRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if ( !formData.username || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Registration successful! Please log in.");
    navigate("/child-login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Child Registration</h2>
        <form onSubmit={handleRegister}>
          <label>Username</label>
          <input type="text" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />

          <button type="submit">Register</button>
        </form>
        <p className="switch">Already have an account? <span className="link" onClick={() => navigate("/child-login")}>Login</span></p>
      </div>
    </div>
  );
}
export default ChildRegister;