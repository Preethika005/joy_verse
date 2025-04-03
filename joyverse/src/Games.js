import React from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";

function Games() {
  const navigate = useNavigate();

  return (
    <div className="games-container">
      <h1 className="title">🎮 Choose Your Game 🎨</h1>
      <p className="subtitle">Select a game and start your adventure!</p>
      
      <div className="games-list">
        <div className="game-card word-game" onClick={() => navigate("/wordpuzzleadventure")}>
          <h2>📖 Word Quest</h2>
          <p>Challenge your vocabulary and solve exciting puzzles!</p>
        </div>

        <div className="game-card math-game" onClick={() => navigate("/mathgame")}>
          <h2>➕ Math Fun</h2>
          <p>Sharpen your math skills with fun and interactive problems!</p>
        </div>

        <div className="game-card quiz-game" onClick={() => navigate("/quiz")}>
          <h2>❓ Fun Quiz</h2>
          <p>Every question is an opportunity to learn something new!</p>
        </div>
      </div>
    </div>
  );
}

export default Games;
