import React from "react";
import { useNavigate } from "react-router-dom";
import "./Games.css";

function Games() {
  const navigate = useNavigate();

  return (
    <div className="games-page-container">
      <h1 className="games-page-title">🎮 Choose Your Game 🎨</h1>
      <p className="games-page-subtitle">Select a game and start your adventure!</p>
      
      <div className="games-page-list">
        <div className="games-page-card games-page-word-game" onClick={() => navigate("/wordpuzzleadventure")}>
          <h2>Word Quest</h2>
          <p>Challenge your vocabulary and solve exciting puzzles!</p>
        </div>

        <div className="games-page-card games-page-math-game" onClick={() => navigate("/mathgame")}>
          <h2>Math Fun</h2>
          <p>Sharpen your math skills with fun and interactive problems!</p>
        </div>

        <div className="games-page-card games-page-quiz-game" onClick={() => navigate("/quiz")}>
          <h2>Fun Quiz</h2>
          <p>Every question is an opportunity to learn something new!</p>
        </div>
        <div className="games-page-card games-page-syllable-game" onClick={() => navigate("/syllabletapgame")}>
          <h2>Fun with Syllables</h2>
          <p>Keep tapping, keep learning, keep winning!</p>
        </div>
        <div className="games-page-card games-page-shapememory-game" onClick={() => navigate("/shapememorygame")}>
          <h2>Shape Memory Game</h2>
          <p>Match the shapes, train your brain, and boost your memory power!</p>
        </div>  
        <div className="games-page-card games-page-letterbridge-game" onClick={() => navigate("/letterbridge")}>
          <h2>Letter Bridging Game</h2>
          <p>Bridge the letters, build the words, and boost your brain!</p>
        </div>
      </div>
    </div>
  );
}

export default Games;
