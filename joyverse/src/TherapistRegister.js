import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function TherapistRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Registration successful!");
    navigate("/therapist-login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Therapist Registration</h2>
        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <input type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />

          <button type="submit">Register</button>
        </form>
        <p className="switch">Already have an account? <span className="link" onClick={() => navigate("/therapist-login")}>Login</span></p>
      </div>
    </div>
  );
}
export default TherapistRegister;