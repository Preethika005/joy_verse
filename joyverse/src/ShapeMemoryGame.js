import { useEffect, useState, useRef } from "react";
import "./ShapeMemoryGame.css";

const shapes = ["⬤", "▲", "■", "◆", "★"];
const totalTiles = 25;

const levelSettings = {
  easy: { revealTime: 5000, gameTime: 45, allowedClicks: 15 },
  medium: { revealTime: 5000, gameTime: 30, allowedClicks: 10 },
  hard: { revealTime: 2500, gameTime: 30, allowedClicks: 7 },
};

const API_URL = "https://api-inference.huggingface.co/models/trpakov/vit-face-expression";
const API_TOKEN = "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";

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
  const [isStarting, setIsStarting] = useState(true);
  const [clicksLeft, setClicksLeft] = useState(0);
  const [theme, setTheme] = useState("neutral");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoStream = useRef(null);

  useEffect(() => {
    setupGame();
    startWebcam();
    const moodInterval = setInterval(captureMood, 10000); // Every 10 seconds

    return () => {
      clearInterval(moodInterval);
      stopWebcam();
    };
  }, [level]);
  useEffect(() => {
    console.log("Detected theme:", theme); // Check if theme updates
  }, [theme]);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isGameOver && !isStarting) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver, isStarting]);
useEffect(() => {
    // Enable scrolling when this page is open
    document.body.style.overflow = "auto";
  
    // When leaving this page, disable scrolling again
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);
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
    if (revealed[index] || correctTiles[index] || isGameOver || isStarting) return;

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
      }, 1000);
    }
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  const startWebcam = async () => {
    try {
      videoStream.current = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream.current;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopWebcam = () => {
    if (videoStream.current) {
      videoStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  const captureMood = async () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let emotions = [];

    const captureOnce = async () => {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target.result.split(",")[1];
        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: { image: base64Image } }),
          });
          const data = await response.json();
          if (data && Array.isArray(data) && data.length > 0) {
            emotions.push(data[0].label);
          }
        } catch (err) {
          console.error("Error detecting mood:", err);
        }
      };
      reader.readAsDataURL(blob);
    };

    // Capture multiple snapshots for 2 seconds
    const interval = setInterval(captureOnce, 500);
    setTimeout(() => {
      clearInterval(interval);
      if (emotions.length > 0) {
        const mostCommon = emotions.sort((a,b) =>
          emotions.filter(v => v===a).length - emotions.filter(v => v===b).length
        ).pop();
        setTheme(mostCommon.toLowerCase()); // Set the dominant emotion as theme
      }
    }, 2000);
  };

  return (
    <div className={`smg-container ${theme}`}>
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
        {isStarting ? "Memorize the tiles..." : `Find all tiles with: ${currentTarget}`}
      </p>

      <p className="smg-timer">Time Left: {timeLeft}s</p>
      <p className="smg-clicks-left">Chances Left: {clicksLeft}</p>

      <div className="smg-grid">
        {tileValues.map((shape, idx) => {
          const isRevealed = revealed[idx];
          const isCorrect = correctTiles[idx];

          return (
            <div
              key={idx}
              className={`smg-tile ${
                isCorrect
                  ? "smg-correct"
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

      {/* Hidden video and canvas elements */}
      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default ShapeMemoryGame;
