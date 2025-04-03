import React, { useState } from "react";
import "./Quiz.css";

const quizData = [
  {
    question: "What is the color of the sky?",
    options: [
      { text: "Blue", image: "https://www.solidbackgrounds.com/images/3840x2160/3840x2160-light-sky-blue-solid-color-background.jpg" },
      { text: "Red", image: "https://cdn.wallpapersafari.com/80/30/FfT324.jpg" },
      { text: "Green", image: "https://wallpaperset.com/w/full/7/a/1/65749.jpg" },
      { text: "Yellow", image: "https://wallpapercave.com/wp/vckf4oR.jpg" },
    ],
    answer: "Blue",
  },
  {
    question: "Which fruit is yellow?",
    options: [
      { text: "Apple", image: "https://i.pinimg.com/originals/d2/e2/e6/d2e2e62bc22bead43c8e20aeac029593.jpg" },
      { text: "Banana", image: "https://tse2.mm.bing.net/th?id=OIP.4VlM4J-A3N0Eo9sUNmWXlAHaFp&pid=Api&P=0&h=180" },
      { text: "Grapes", image: "https://bettyfresh.com/137-large_default/grapesgreen.jpg" },
      { text: "Watermelon", image: "https://www.gardeningknowhow.com/wp-content/uploads/2021/05/whole-and-slices-watermelon.jpg" },
    ],
    answer: "Banana",
  },
  {
    question: "Which vehicle flies in the sky?",
    options: [
      { text: "Car", image: "http://www.pngall.com/wp-content/uploads/2016/07/Car-High-Quality-PNG.png" },
      { text: "Bicycle", image: "https://i5.walmartimages.com/asr/409630c3-f5ce-44dc-89dd-12cf1f2c7958_1.0b6ea7e3289be7f18d31637a9e8aa09d.jpeg" },
      { text: "Airplane", image: "https://tse4.mm.bing.net/th?id=OIP.c6bwfJFG5wWYxUj4tl1N7gHaE2&pid=Api&P=0&h=180" },
      { text: "Ship", image: "https://tse3.mm.bing.net/th?id=OIP.pSDTwk9MB6Spbtfy9gmcgQHaEo&pid=Api&P=0&h=180" },
    ],
    answer: "Airplane",
  },
  {
    question: "What color is grass?",
    options: [
      { text: "Yellow", image: "https://wallpapercave.com/wp/vckf4oR.jpg" },
      { text: "Green", image: "https://wallpaperset.com/w/full/7/a/1/65749.jpg" },
      { text: "Blue", image: "https://www.solidbackgrounds.com/images/3840x2160/3840x2160-light-sky-blue-solid-color-background.jpg" },
      { text: "Red", image: "https://cdn.wallpapersafari.com/80/30/FfT324.jpg" },
    ],
    answer: "Green",
  },
  {
    question: "Which of these is a cat?",
    options: [
      { text: "Dog", image: "https://tse1.mm.bing.net/th?id=OIP.yuYto9g41BDnIt-LwK5N6gHaHx&pid=Api&P=0&h=180" },
      { text: "Lion", image: "https://static.vecteezy.com/system/resources/previews/026/525/162/non_2x/lion-animal-isolated-photo.jpg" },
      { text: "Cat", image: "https://tse1.mm.bing.net/th?id=OIP.44dnstQAW4ZeGFTCZemrfgHaEb&pid=Api&P=0&h=180" },
      { text: "Fox", image: "https://tse3.mm.bing.net/th?id=OIP.KcNx0JBThs-hhf2zHccmkwHaEK&pid=Api&P=0&h=180" },
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
          <div className="score-section">
            <p>You scored {score} out of {quizData.length}!🎉</p>
            <button className="replay-btn" onClick={handleReplay}>Replay Quiz</button>
          </div>
        ) : (
          <>
            <p className="question">{quizData[currentQuestion].question}</p>
            <div className="options">
              {quizData[currentQuestion].options.map((option) => (
                <button
                  key={option.text}
                  className="option-btn"
                  onClick={() => handleAnswerClick(option.text)}
                >
                  <img src={option.image} alt={option.text} className="option-image" />
                  <div>{option.text}</div>
                </button>
              ))}
            </div>
            <p className="question-count">
              Question {currentQuestion + 1} of {quizData.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
