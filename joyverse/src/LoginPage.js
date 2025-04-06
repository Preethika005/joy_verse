import React from "react";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-container">
      <h1 className="login-title">🌈 JoyVerse Login</h1>
      <form className="login-form">
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Let's Go! 🚀</button>
        {/* <p className="login-link">
          New here? <a href="/registerpage">Register Now</a>
        </p> */}
      </form>
    </div>
  );
};

export default LoginPage;
