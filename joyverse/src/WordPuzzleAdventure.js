import React, { useState } from "react";

const words = [
  {
    image: "/images/apple.jpg", 
    word: "APPLE",
    hint: "A red-colored fruit"
  },
  {
    image: "/images/tiger.jpg", 
    word: "TIGER",
    hint: "National animal of India"
  }
];

const encouragingMessages = [
  "Great Job! 🎉",
  "You're Amazing! ⭐",
  "Fantastic! Keep Going! 🚀",
  "You Did It! 🏆",
  "Awesome! 🎈"
];

const WordPuzzleAdventure = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState(Array(words[currentIndex].word.length).fill(""));
  const [shuffledLetters, setShuffledLetters] = useState([...words[currentIndex].word].sort(() => Math.random() - 0.5));
  const [hintVisible, setHintVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

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

  const checkAnswer = () => {
    const currentWord = words[currentIndex].word;
    if (selectedLetters.join("") === currentWord) {
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      setMessage(randomMessage);
      // new Audio("/sounds/correct.mp3").play(); 
    } 
    else {
      setMessage("Try Again! ❌");
    }
    setShowMessage(true);
  };

  const nextWord = () => {
    const newIndex = (currentIndex + 1) % words.length;
    setCurrentIndex(newIndex);
    setSelectedLetters(Array(words[newIndex].word.length).fill(""));
    setShuffledLetters([...words[newIndex].word].sort(() => Math.random() - 0.5));
    setHintVisible(false);
    setShowMessage(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", justifyContent: "center", backgroundColor: "#f3f4f6" ,width: "100vw"  /* Add this */}}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Guess the Word</h2>
      <img src={words[currentIndex].image} alt="word" style={{ height: "370px", marginBottom: "20px" }} />

      {/* Word Slots */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {selectedLetters.map((letter, index) => (
          <div
            key={index}
            onClick={() => handleAnswerClick(index)}
            style={{
              width: "40px",
              height: "40px",
              border: "2px solid black",
              textAlign: "center",
              fontSize: "20px",
              lineHeight: "40px",
              backgroundColor: letter ? "#d1d5db" : "white",
              cursor: letter ? "pointer" : "default"
            }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Jumbled Letters */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {shuffledLetters.map((letter, index) => (
          <button key={index} onClick={() => handleLetterClick(letter, index)} style={{ padding: "10px", fontSize: "18px", border: "2px solid black", cursor: "pointer" }}>
            {letter}
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={checkAnswer} style={{ padding: "10px", marginRight: "10px", backgroundColor: "purple", color: "white", cursor: "pointer" }}>
          Check Answer
        </button>
        <button onClick={() => setHintVisible(true)} style={{ padding: "10px", marginRight: "10px", backgroundColor: "blue", color: "white", cursor: "pointer" }}>
          Hint
        </button>
        <button onClick={nextWord} style={{ padding: "10px", backgroundColor: "green", color: "white", cursor: "pointer" }}>
          Next Word
        </button>
      </div>

      {/* Hint Display */}
      {hintVisible && <p style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>{words[currentIndex].hint}</p>}

      {/* Encouragement Message */}
      {showMessage && <p style={{ marginTop: "20px", fontSize: "22px", fontWeight: "bold", color: message.includes("Try Again") ? "red" : "green" }}>{message}</p>}
    </div>
  );
};

export default WordPuzzleAdventure;
