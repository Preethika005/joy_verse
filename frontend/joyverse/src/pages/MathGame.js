// import React, { useState, useEffect } from "react";
// import confetti from "canvas-confetti";
// import useEmotionDetection from "../hooks/useEmotionDetection";
// import "./Quiz.css"; // Reuse same styles for consistency

// const MathGame = () => {
//   const { emotion, videoRef, canvasRef } = useEmotionDetection();
//   const [num1, setNum1] = useState(0);
//   const [num2, setNum2] = useState(0);
//   const [operation, setOperation] = useState("+");
//   const [options, setOptions] = useState([]);
//   const [score, setScore] = useState(0);
//   const [message, setMessage] = useState("Select the correct answer");
//   const [questionCount, setQuestionCount] = useState(0);
//   const [difficulty, setDifficulty] = useState("Easy");
//   const totalQuestions = 10;
//   const [gameOver, setGameOver] = useState(false);
//   const [isAnswering, setIsAnswering] = useState(true);

//   useEffect(() => {
//     generateQuestion();
//   }, [difficulty]);

//   useEffect(() => {
//     if (gameOver) {
//       confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
//     }
//   }, [gameOver]);

//   const getRange = () => {
//     switch (difficulty) {
//       case "Easy": return 10;
//       case "Medium": return 20;
//       case "Hard": return 50;
//       default: return 10;
//     }
//   };

//   const generateQuestion = () => {
//     if (questionCount >= totalQuestions) {
//       setGameOver(true);
//       return;
//     }

//     setIsAnswering(true);
//     const range = getRange();

//     const newNum1 = Math.floor(Math.random() * range) + 1;
//     const newNum2 = Math.floor(Math.random() * range) + 1;
//     const operations = ["+", "-", "x"];
//     const randomOperation = operations[Math.floor(Math.random() * operations.length)];

//     let correctAnswer;
//     switch (randomOperation) {
//       case "+": correctAnswer = newNum1 + newNum2; break;
//       case "-": correctAnswer = newNum1 - newNum2; break;
//       case "x": correctAnswer = newNum1 * newNum2; break;
//     }

//     const wrongAnswers = new Set();
//     while (wrongAnswers.size < 3) {
//       const variation = Math.floor(Math.random() * 10) + 1;
//       const wrong = correctAnswer + (Math.random() < 0.5 ? -variation : variation);
//       if (wrong !== correctAnswer) wrongAnswers.add(wrong);
//     }

//     const allOptions = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);

//     setNum1(newNum1);
//     setNum2(newNum2);
//     setOperation(randomOperation);
//     setOptions(allOptions);
//     setMessage("Select the correct answer");
//   };

//   const checkAnswer = (answer) => {
//     if (!isAnswering) return;
//     setIsAnswering(false);

//     let correctAnswer;
//     switch (operation) {
//       case "+": correctAnswer = num1 + num2; break;
//       case "-": correctAnswer = num1 - num2; break;
//       case "x": correctAnswer = num1 * num2; break;
//     }

//     if (answer === correctAnswer) {
//       setScore(score + 1);
//       setMessage("✅ Correct! Well done.");
//     } else {
//       setMessage(`❌ Wrong! The answer was ${correctAnswer}`);
//     }

//     setTimeout(() => {
//       const newCount = questionCount + 1;
//       setQuestionCount(newCount);

//       if (newCount >= totalQuestions) {
//         setGameOver(true);
//       } else {
//         generateQuestion();
//       }
//     }, 1200);
//   };

//   const resetGame = () => {
//     setScore(0);
//     setQuestionCount(0);
//     setGameOver(false);
//     setMessage("Select the correct answer");
//     generateQuestion();
//   };

//   const handleDifficultyChange = (level) => {
//     setDifficulty(level);
//     resetGame();
//   };

//   return (
//     <div className="quiz-container">
//       <div className="game-card">
//         <h2 className="game-title">Math Quiz!</h2>
//         <p className="game-text emotion-text">Detected Emotion: {emotion}</p>

//         <div className="difficulty-selector">
//           {["Easy", "Medium", "Hard"].map((level) => (
//             <button
//               key={level}
//               className="game-button"
//               onClick={() => handleDifficultyChange(level)}
//             >
//               {level}
//             </button>
//           ))}
//         </div>

//         {gameOver ? (
//           <div className="game-score">
//             <p className="game-text">Final Score: {score} out of {totalQuestions} 🎉</p>
//             <p className="game-text">
//               {score >= 8
//                 ? "Amazing job! You're a math star!"
//                 : score >= 5
//                 ? "Great effort! Keep practicing!"
//                 : "Don't give up! You’re getting better every time!"}
//             </p>
//             <button className="game-button" onClick={resetGame}>Play Again</button>
//           </div>
//         ) : (
//           <>
//             <p className="game-question">{`${num1} ${operation} ${num2} = ?`}</p>
//             <div className="quiz-options">
//               {options.map((option, index) => (
//                 <button
//                   key={index}
//                   className="quiz-option-btn"
//                   onClick={() => checkAnswer(option)}
//                   disabled={!isAnswering}
//                 >
//                   <div className="quiz-text">{option}</div>
//                 </button>
//               ))}
//             </div>
//             <p className="game-text">Question {questionCount + 1} of {totalQuestions}</p>
//             <p className="game-text">{message}</p>
//           </>
//         )}

