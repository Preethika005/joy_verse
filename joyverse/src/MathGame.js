import React, { useState, useEffect } from "react";
import "./MathGame.css";

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
  
  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    if (questionCount >= totalQuestions) {
      setGameOver(true);
      return;
    }

    let newNum1 = Math.floor(Math.random() * 10) + 1;
    let newNum2 = Math.floor(Math.random() * 10) + 1;
    let operations = ["+", "-", "x"];
    let randomOperation = operations[Math.floor(Math.random() * operations.length)];
    let correctAnswer;

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
      default:
        correctAnswer = newNum1 + newNum2;
    }

    let wrongAnswers = [
      correctAnswer + 2,
      correctAnswer - 2,
      correctAnswer + 5
    ];
    let allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    setNum1(newNum1);
    setNum2(newNum2);
    setOperation(randomOperation);
    setOptions(allOptions);
    setMessage("Select the correct answer");
  };

  const checkAnswer = (answer) => {
    if (questionCount >= totalQuestions - 1) {
      setGameOver(true);
      return;
    }

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
      default:
        correctAnswer = num1 + num2;
    }

    if (answer === correctAnswer) {
      setScore(score + 1);
      setMessage("✅ Correct! Well done.");
    } else {
      setMessage("❌ Oops! Try again.");
    }

    setQuestionCount(prev => prev + 1);
    setTimeout(generateQuestion, 1500);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
    generateQuestion();
  };

  return (
    <div className="math-game-container">
      <h1 className="math-game-title">🎉 Math Fun Challenge 🎈</h1>
      <p className="math-game-score">Score: {score}</p>
      <p className="math-game-question-count">Question {questionCount + 1} of {totalQuestions}</p>

      {gameOver ? (
        <div className="game-over-container">
          <h2 className="game-over-title">Game Over! 🎮</h2>
          <p className="game-over-score">Final Score: {score}/{totalQuestions}</p>
          <p className="game-over-message">
            {score >= 8 ? "Amazing job! You're a math star! 🌟" :
             score >= 5 ? "Great effort! Keep practicing and you'll be a pro! 😊" :
             "Don't give up! Every try makes you better! 💪"}
          </p>
          <button onClick={resetGame} className="play-again-button">🔄 Play Again</button>
        </div>
      ) : (
        <div className="question-container">
          <h2 className="question-text">{num1} {operation} {num2} = ?</h2>
          <div className="options-container">
            {options.map((option, index) => (
              <button key={index} onClick={() => checkAnswer(option)} className="option-button">
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="message">{message}</p>
    </div>
  );
};

export default MathGame;
