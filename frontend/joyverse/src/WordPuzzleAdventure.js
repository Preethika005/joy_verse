import React, { useState, useEffect } from "react";
import "./WordPuzzleAdventure.css";

const wordData = {
  easy: [
    { image: "/images/sun.webp", word: "SUN", hint: "The star at the center of our solar system" },
    { image: "/images/dog.jpg", word: "DOG", hint: "A loyal domestic animal" },
    { image: "/images/car.png", word: "CAR", hint: "A vehicle with four wheels" },
    { image: "/images/owl.jpg", word: "OWL", hint: "A bird that is active at night" },
    { image: "/images/fish.jpg", word: "FISH", hint: "An animal that lives in water" },
  ],
  medium: [
    { image: "/images/apple.jpg", word: "APPLE", hint: "A red-colored fruit" },
    { image: "/images/tiger.jpg", word: "TIGER", hint: "National animal of India" },
    { image: "/images/banana.jpg", word: "BANANA", hint: "A long yellow fruit" },
    { image: "/images/rose.jpg", word: "ROSE", hint: "A beautiful flower often red or pink" },
    { image: "/images/book.jpg", word: "BOOK", hint: "You can read stories or information from this" },
  ],
  hard: [
    { image: "/images/elephant.webp", word: "ELEPHANT", hint: "The largest land animal" },
    { image: "/images/mountain.jpg", word: "MOUNTAIN", hint: "A large natural elevation of the earth's surface" },
    { image: "/images/watermelon.jpg", word: "WATERMELON", hint: "A large green fruit with red, juicy flesh and black seeds" },
    { image: "/images/strawberry.jpeg", word: "STRAWBERRY", hint: "A red fruit with seeds on the outside" },
    { image: "/images/crocodile.jpg", word: "CROCODILE", hint: "A large reptile with a strong jaw, found in rivers" },
  ],
};

const encouragingMessages = [
  "Great Job! 🎉",
  "You're Amazing! ⭐",
  "Fantastic! Keep Going! 🚀",
  "You Did It! 🏆",
  "Awesome! 🎈",
];

const WordPuzzleAdventure = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [hintVisible, setHintVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty]);
  useEffect(() => {
    // Enable scrolling when this page is open
    document.body.style.overflow = "auto";
  
    // When leaving this page, disable scrolling again
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const initializeGame = (level) => {
    const levelWords = shuffleArray(wordData[level]);
    setShuffledWords(levelWords);
    setCurrentIndex(0);
    setSelectedLetters(Array(levelWords[0].word.length).fill(""));
    setShuffledLetters(shuffleArray([...levelWords[0].word]));
    setScore(0);
    setHintVisible(false);
    setMessage("");
    setShowMessage(false);
    setGameCompleted(false);
  };

  const handleLetterClick = (letter, index) => {
    const emptyIndex = selectedLetters.findIndex((l) => l === "");
    if (emptyIndex !== -1) {
      const newSelection = [...selectedLetters];
      newSelection[emptyIndex] = letter;
      setSelectedLetters(newSelection);
  
      const newShuffledLetters = [...shuffledLetters];
      newShuffledLetters.splice(index, 1);
      setShuffledLetters(newShuffledLetters);
  
      // 🔥 Check if word is correct after updating
      const newWordFormed = newSelection.join("");
      const correctWord = shuffledWords[currentIndex].word;
  
      if (!newSelection.includes("") && newWordFormed === correctWord) {
        const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
        setMessage(randomMessage);
        setScore(prev => prev + 10);
        setShowMessage(true);
  
        setTimeout(() => {
          nextWord();
        }, 2000);
      }
    }
  };
  

  const handleAnswerClick = (index) => {
    if (selectedLetters[index] !== "") {
      setShuffledLetters([...shuffledLetters, selectedLetters[index]]);
      const newSelection = [...selectedLetters];
      newSelection[index] = "";
      setSelectedLetters(newSelection);
    }
  };

  const nextWord = () => {
    if (currentIndex + 1 >= shuffledWords.length) {
      setGameCompleted(true);
    } else {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const nextWord = shuffledWords[newIndex].word;
      setSelectedLetters(Array(nextWord.length).fill(""));
      setShuffledLetters(shuffleArray([...nextWord]));
      setHintVisible(false);
      setShowMessage(false);
      setMessage("");
    }
  };

  const currentWordObj = shuffledWords[currentIndex] || {};
  const handleReplay = () => {
    initializeGame(difficulty);
    setGameOver(false);
  };
  return (
    <div className="word-puzzle-container">
      <div className="word-puzzle-score-board">
        <h3>Score: {score}</h3>
        <div>
          <label htmlFor="level-select">Level: </label>
          <select
            id="level-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {gameCompleted ? (
        <h2 className="word-puzzle-title">🎉 You finished all the words!</h2>
      ) : (
        <>
          <h2 className="word-puzzle-title">🎯 Guess the Word!</h2>
          <img src={currentWordObj.image} alt="word" className="word-puzzle-word-image" />

          <div className="word-puzzle-word-slots">
            {selectedLetters.map((letter, index) => (
              <div
                key={index}
                className={`word-puzzle-slot ${letter ? "filled" : ""}`}
                onClick={() => handleAnswerClick(index)}
              >
                {letter}
              </div>
            ))}
          </div>

          <div className="word-puzzle-letters-container">
            {shuffledLetters.map((letter, index) => (
              <button
                key={index}
                className="word-puzzle-letter-button"
                onClick={() => handleLetterClick(letter, index)}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="word-puzzle-buttons">
            <button className="word-puzzle-action-button hint" onClick={() => setHintVisible(true)}>
              Show Hint
            </button>
            <button className="word-puzzle-action-button next" onClick={nextWord}>
              Skip
            </button>
          </div>

          {hintVisible && <p className="word-puzzle-hint">{currentWordObj.hint}</p>}

          {showMessage && <p className="word-puzzle-message success">{message}</p>}
        </>
      )}
      {gameOver && (
  <div className="word-puzzle-replay-container">
    <button onClick={handleReplay} className="word-puzzle-replay-button">
      🔄 Replay
    </button>
  </div>
)}
    </div>
  );
};

export default WordPuzzleAdventure;
