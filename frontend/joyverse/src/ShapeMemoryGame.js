import { useEffect, useState, useRef } from "react";
import "./ShapeMemoryGame.css";

const emotionThemes = {
  Happy: "#ffeaa7",
  Sad: "#dfe6e9",
  Angry: "#fab1a0",
  Disgust: "#81ecec",
  Fear: "#a29bfe",
  Neutral: "#ffffff",
};

const shapes = ["⬤", "▲", "■", "◆", "★"];
const totalTiles = 25;

const levelSettings = {
  easy: { revealTime: 5000, gameTime: 45, allowedClicks: 15 },
  medium: { revealTime: 5000, gameTime: 30, allowedClicks: 10 },
  hard: { revealTime: 2500, gameTime: 30, allowedClicks: 7 },
};

function ShapeMemoryGame() {
  const [tileValues, setTileValues] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [correctTiles, setCorrectTiles] = useState([]);
  const [wrongTiles, setWrongTiles] = useState([]);
  const [currentTarget, setCurrentTarget] = useState("");
  const [score, setScore] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState("easy");
  const [isStarting, setIsStarting] = useState(true);
  const [clicksLeft, setClicksLeft] = useState(0);
  const [expression, setExpression] = useState("Happy"); // Start with Happy for testing

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setupGame();
  }, [level]);
  useEffect(() => {
      // Enable scrolling when this page is open
      document.body.style.overflow = "auto";
    
      // When leaving this page, disable scrolling again
      return () => {
        document.body.style.overflow = "hidden";
      };
    }, []);
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isGameOver && !isStarting) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver, isStarting]);

  useEffect(() => {
    // Set the background color of the body based on the detected emotion
    const bgColor = emotionThemes[expression] ; // Default to dark if no valid emotion
    document.body.style.backgroundColor = bgColor;
  }, [expression]); // Will update whenever 'expression' changes

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });

    const interval = setInterval(() => {
      captureAndSend();
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const captureAndSend = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.expression) {
          setExpression(data.expression); // Update the expression and trigger the background change
        }
      } catch (err) {
        console.error("Failed to detect expression:", err);
      }
    }, "image/jpeg");
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const setupGame = () => {
    const { revealTime, gameTime, allowedClicks } = levelSettings[level];
    setIsStarting(true);

    const pool = [];
    shapes.forEach((shape) => {
      for (let i = 0; i < 5; i++) pool.push(shape);
    });

    const shuffled = shuffleArray(pool);
    setTileValues(shuffled);
    setRevealed(new Array(totalTiles).fill(true));
    setCorrectTiles(new Array(totalTiles).fill(false));
    setWrongTiles(new Array(totalTiles).fill(false));
    setScore(0);
    setIsGameOver(false);
    setTimeLeft(0);
    setClicksLeft(allowedClicks);

    setTimeout(() => {
      setRevealed(new Array(totalTiles).fill(false));
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      setCurrentTarget(shape);
      setTotalTarget(pool.filter((v) => v === shape).length);
      setTimeLeft(gameTime);
      setIsStarting(false);
    }, revealTime);
  };

  const handleClick = (index) => {
    if (revealed[index] || correctTiles[index] || isGameOver || isStarting)
      return;

    const updatedRevealed = [...revealed];
    updatedRevealed[index] = true;
    setRevealed(updatedRevealed);

    if (tileValues[index] === currentTarget) {
      const updatedCorrectTiles = [...correctTiles];
      updatedCorrectTiles[index] = true;
      setCorrectTiles(updatedCorrectTiles);
      setScore((prev) => prev + 1);

      if (score + 1 === totalTarget) {
        setIsGameOver(true);
      }
    } else {
      const updatedWrongTiles = [...wrongTiles];
      updatedWrongTiles[index] = true;
      setWrongTiles(updatedWrongTiles);

      setClicksLeft((prev) => {
        const newClicks = prev - 1;
        if (newClicks <= 0) {
          setTimeout(() => {
            setIsGameOver(true);
          }, 1000);
        }
        return newClicks;
      });

      setTimeout(() => {
        setRevealed((prev) => {
          const temp = [...prev];
          temp[index] = false;
          return temp;
        });
        setWrongTiles((prev) => {
          const temp = [...prev];
          temp[index] = false;
          return temp;
        });
      }, 1000);
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

      <p className="smg-prompt">
        {isStarting
          ? "Memorize the tiles..."
          : `Find all tiles with: ${currentTarget}`}
      </p>

      <p className="smg-timer">Time Left: {timeLeft}s</p>
      <p className="smg-clicks-left">Chances Left: {clicksLeft}</p>
      <p className="smg-expression">Current Mood: {expression}</p>

      <div className="smg-grid">
        {tileValues.map((shape, idx) => {
          const isRevealed = revealed[idx];
          const isCorrect = correctTiles[idx];
          const isWrong = wrongTiles[idx];

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
              {isRevealed || isCorrect || isWrong ? shape : ""}
            </div>
          );
        })}
      </div>

      <p className="smg-score">
        Score: {score} / {totalTarget}
      </p>

      {isGameOver && (
        <div className="smg-end-screen">
          <p className="smg-result-text">
            {score === totalTarget
              ? "🎉 You Win!"
              : clicksLeft <= 0
              ? "❌ No more chances!"
              : "⏰ Time's Up!"}
          </p>
          <button onClick={setupGame} className="smg-reset-button">
            Reset Game
          </button>
        </div>
      )}

      {/* Hidden video and canvas for webcam */}
      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default ShapeMemoryGame;