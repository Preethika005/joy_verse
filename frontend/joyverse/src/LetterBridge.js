import React, { useState, useRef, useEffect } from 'react';
import { difficultyData } from './letterBridgingData';
import LineDrawer from './components/LineDrawer';
import './LetterBridge.css';

const GAME_DURATION = 60;

const LetterBridge = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [letters, setLetters] = useState([]);
  const [validWords, setValidWords] = useState([]);
  const [selected, setSelected] = useState({});
  const [formedWords, setFormedWords] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [blinkingCols, setBlinkingCols] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const wrapperRef = useRef(null);
  const letterRefs = useRef({});

  const initializeGame = () => {
    const difficultySets = difficultyData[difficulty];
    const randomSet = difficultySets[Math.floor(Math.random() * difficultySets.length)];
    const { letters, words } = randomSet;

    setLetters(letters);
    setValidWords(words);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setFormedWords([]);
    setSelected({});
    setGameOver(false);
    setPositions([]);
  };

  const handleStart = () => {
    setHasStarted(true);
    initializeGame();
  };

  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) {
      if (timeLeft <= 0) setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasStarted]);

  useEffect(() => {
    if (Object.keys(selected).length === letters.length && !gameOver) {
      const word = letters.map((_, col) => selected[col]).join('');
      const valid = validWords.includes(word);
      setIsValid(valid);

      if (valid) {
        setFormedWords(prev => {
          if (!prev.includes(word)) {
            setScore(prevScore => prevScore + 10);
            return [...prev, word];
          }
          return prev;
        });
      } else {
        setBlinkingCols(Object.keys(selected).map(Number));
        setTimeout(() => setBlinkingCols([]), 500);
      }

      setTimeout(() => {
        setSelected({});
        setPositions([]);
      }, 1000);
    }
  }, [selected, gameOver, letters, validWords]);

  useEffect(() => {
    const wrapperRect = wrapperRef.current?.getBoundingClientRect();
    const newPositions = [];

    for (let i = 0; i < letters.length; i++) {
      const char = selected[i];
      if (char && letterRefs.current[`${i}-${char}`]) {
        const rect = letterRefs.current[`${i}-${char}`].getBoundingClientRect();
        const x = rect.left - wrapperRect.left + rect.width / 2;
        const y = rect.top - wrapperRect.top + rect.height / 2;
        newPositions.push({ x, y });
      }
    }

    setPositions(newPositions);
  }, [selected, letters]);

  const handleSelect = (column, letter) => {
    if (gameOver || !hasStarted) return;

    const nextColumnToSelect = Object.keys(selected).length;
    if (parseInt(column) === nextColumnToSelect) {
      setSelected(prev => ({ ...prev, [column]: letter }));
    }
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  return (
    <div className="letter-bridge-container">
      {!hasStarted ? (
        <div className="letter-bridge-start-screen">
          <h1 className="letter-bridge-title">Letter Bridging Game</h1>
          <p className="letter-bridge-subtitle">Tap one letter from each column, left to right, to form a valid word!</p>

          <div className="letter-bridge-difficulty-select">
            <label>Select Difficulty:</label>
            <select value={difficulty} onChange={handleDifficultyChange}>
              <option value="easy">🟢Easy</option>
              <option value="medium">🟡Medium</option>
              <option value="hard">🔴Hard</option>
            </select>
          </div>

          <button className="letter-bridge-start-btn" onClick={handleStart}>Start Game</button>
        </div>
      ) : (
        <>
          <h1 className="letter-bridge-title">Letter Bridging Game</h1>
          <div className="letter-bridge-info-bar">
            <p>⏱️ Time Left: <strong>{timeLeft}s</strong></p>
            <p>⭐ Score: <strong>{score}</strong></p>
          </div>

          <div className="letter-bridge-grid-wrapper" ref={wrapperRef}>
            <div className="letter-bridge-grid">
              {letters.map((col, colIndex) => (
                <div key={colIndex} className="letter-bridge-column">
                  {col.map((letter, rowIndex) => {
                    const isSelected = selected[colIndex] === letter;
                    const isBlinking = blinkingCols.includes(colIndex) && isSelected;
                    return (
                      <div
                        key={rowIndex}
                        className={`letter-bridge-circle ${isSelected ? 'letter-bridge-selected' : ''} ${isBlinking ? 'letter-bridge-blink-red' : ''}`}
                        onClick={() => handleSelect(colIndex, letter)}
                        ref={(el) => (letterRefs.current[`${colIndex}-${letter}`] = el)}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <LineDrawer positions={positions} isValid={isValid} />
          </div>

          <div className="letter-bridge-words-container">
            <h3>Words Formed:</h3>
            {formedWords.map((word, idx) => (
              <span key={idx} className="letter-bridge-word-pill">{word}</span>
            ))}
          </div>

          {gameOver && (
            <div className="letter-bridge-game-over">
              <h2>⏰ Time’s Up!</h2>
              <p>Your final score: <strong>{score}</strong></p>
              <button className="letter-bridge-start-btn" onClick={handleStart}>Play Again</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LetterBridge;
