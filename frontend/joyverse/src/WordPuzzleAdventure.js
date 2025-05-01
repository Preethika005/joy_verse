import React, { useState, useEffect } from "react";
import "./WordPuzzleAdventure.css";

const words = [
  { image: "/images/apple.jpg", word: "APPLE", hint: "A red-colored fruit" },
  { image: "/images/tiger.jpg", word: "TIGER", hint: "National animal of India" },
  { image: "/images/elephant.webp", word: "ELEPHANT", hint: "The largest land animal" },
  { image: "/images/sun.webp", word: "SUN", hint: "The star at the center of our solar system" },
  { image: "/images/banana.jpg", word: "BANANA", hint: "A long yellow fruit" },
  { image: "/images/dog.jpg", word: "DOG", hint: "A loyal domestic animal" },
  { image: "/images/mountain.jpg", word: "MOUNTAIN", hint: "A large natural elevation of the earth's surface" },
  { image: "/images/rose.jpg", word: "ROSE", hint: "A beautiful flower often red or pink" },
  { image: "/images/car.png", word: "CAR", hint: "A vehicle with four wheels" },
  { image: "/images/book.jpg", word: "BOOK", hint: "You can read stories or information from this" },
  { image: "/images/owl.jpg", word: "OWL", hint: "A bird that is active at night" },
  { image: "/images/fish.jpg", word: "FISH", hint: "An animal that lives in water" },
];

const encouragingMessages = [
  "Great Job! 🎉",
  "You're Amazing! ⭐",
  "Fantastic! Keep Going! 🚀",
  "You Did It! 🏆",
  "Awesome! 🎈",
];


const WordPuzzleAdventure = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState(Array(words[0].word.length).fill(""));
  const [shuffledLetters, setShuffledLetters] = useState([...words[0].word].sort(() => Math.random() - 0.5));
  const [hintVisible, setHintVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Enable scrolling when this page is open
    document.body.style.overflow = "auto";
  
    // When leaving this page, disable scrolling again
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);
  useEffect(() => {
    checkIfWordIsCorrect();
    // eslint-disable-next-line
  }, [selectedLetters]);

  const handleLetterClick = (letter, index) => {
    const emptyIndex = selectedLetters.findIndex((l) => l === "");
    if (emptyIndex !== -1) {
      const newSelection = [...selectedLetters];
      newSelection[emptyIndex] = letter;
      setSelectedLetters(newSelection);

      const newShuffledLetters = [...shuffledLetters];
      newShuffledLetters.splice(index, 1);
      setShuffledLetters(newShuffledLetters);
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

  const checkIfWordIsCorrect = () => {
    const currentWord = words[currentIndex].word;
    if (selectedLetters.join("") === currentWord) {
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      setMessage(randomMessage);
      setScore(prevScore => prevScore + 10);
      setShowMessage(true);

      setTimeout(() => {
        nextWord();
      }, 2000); // Move to next word after 2 seconds
    }
  };

  const nextWord = () => {
    const newIndex = (currentIndex + 1) % words.length;
    setCurrentIndex(newIndex);
    setSelectedLetters(Array(words[newIndex].word.length).fill(""));
    setShuffledLetters([...words[newIndex].word].sort(() => Math.random() - 0.5));
    setHintVisible(false);
    setShowMessage(false);
    setMessage("");
  };

  return (
    <div className="word-puzzle-container">
      <div className="word-puzzle-score-board">
        <h3>Score: {score}</h3>
      </div>
      <h2 className="word-puzzle-title">🎯 Guess the Word!</h2>
      <img
        src={words[currentIndex].image}
        alt="word"
        className="word-puzzle-word-image"
      />

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
        <button
          className="word-puzzle-action-button hint"
          onClick={() => setHintVisible(true)}
        >
          Show Hint
        </button>
        <button
          className="word-puzzle-action-button next"
          onClick={nextWord}
        >
          Skip
        </button>
      </div>

      {hintVisible && <p className="word-puzzle-hint">{words[currentIndex].hint}</p>}

      {showMessage && (
        <p
          className={`word-puzzle-message success`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default WordPuzzleAdventure;
