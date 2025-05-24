import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("username", username);

      const { role, therapistId } = response.data;

      if (role === "therapist") {
        localStorage.setItem("therapistId", therapistId);
        navigate("/therapistdashboard");
      } else if (role === "child") {
        navigate("/welcomepage");
      } else {
        setError("Unknown user role");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="loginscreen">
      <section className="joyverse-wrapper">
        <h1 className="joyverse">JoyVerse</h1>
      </section>
      <form className="usernamecontainer-parent" onSubmit={handleLogin}>
        <input
          className="usernamecontainer"
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="passwordcontainer"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          <div className="login">login</div>
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginPage;
