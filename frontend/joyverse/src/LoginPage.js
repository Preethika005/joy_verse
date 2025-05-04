import React, { useState } from "react";
import axios from 'axios';
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
 
  const handleLogin = async (e) => {
    e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username,
      password,
    });

    const { role } = response.data;

    if (role === 'therapist') {
      navigate('/therapistdashboard');
    } else if (role === 'child') {
      navigate('/games');
    } else {
      setError('Unknown user role');
    }

  } catch (err) {
    setError('Invalid username or password');
  }
  };
  return (
    <div className="login-container">
      <h1 className="login-title">JoyVerse Login</h1>
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
        <button type="submit">Let's Go! </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginPage;





