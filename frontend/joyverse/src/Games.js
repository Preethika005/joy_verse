import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./Games.css";
import shapememoryimg from './assets/shapememorygame.png';
import mathfunimg from './assets/mathfun.png';
import funquizimg from './assets/funquiz.png';
import wordquestimg from './assets/wordquest.png';
import syllabletapgameimg from './assets/syllabletapgame.png';
import letterbridgeimg from './assets/letterbridge.png';
import gamesBackground from './assets/gamesback2.jpg';
function Games() {
   useEffect(() => {
      document.body.style.overflow = "auto";
      return () => {
        document.body.style.overflow = "hidden";
      };
    }, []);
  const navigate = useNavigate();
  return (
    <div
  style={{
    background: `url(${gamesBackground}) no-repeat center center`,
    backgroundSize: 'cover',
  }}
>
    <div className="games-page-container">
     
  
      <h1 className="games-page-title">🎮 Choose Your Game 🎨</h1>
      <p className="games-page-subtitle">Select a game and start your adventure!</p>
      
      <div className="games-page-list">
        <div className="games-page-card games-page-word-game" onClick={() => navigate("/wordpuzzleadventure")}>
          <img src={wordquestimg} alt="Word Quest" className="game-icon" />
          <h2>Word Quest</h2>
          
        </div>

        <div className="games-page-card games-page-math-game" onClick={() => navigate("/mathgame")}>
          <img src={mathfunimg} alt="Word Quest" className="game-icon" />
          <h2>Math Fun</h2>
        </div>

        <div className="games-page-card games-page-quiz-game" onClick={() => navigate("/quiz")}>
          <img src={funquizimg} alt="Word Quest" className="game-icon" />
          <h2>Fun Quiz</h2>
        </div>
        <div className="games-page-card games-page-syllable-game" onClick={() => navigate("/syllabletapgame")}>
          <img src={syllabletapgameimg} alt="Word Quest" className="game-icon" />
          <h2>Fun with Syllables</h2>
        </div>
        <div className="games-page-card games-page-shapememory-game" onClick={() => navigate("/shapememorygame")}>
          <img src={shapememoryimg} alt="Word Quest" className="game-icon" />
          <h2>Shape Memory Game</h2>
        </div>  
        <div className="games-page-card games-page-letterbridge-game" onClick={() => navigate("/letterbridge")}>
          <img src={letterbridgeimg} alt="Word Quest" className="game-icon" />
          <h2>Letter Bridging Game</h2>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Games;
