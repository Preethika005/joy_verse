import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Games.css";
import shapememoryimg from '../assets/shapememorygame.png';
import mathfunimg from '../assets/mathfun.png';
import funquizimg from '../assets/funquiz.png';
import wordquestimg from '../assets/wordquest.png';
import syllabletapgameimg from '../assets/syllabletapgame.png';
import letterbridgeimg from '../assets/letterbridge.png';
import gamesBackground from '../assets/gamesback2.jpg';
import mirrorwordgameimg from '../assets/mirrorwordsgame.png';
function Games() {
   useEffect(() => {
      document.body.style.overflow = "auto";
      return () => {
        document.body.style.overflow = "hidden";
      };
    }, []);
  const navigate = useNavigate();
  const [emotion, setEmotion] = useState("neutral");
  useEffect(() => {
    const selected = localStorage.getItem("selectedEmotion") || "neutral";
    setEmotion(selected);
  }, []);
  const backgroundMap = {
    happy: "url('https://i.pinimg.com/736x/21/01/cc/2101cc1cb0e93c8d9f04145946118c7f.jpg')",
    smile: "url('https://i.pinimg.com/736x/8d/40/84/8d4084f141bce06f25e99b44956790d3.jpg')",
    neutral: "url('https://i.pinimg.com/736x/65/6b/e4/656be4ba10df99f7849a609f4bac3f36.jpg')",
    sad: "url('https://i.pinimg.com/736x/7a/7c/2a/7a7c2a56165f9015ad57e4cebb16c022.jpg')",
    angry: "url('https://i.pinimg.com/736x/4b/06/6a/4b066a49cbe4ff6061c742fa23858687.jpg')",
  };
  const backgroundStyle = {
    backgroundImage: backgroundMap[emotion],
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    width: "100%",
  };
  return (
    <div
  style={backgroundStyle}
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
        <div className="games-page-card games-page-mirrorword-game" onClick={() => navigate("/mirrorword")}>
          <img src={mirrorwordgameimg} alt="Word Quest" className="game-icon" />
          <h2>Mirror Word Game</h2>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Games;
