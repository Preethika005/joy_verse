import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomeScreen.css";

const WelcomeScreen = () => {
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
      angry: "It's okay to feel angry. Take deep breaths 🌬",
    };
    setMessage(messages[mood]);
  };

  const handleStartPlaying = () => {
    navigate("/games");
  };

  return (
    <div className="welcomescreen">
      <section className="header">
        <div className="welcometext">
          <h3 className="welcome-to-joyverse-container">
            <p className="welcome-to-joyverse">{`Welcome to JoyVerse, ${username}!`}</p>
          </h3>
          <div className="lets-play-and">Let's play and learn together :)</div>
        </div>
      </section>

      <section className="emojiselectorcontainer">
        <div className="emojiselector">
          <h2 className="how-are-you">How are you feeling today?</h2>
          <div className="emojibuttons">
            <div className="happybutton" onClick={() => showMessage("happy")}>
              <img className="happyicon" alt="Happy" src="/happyicon@2x.png" />
            </div>
            <div className="smilebutton" onClick={() => showMessage("smile")}>
              <img className="happyicon" alt="Smile" src="/smileicon@2x.png" />
            </div>
            <div className="neutralbutton" onClick={() => showMessage("neutral")}>
              <img className="happyicon" alt="Neutral" src="/neutralicon@2x.png" />
            </div>
            <div className="sadbutton" onClick={() => showMessage("sad")}>
              <img className="happyicon" alt="Sad" src="/sadicon@2x.png" />
            </div>
            <div className="angrybutton" onClick={() => showMessage("angry")}>
              <img className="happyicon" alt="Angry" src="/angryicon@2x.png" />
            </div>
          </div>
        </div>
      </section>

      {message && <div className="welcome-message-box">{message}</div>}

      <button className="startplayingbutton" onClick={handleStartPlaying}>
        <div className="startplayingtext">
          <div className="start-playing">Start Playing</div>
        </div>
      </button>
    </div>
  );
};

export default WelcomeScreen;
