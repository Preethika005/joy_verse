import React, { useState } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";


const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // default role

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      fullName,
      email,
      username,
      password,
      role,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.text();
      alert(result);
      navigate("/loginpage");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">🎉 Join JoyVerse</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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

        {/* 🎭 Role Selection Dropdown */}
        <select value={role} onChange={(e) => setRole(e.target.value)} required >
        <option value="" disabled hidden>
    Select your role
  </option>
          <option value="child">Child</option>
          <option value="therapist">Therapist</option>
        </select>

        <button type="submit">Create Account 🌟</button>
        {/* <p className="register-link">
          Already have an account? <a href="/loginpage">Login</a>
        </p> */}
      </form>
    </div>
  );
};

export default RegisterPage;
