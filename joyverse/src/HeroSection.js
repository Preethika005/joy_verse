import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="hero-container">
      {/* Heading */}
      <h1 className="hero-title">
        Welcome to JoyVerse🎉
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle">
        Educational games designed to make learning fun and engaging for every child!
      </p>

      {/* Buttons */}
      <div className="button-container">
        <button className="play-button" onClick={() => navigate("/loginpage")}>
          LOGIN
        </button>
        <button className="info-button" onClick={() => navigate("/registerpage")}>
          REGISTER
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
