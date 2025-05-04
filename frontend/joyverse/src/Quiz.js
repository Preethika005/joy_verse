import React, { useState, useEffect, useRef } from "react";
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

const emotionThemes = {
  Happy: "#ffeaa7",
  Sad: "#dfe6e9",
  Angry: "#fab1a0",
  Disgust: "#81ecec",
  Fear: "#a29bfe",
  Neutral: "#ffffff",
};

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [expression, setExpression] = useState("Happy");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Change background based on detected emotion
  useEffect(() => {
    const bgColor = emotionThemes[expression] || "#ffffff";
    document.body.style.setProperty("background-color", bgColor, "important");
  }, [expression]);

  // Setup webcam and interval for capturing emotions
  useEffect(() => {
    let stream;
    let interval;
    const startCapture = () => {
      interval = setInterval(() => {
        captureAndSend();
      }, 5000); // every 10 seconds
    };
    navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
      stream = s;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
  
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          startCapture(); // ✅ Start capture only after video is ready
        };
      }
    });


    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      clearInterval(interval);
    };
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
          const normalizedExpression =
            data.expression.charAt(0).toUpperCase() +
            data.expression.slice(1).toLowerCase();
          setExpression(normalizedExpression);
        }
      } catch (err) {
        console.error("Failed to detect expression:", err);
      }
    }, "image/jpeg");
  };

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
            <p>
              You scored {score} out of {quizData.length}! 🎉
            </p>
            <button className="quiz-replay-btn" onClick={handleReplay}>
              Replay Quiz
            </button>
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
                  <img
                    src={option.image}
                    alt={option.text}
                    className="quiz-option-image"
                  />
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

      <video ref={videoRef} style={{ display: "none" }} autoPlay muted />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Quiz;