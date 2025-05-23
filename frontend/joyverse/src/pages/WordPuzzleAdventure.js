import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./WordPuzzleAdventure.css";

const WordPuzzleAdventure = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [shuffledWords, setShuffledWords] = useState([]);
  const [allFetchedWords, setAllFetchedWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [hintVisible, setHintVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchQuestions(difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (gameCompleted) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }, [gameCompleted]);

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);

  const fetchQuestions = async (level) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wordQuestions/${level}`);
      const data = await response.json();
      if (data.length === 0) {
        alert("No questions found for this difficulty!");
        setShuffledWords([]);
        return;
      }
      setAllFetchedWords(data);
      initializeGame(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const shuffleArray = (array) => {
    let shuffled = [...array];
    let attempts = 0;
    while (shuffled.join('') === array.join('') && attempts < 10) {
      shuffled = [...array].sort(() => Math.random() - 0.5);
      attempts++;
    }
    return shuffled;
  };

  const initializeGame = (questions) => {
    const allWords = shuffleArray(questions);
    const levelWords = allWords.slice(0, 5);
    setShuffledWords(levelWords);
    setCurrentIndex(0);
    setSelectedLetters(Array(levelWords[0].word.length).fill(""));
    setShuffledLetters(shuffleArray([...levelWords[0].word]));
    setScore(0);
    setHintVisible(false);
    setGameCompleted(false);
    setFeedback("");
  };

  const handleLetterClick = (letter, index) => {
    if (letter === null) return;
    const newSelection = [...selectedLetters];
    const emptyIndex = newSelection.findIndex((char) => char === "");
    if (emptyIndex === -1) return;
    newSelection[emptyIndex] = letter;
    setSelectedLetters(newSelection);
    const updatedShuffled = [...shuffledLetters];
    updatedShuffled[index] = null;
    setShuffledLetters(updatedShuffled);
    const formedWord = newSelection.join("");
    if (!newSelection.includes("")) {
      const correctWord = shuffledWords[currentIndex].word;
      if (formedWord === correctWord) {
        setFeedback("Correct! 🎉");
        setScore(score + 20);
        setTimeout(() => {
          setFeedback("");
          nextWord();
        }, 1500);
      } else {
        setFeedback("Oops! That's incorrect. ❌");
        setTimeout(() => {
          setFeedback("");
          nextWord();
        }, 1500);
      }
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
    }
  };

  const handleAnswerClick = (index) => {
    const letterToRemove = selectedLetters[index];
    if (letterToRemove !== "") {
      const newSelection = [...selectedLetters];
      newSelection[index] = "";
      setSelectedLetters(newSelection);
      const restored = [...shuffledLetters];
      for (let i = 0; i < restored.length; i++) {
        if (restored[i] === null) {
          restored[i] = letterToRemove;
          break;
        }
      }
      setShuffledLetters(restored);
    }
  };

  const handleReplay = () => {
    initializeGame(shuffleArray(allFetchedWords));
  };

  const currentWordObj = shuffledWords[currentIndex] || {};

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
            <option value="easy">🟢Easy</option>
            <option value="medium">🟡Medium</option>
            <option value="hard">🔴Hard</option>
          </select>
        </div>
      </div>
      {gameCompleted ? (
        <div className="word-puzzle-completion-message">
          <h2>You finished all the words!</h2>
          <p className="word-puzzle-final-score">Your Score: {score}</p>
          <p className="word-puzzle-final-encouragement">
            {score === 0
              ? "Keep Practicing! You'll get it next time!"
              : score <= 20
              ? "Nice Try! You're Getting There!"
              : score <= 40
              ? "Great Work! You're Improving!"
              : "Amazing Work! You're a Word Master!"}
          </p>
          <div className="word-puzzle-confetti" />
          <button onClick={handleReplay} className="word-puzzle-replay-button">
            🔄 Play Again
          </button>
        </div>
      ) : (
        <>
          <h2 className="word-puzzle-title">Guess the Word!</h2>
          <img
            src={currentWordObj.image}
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
                disabled={!letter}
                style={{ visibility: letter ? "visible" : "hidden" }}
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
          {hintVisible && (
            <p className="word-puzzle-hint">{currentWordObj.hint}</p>
          )}
          {feedback && <p className="word-puzzle-feedback">{feedback}</p>}
        </>
      )}
    </div>
  );
};

export default WordPuzzleAdventure;
