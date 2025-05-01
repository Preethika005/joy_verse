import React, { useState } from "react";
import "./Quiz.css";

const quizData = [
  {
    question: "What is the color of the sky?",
    options: [
      { text: "Blue", image: "/images/blue.jpg" },
      { text: "Red", image: "/images/red.jpg" },
      { text: "Green", image: "/images/green.jpg" },
      { text: "Yellow", image: "/images/yellow.webp" },
    ],
    answer: "Blue",
  },
  {
    question: "Which fruit is yellow?",
    options: [
      { text: "Apple", image: "/images/apple.jpg" },
      { text: "Banana", image: "/images/banana.jpg" },
      { text: "Grapes", image: "/images/grapes.jpg" },
      { text: "Watermelon", image: "/images/watermelon.jpg" },
    ],
    answer: "Banana",
  },
  {
    question: "Which vehicle flies in the sky?",
    options: [
      { text: "Car", image: "/images/car.png" },
      { text: "Bicycle", image: "/images/bicycle.webp" },
      { text: "Airplane", image: "/images/aeroplane.jpg" },
      { text: "Ship", image: "/images/ship.jpg" },
    ],
    answer: "Airplane",
  },
  {
    question: "What color is grass?",
    options: [
      { text: "Yellow", image: "/images/yellow.webp" },
      { text: "Green", image: "/images/green.jpg" },
      { text: "Blue", image: "/images/blue.jpg" },
      { text: "Red", image: "/images/red.jpg" },
    ],
    answer: "Green",
  },
  {
    question: "Which of these is a cat?",
    options: [
      { text: "Dog", image: "/images/dog.jpg" },
      { text: "Lion", image: "/images/lion.jpg" },
      { text: "Cat", image: "/images/cat.jpg" },
      { text: "Fox", image: "/images/fox.jpg" },
    ],
    answer: "Cat",
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerClick = (selected) => {
    if (selected === quizData[currentQuestion].answer) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleReplay = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-box">
        <h2 className="quiz-title">Fun Quiz!</h2>

        {showScore ? (
          <div className="quiz-score-section">
            <p>You scored {score} out of {quizData.length}!🎉</p>
            <button className="quiz-replay-btn" onClick={handleReplay}>Replay Quiz</button>
          </div>
        ) : (
          <>
            <p className="quiz-question">{quizData[currentQuestion].question}</p>
            <div className="quiz-options">
              {quizData[currentQuestion].options.map((option) => (
                <button
                  key={option.text}
                  className="quiz-option-btn"
                  onClick={() => handleAnswerClick(option.text)}
                >
                  <img src={option.image} alt={option.text} className="quiz-option-image" />
                  <div>{option.text}</div>
                </button>
              ))}
            </div>
            <p className="quiz-question-count">
              Question {currentQuestion + 1} of {quizData.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;