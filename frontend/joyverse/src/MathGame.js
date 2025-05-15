import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./MathGame.css";
import mathgameimg from './assets/maths.jpg';

const MathGame = () => {
  const [num1, setNum1] = useState(2);
  const [num2, setNum2] = useState(10);
  const [operation, setOperation] = useState("+");
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Select the correct answer");
  const [questionCount, setQuestionCount] = useState(0);
  const totalQuestions = 10;
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [isAnswering, setIsAnswering] = useState(true);

  useEffect(() => {
    if (gameStarted) generateQuestion();
  }, [gameStarted]);
useEffect(() => {
  if (gameOver && gameStarted) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}, [gameOver, gameStarted]);
  const generateQuestion = () => {
    if (questionCount >= totalQuestions) {
      setGameOver(true);
      return;
    }
    setIsAnswering(true); // allow clicking again
    let newNum1, newNum2, operations, randomOperation, correctAnswer;

    if (level === "easy") {
      newNum1 = Math.floor(Math.random() * 10) + 1;
      newNum2 = Math.floor(Math.random() * 10) + 1;
      operations = ["+", "-"];
    } else if (level === "medium") {
      newNum1 = Math.floor(Math.random() * 50) + 1;
      newNum2 = Math.floor(Math.random() * 50) + 1;
      operations = ["+", "-", "x"];
    } else {
      newNum1 = Math.floor(Math.random() * 100) + 1;
      newNum2 = Math.floor(Math.random() * 100) + 1;
      operations = ["+", "-", "x", "/"];
    }

    randomOperation = operations[Math.floor(Math.random() * operations.length)];

    switch (randomOperation) {
      case "+":
        correctAnswer = newNum1 + newNum2;
        break;
      case "-":
        correctAnswer = newNum1 - newNum2;
        break;
      case "x":
        correctAnswer = newNum1 * newNum2;
        break;
      case "/":
        correctAnswer = Math.floor(newNum1 / newNum2);
        newNum1 = correctAnswer * newNum2; // ensure integer result
        break;
      default:
        correctAnswer = newNum1 + newNum2;
    }

    const wrongAnswers = [
      correctAnswer + Math.floor(Math.random() * 5 + 1),
      correctAnswer - Math.floor(Math.random() * 3 + 1),
      correctAnswer + Math.floor(Math.random() * 10 + 1),
    ];

    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    setNum1(newNum1);
    setNum2(newNum2);
    setOperation(randomOperation);
    setOptions(allOptions);
    setMessage("Select the correct answer");
  };

  const checkAnswer = (answer) => {
    if (!isAnswering) return; // prevent double click
  setIsAnswering(false); // lock further clicks
  let correctAnswer;
  switch (operation) {
    case "+":
      correctAnswer = num1 + num2;
      break;
    case "-":
      correctAnswer = num1 - num2;
      break;
    case "x":
      correctAnswer = num1 * num2;
      break;
    case "/":
      correctAnswer = Math.floor(num1 / num2);
      break;
    default:
      correctAnswer = num1 + num2;
  }

  if (answer === correctAnswer) {
    setScore((prev) => prev + 10);
    setMessage("✅ Correct! Well done.");
  } else {
    setMessage("❌ Oops! Try again.");
  }

  setTimeout(() => {
  const newCount = questionCount + 1;
  setQuestionCount(newCount);

  if (newCount >= totalQuestions) {
    setGameOver(true);
  } else {
    generateQuestion();
  }
}, 1500);

};


  const resetGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
    setGameStarted(false);
    setMessage("Select the correct answer");
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
    generateQuestion();
  };

  return (
    <div
          style={{
            background: `url(${mathgameimg}) no-repeat center center`,
            backgroundSize: 'cover',
          }}
        >
    <div className="math-game-container">
      <h1 className="math-game-title"> Math Fun Challenge </h1>

      {!gameStarted && (
        <div className="level-selector">
          <label>Select Level: </label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟡 Medium</option>
            <option value="hard">🔴 Hard</option>
          </select>
          <button onClick={startGame} className="play-again-button">▶ Start Game</button>
        </div>
      )}

      {gameStarted && (
        <>
          <p className="math-game-score">Score: {score}</p>
          {!gameOver && (
  <p className="math-game-question-count">
    Question {questionCount + 1} of {totalQuestions}
  </p>
)}


          {gameOver ? (
            <div className="game-over-container">
              <h2 className="game-over-title">Game Over! </h2>
              <p className="game-over-score">Final Score: {score}/{totalQuestions*10}</p>
              <p className="game-over-message">
                {score >= 8 ? "Amazing job! You're a math star! " :
                 score >= 5 ? "Great effort! Keep practicing and you'll be a pro! " :
                 "Don't give up! Every try makes you better! "}
              </p>
              <button onClick={resetGame} className="play-again-button">🔄 Play Again</button>
            </div>
          ) : (
            <div className="question-container">
              <h2 className="question-text">{num1} {operation} {num2} = ?</h2>
              <div className="options-container">
                {options.map((option, index) => (
                  <button key={index} onClick={() => checkAnswer(option)} className="option-button" disabled={!isAnswering}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
         {!gameOver && <p className="message">{message}</p>}
        </>
      )}
    </div>
    </div>
  );
};

export default MathGame;