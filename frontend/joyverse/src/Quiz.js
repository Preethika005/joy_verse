import React, { useState, useEffect } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import "./Quiz.css";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [difficulty, setDifficulty] = useState("Easy");

  // ✅ Fetch questions from backend based on difficulty
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/questions?difficulty=${difficulty}`);
        setQuestions(response.data);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuestions();

    // Enable scrolling when this page is open
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, [difficulty]);

  const handleAnswerClick = (selected) => {
    if (selected === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      confetti();
    }
  };

  const handleReplay = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-box">
        <h2 className="quiz-title">Fun Quiz!</h2>

        {/* Difficulty selector */}
        <div className="difficulty-selector">
          <button onClick={() => handleDifficultyChange("Easy")}>Easy</button>
          <button onClick={() => handleDifficultyChange("Medium")}>Medium</button>
          <button onClick={() => handleDifficultyChange("Hard")}>Hard</button>
        </div>

        {questions.length === 0 ? (
          <p>Loading questions...</p>
        ) : showScore ? (
          <div className="quiz-score-section">
            <p>You scored {score} out of {questions.length}! 🎉</p>
            <button className="quiz-replay-btn" onClick={handleReplay}>Replay Quiz</button>
          </div>
        ) : (
          <>
            <p className="quiz-question">{questions[currentQuestion].question}</p>
            <div className="quiz-options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="quiz-option-btn"
                  onClick={() => handleAnswerClick(option.text)}
                >
                  <img src={option.image} alt={option.text} className="quiz-option-image" />
                  <div>{option.text}</div>
                </button>
              ))}
            </div>
            <p className="quiz-question-count">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;