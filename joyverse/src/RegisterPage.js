import React from "react";
import "./RegisterPage.css";

const RegisterPage = () => {
  return (
    <div className="register-container">
      <h1 className="register-title">🎉 Join JoyVerse</h1>
      <form className="register-form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Create Account 🌟</button>
        {/* <p className="register-link">
          Already have an account? <a href="/loginpage">Login</a>
        </p> */}
      </form>
    </div>
  );
};

export default RegisterPage;
