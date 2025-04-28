import { useEffect, useState } from "react";
import "./ShapeMemoryGame.css";

const shapes = ["⬤", "▲", "■", "◆", "★"];
const totalTiles = 25;

const levelSettings = {
  easy: { revealTime: 5000, gameTime: 45 },
  medium: { revealTime: 5000, gameTime: 30 },
  hard: { revealTime: 2500, gameTime: 30 },
};

function ShapeMemoryGame() {
  const [tileValues, setTileValues] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [correctTiles, setCorrectTiles] = useState([]);
  const [currentTarget, setCurrentTarget] = useState("");         
  const [score, setScore] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState("easy");

  useEffect(() => {
    setupGame();
  }, [level]);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isGameOver) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  useEffect(() => {
      // Enable scrolling when this page is open
      document.body.style.overflow = "auto";
    
      // When leaving this page, disable scrolling again
      return () => {
        document.body.style.overflow = "hidden";
      };
    }, []);

  const setupGame = () => {
    const { revealTime, gameTime } = levelSettings[level];

    const pool = [];
    shapes.forEach((shape) => {
      for (let i = 0; i < 5; i++) pool.push(shape);
    });

    const shuffled = shuffleArray(pool);
    setTileValues(shuffled);
    setRevealed(new Array(totalTiles).fill(true));
    setCorrectTiles(new Array(totalTiles).fill(false));

    setTimeout(() => {
      setRevealed(new Array(totalTiles).fill(false));
    }, revealTime);

    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentTarget(shape);
    setTotalTarget(pool.filter((v) => v === shape).length);
    setScore(0);
    setTimeLeft(gameTime);
    setIsGameOver(false);
  };

  const handleClick = (index) => {
    if (revealed[index] || correctTiles[index] || isGameOver) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (tileValues[index] === currentTarget) {
      const newCorrect = [...correctTiles];
      newCorrect[index] = true;
      setCorrectTiles(newCorrect);
      setScore(score + 1);

      if (score + 1 === totalTarget) {
        setIsGameOver(true);
      }
    } else {
      setTimeout(() => {
        newRevealed[index] = false;
        setRevealed([...newRevealed]);
      }, 2000);
    }
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  return (
    <div className="smg-container">
      <h1 className="smg-title">Shape Memory Game</h1>

      <div className="smg-controls">
        <label htmlFor="level-select">Choose Level: </label>
        <select
          id="level-select"
          value={level}
          onChange={handleLevelChange}
          className="smg-dropdown"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <p className="smg-prompt">Find all tiles with: {currentTarget}</p>
      <p className="smg-timer">Time Left: {timeLeft}s</p>

      <div className="smg-grid">
        {tileValues.map((shape, idx) => {
          const isRevealed = revealed[idx];
          const isCorrect = correctTiles[idx];
          const isWrong =
            isRevealed &&
            shape !== currentTarget &&
            !isCorrect &&
            !revealed.every((val) => val === true);

          return (
            <div
              key={idx}
              className={`smg-tile ${
                isCorrect
                  ? "smg-correct"
                  : isWrong
                  ? "smg-wrong"
                  : isRevealed
                  ? "smg-revealed"
                  : "smg-hidden"
              }`}
              onClick={() => handleClick(idx)}
            >
              {isRevealed || isCorrect ? shape : ""}
            </div>
          );
        })}
      </div>

      <p className="smg-score">Score: {score} / {totalTarget}</p>

      {isGameOver && (
        <div className="smg-end-screen">
          <p className="smg-result-text">
            {score === totalTarget ? "🎉 You Win!" : "⏰ Time's Up!"}
          </p>
          <button onClick={setupGame} className="smg-reset-button">Reset Game</button>
        </div>
      )}
    </div>
  );
}

export default ShapeMemoryGame;
