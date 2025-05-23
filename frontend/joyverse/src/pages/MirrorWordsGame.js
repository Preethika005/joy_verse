import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./MirrorWordsGame.css";

const MirrorWordsGame = () => {

  const [level, setLevel] = useState("Easy");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/mirrorquestions/${level}`);
      const data = await res.json();
      setQuestions(data);
      setCurrent(0);
      setSelected(null);
      setFeedback("");
      setScore(0);
      setShowResult(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  fetchQuestions();
}, [level]);

const filteredQuestions = questions;

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSelect = (option) => {
    setSelected(option);
    const isCorrect = option === filteredQuestions[current].correct;

    if (isCorrect) {
      setFeedback("Correct! 🎉");
      setScore((prev) => prev + 10);
    } else {
      setFeedback("Incorrect ❌");
    }
  };

  useEffect(() => {
    if (selected !== null) {
      const timer = setTimeout(() => {
        if (current + 1 < filteredQuestions.length) {
          setCurrent((prev) => prev + 1);
          setSelected(null);
          setFeedback("");
        } else {
          setShowResult(true);
          fireConfetti();
        }
      }, 1000); // Delay in ms before moving to next question or result

      return () => clearTimeout(timer);
    }
  }, [selected]);

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    setCurrent(0);
    setSelected(null);
    setFeedback("");
    setScore(0);
    setShowResult(false);
  };

  const resetGame = () => {
    setCurrent(0);
    setSelected(null);
    setFeedback("");
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="mirror-game-container">
      <div className="mirror-game-title">Mirror Words</div>
      
      <div className="mirror-level-selector">
        <label htmlFor="level">Choose Level: </label>
        <select id="level" value={level} onChange={handleLevelChange}>
          <option value="Easy">🟢 Easy</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Hard">🔴 Hard</option>
        </select>
      </div>

      {!showResult ? (
        <>
          <div className="mirror-score">Score: {score}</div>
          <div className="mirror-game-board">
            <div className="mirror-game-question">
              {filteredQuestions[current]?.question}
            </div>
            <div className="mirror-options">
              {filteredQuestions[current]?.options.map((option, index) => (
                <button
                  key={index}
                  className={`mirror-option ${
                    selected === option ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                  disabled={!!selected}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          {feedback && (
              <div
                className={`mirror-feedback ${
                  feedback === "Correct! 🎉" ? "correct" : "incorrect"
                }`}
              >
                {feedback}
              </div>
            )}
          
        </>
      ) : (
        <div className="mirror-final-score">
          <h2>Level Completed!</h2>
          <br></br>
          <p>Your Final Score: {score}</p>
          <br></br>
          <button className="mirror-reset-button" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MirrorWordsGame;