//         <video ref={videoRef} autoPlay style={{ display: "none" }} />
//         <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }} />
//       </div>
//     </div>
//   );
// };

// export default MathGame;







import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import useEmotionDetection from "../hooks/useEmotionDetection";
import "./Quiz.css";

const emotionToDifficulty = {
  Happy: "Hard",
  Sad: "Easy",
  Neutral: "Easy",
  Angry: "Medium",
  Surprise: "Medium",
};

const MathGame = () => {
  const {
    emotion,
    sessionDominantEmotion,
    finalizeSession,
    videoRef,
    canvasRef,
  } = useEmotionDetection();

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState("+");
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Select the correct answer");
  const [questionCount, setQuestionCount] = useState(0);
  const [difficulty, setDifficulty] = useState("Easy");
  const [gameOver, setGameOver] = useState(false);
  const [isAnswering, setIsAnswering] = useState(true);
  const totalQuestions = 10;

  useEffect(() => {
    generateQuestion();
  }, [difficulty]);

  useEffect(() => {
    if (gameOver) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [gameOver]);

  const getRange = () => {
    switch (difficulty) {
      case "Easy": return 10;
      case "Medium": return 20;
      case "Hard": return 50;
      default: return 10;
    }
  };

  const generateQuestion = () => {
    if (questionCount >= totalQuestions) {
      setGameOver(true);
      finalizeSession(); // Trigger emotion collection at session end
      return;
    }

    setIsAnswering(true);
    const range = getRange();

    const newNum1 = Math.floor(Math.random() * range) + 1;
    const newNum2 = Math.floor(Math.random() * range) + 1;
    const operations = ["+", "-", "x"];
    const randomOperation = operations[Math.floor(Math.random() * operations.length)];

    let correctAnswer;
    switch (randomOperation) {
      case "+": correctAnswer = newNum1 + newNum2; break;
      case "-": correctAnswer = newNum1 - newNum2; break;
      case "x": correctAnswer = newNum1 * newNum2; break;
    }

    const wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
      const variation = Math.floor(Math.random() * 10) + 1;
      const wrong = correctAnswer + (Math.random() < 0.5 ? -variation : variation);
      if (wrong !== correctAnswer) wrongAnswers.add(wrong);
    }

    const allOptions = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);

    setNum1(newNum1);
    setNum2(newNum2);
    setOperation(randomOperation);
    setOptions(allOptions);
    setMessage("Select the correct answer");
  };

  const checkAnswer = (answer) => {
    if (!isAnswering) return;
    setIsAnswering(false);

    let correctAnswer;
    switch (operation) {
      case "+": correctAnswer = num1 + num2; break;
      case "-": correctAnswer = num1 - num2; break;
      case "x": correctAnswer = num1 * num2; break;
    }

    if (answer === correctAnswer) {
      setScore(score + 1);
      setMessage("✅ Correct! Well done.");
    } else {
      setMessage(`❌ Wrong! The answer was ${correctAnswer}`);
    }

    setTimeout(() => {
      const newCount = questionCount + 1;
      setQuestionCount(newCount);

      if (newCount >= totalQuestions) {
        setGameOver(true);
        finalizeSession(); // Ensure emotion is finalized
      } else {
        generateQuestion();
      }
    }, 1200);
  };

  const handleReplay = () => {
    const nextEmotion = sessionDominantEmotion || "Neutral";
    const nextDifficulty = emotionToDifficulty[nextEmotion] || "Medium";
    setDifficulty(nextDifficulty);

    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
    setMessage("Select the correct answer");
    generateQuestion();
  };

  return (
    <div className="quiz-container">
      <div className="game-card" style={{
    backgroundColor: getEmotionStyles(emotion).backgroundColor,
    color: getEmotionStyles(emotion).color,
    '--text-color': getEmotionStyles(emotion).color,
  }}>
        <h2 className="game-title">Math Quiz!</h2>
        <p className="game-text emotion-text">Detected Emotion: {emotion}</p>
        <p className="game-text">Difficulty: {difficulty}</p>

        {gameOver ? (
          <div className="game-score">
            <p className="game-text">Final Score: {score} out of {totalQuestions} 🎉</p>
            <p className="game-text">Session Emotion: {sessionDominantEmotion}</p>
            <p className="game-text">Next Difficulty: {emotionToDifficulty[sessionDominantEmotion] || "Medium"}</p>
            <button className="game-button" onClick={handleReplay}>Replay Quiz</button>
          </div>
        ) : (
          <>
            <p className="game-question">{`${num1} ${operation} ${num2} = ?`}</p>
            <div className="quiz-options">
              {options.map((option, index) => (
                <button
                  key={index}
                  className="quiz-option-btn"
                  onClick={() => checkAnswer(option)}
                  disabled={!isAnswering}
                >
                  <div className="quiz-text">{option}</div>
                </button>
              ))}
            </div>
            <p className="game-text">Question {questionCount + 1} of {totalQuestions}</p>
            <p className="game-text">{message}</p>
          </>
        )}

        <video ref={videoRef} autoPlay playsInline muted style={{ position: "absolute", top: 0, left: 0, visibility: "hidden" }} />
<canvas ref={canvasRef} width={640} height={480} style={{ position: "absolute", top: 0, left: 0, visibility: "hidden" }} />

      </div>
    </div>
  );
};

export default MathGame;
