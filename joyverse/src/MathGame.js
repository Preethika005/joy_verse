import React, { useState, useEffect } from "react";

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
    <div style={{
      textAlign: "center",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      background: "#f0f8ff",
      minHeight: "100vh",
      color: "#333"
    }}>
      <h1 style={{ fontSize: "40px", color: "#ff6b6b" }}>🎉 Math Fun Challenge 🎈</h1>
      <p style={{ fontSize: "22px", fontWeight: "bold", color: "#4caf50" }}>Score: {score}</p>
      <p style={{ fontSize: "20px", color: "#007bff" }}>Question {questionCount + 1} of {totalQuestions}</p>

      {gameOver ? (
        <div>
          <h2 style={{ fontSize: "32px", color: "#ff4757" }}>Game Over! 🎮</h2>
          <p style={{ fontSize: "26px", color: "#2f3542" }}>Final Score: {score}/{totalQuestions}</p>
          <p style={{ fontSize: "22px", color: score >= 7 ? "green" : "red" }}>
            {score >= 8 ? "Amazing job! You're a math star! 🌟" :
             score >= 5 ? "Great effort! Keep practicing and you'll be a pro! 😊" :
             "Don't give up! Every try makes you better! 💪"}
          </p>
          <button onClick={resetGame} style={{
            backgroundColor: "#ff6b6b",
            color: "#fff",
            fontSize: "26px",
            padding: "12px 24px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            boxShadow: "3px 3px 10px rgba(0,0,0,0.2)"
          }}>
            🔄 Play Again
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "15px",
          display: "inline-block",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
        }}>
          <h2 style={{ fontSize: "32px", marginBottom: "20px", color: "#e67e22" }}>
            {num1} {operation} {num2} = ?
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            {options.map((option, index) => (
              <button key={index} onClick={() => checkAnswer(option)}
                style={{
                  backgroundColor: "#3498db",
                  color: "#fff",
                  fontSize: "26px",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  transition: "0.3s",
                  boxShadow: "3px 3px 10px rgba(0,0,0,0.2)"
                }}>
                {option}
              </button>
            ))}
          </div>  
        </div>
      )}
      <p style={{ marginTop: "20px", fontSize: "24px", fontWeight: "bold" }}>{message}</p>
    </div>
  );
};

export default MathGame;
