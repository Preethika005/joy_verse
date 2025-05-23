import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./WelcomePage.css";
import gamesBackground from '../assets/gamesback2.jpg';

const WelcomePage = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "Guest");
  }, []);

  const showMessage = (mood) => {
    const messages = {
      happy: "Yay! You're feeling great! Keep smiling! 🌟",
      smile: "Nice! A smile makes everything better 😊",
      neutral: "That's okay! Let’s make your day better 🌈",
      sad: "Oh no! Big hugs coming your way 🤗",
      angry: "It's okay to feel angry. Take deep breaths 🌬️",
    };
    setMessage(messages[mood]);
  };

  const handleStartPlaying = () => {
    navigate("/games"); // Redirect to the games page
  };

  return (
    <div
      style={{
        background: `url(${gamesBackground}) no-repeat center center`,
        backgroundSize: 'cover',
      }}
    >
    <div className="welcome-page">
      <h2 className="welcome-page__text">
        Welcome to JoyVerse, {username}! Let's play and learn together! ✨😊
      </h2>
      <div className="welcome-page__container">
        <h1>How are you feeling today?</h1>
        <div className="welcome-page__faces">
          <div className="welcome-page__face happy" onClick={() => showMessage("happy")}>😊</div>
          <div className="welcome-page__face smile" onClick={() => showMessage("smile")}>🙂</div>
          <div className="welcome-page__face neutral" onClick={() => showMessage("neutral")}>😐</div>
          <div className="welcome-page__face sad" onClick={() => showMessage("sad")}>☹️</div>
          <div className="welcome-page__face angry" onClick={() => showMessage("angry")}>😠</div>
        </div>
        {message && <div className="welcome-page__message-box">{message}</div>}
        
      </div>
      <button className="welcome-page__start-button" onClick={handleStartPlaying}>
          Start Playing
        </button>
    </div>
    </div>
  );
};

export default WelcomePage;
