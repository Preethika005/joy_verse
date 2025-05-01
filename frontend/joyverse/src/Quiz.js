import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import "./Quiz.css";

const emotionColors = {
  Happy: "#fff3cd",     // light yellow
  Sad: "#cce5ff",       // light blue
  Angry: "#f8d7da",     // light red
  Disgust: "#d4edda",   // light green
  Fear: "#e2e3e5",      // grey
  Neutral: "#ffffff",   // white
};

const quizData = [/* your existing quizData array here */
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
  const [emotion, setEmotion] = useState("Neutral");
  const webcamRef = useRef(null);

  const [emotionBuffer, setEmotionBuffer] = useState([]);

  // Capture a single frame and send to backend
  const captureEmotion = async () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) return;

      const blob = await fetch(screenshot).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const response = await axios.post("http://localhost:8000/predict", formData);
        const detected = response.data.expression;
        setEmotionBuffer(prev => [...prev, detected]);
      } catch (err) {
        console.error("Error detecting emotion:", err);
      }
    }
  };

  // Analyze buffer and set theme
  const analyzeAndSetTheme = () => {
    if (emotionBuffer.length === 0) return;
    const freq = {};
    for (let emo of emotionBuffer) {
      freq[emo] = (freq[emo] || 0) + 1;
    }
    const dominantEmotion = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
    setEmotion(dominantEmotion);
    setEmotionBuffer([]); // Clear buffer for next cycle
  };

  // Start periodic emotion sampling every 10s (capture for 2s, every 500ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setEmotionBuffer([]);
      let captureCount = 0;
      const captureInterval = setInterval(() => {
        if (captureCount < 4) {
          captureEmotion();
          captureCount++;
        } else {
          clearInterval(captureInterval);
          setTimeout(analyzeAndSetTheme, 500); // wait a bit to ensure last prediction is included
        }
      }, 500);
    }, 10000); // every 10s

    return () => clearInterval(interval);
  }, []);

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
    <div
      className="quiz-container"
      style={{ backgroundColor: emotionColors[emotion] || "#ffffff" }}
    >
      {/* Webcam hidden but active */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={0}
        height={0}
        style={{ display: "none" }}
      />

      <div className="quiz-box">
        <h2 className="quiz-title">Fun Quiz!</h2>
        <p style={{ fontWeight: "bold" }}>Current Mood: {emotion}</p>

        {showScore ? (
          <div className="quiz-score-section">
            <p>You scored {score} out of {quizData.length}! 🎉</p>
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
