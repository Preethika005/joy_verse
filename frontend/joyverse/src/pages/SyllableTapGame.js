import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SyllableTapGame.css';

// const hardcodedWords = {
//   easy: [
//     { word: 'cat', syllables: 1, split: ['cat'] },
//     { word: 'apple', syllables: 2, split: ['ap', 'ple'] },
//     { word: 'banana', syllables: 3, split: ['ba', 'na', 'na'] },
//     { word: 'dog', syllables: 1, split: ['dog'] },
//     { word: 'cookie', syllables: 2, split: ['cook', 'ie'] }
//   ],
//   medium: [
//     { word: 'elephant', syllables: 3, split: ['el', 'e', 'phant'] },
//     { word: 'computer', syllables: 3, split: ['com', 'pu', 'ter'] },
//     { word: 'umbrella', syllables: 3, split: ['um', 'brel', 'la'] },
//     { word: 'giraffe', syllables: 2, split: ['gi', 'raffe'] },
//     { word: 'vacation', syllables: 3, split: ['va', 'ca', 'tion'] }
//   ],
//   hard: [
//     { word: 'helicopter', syllables: 4, split: ['hel', 'i', 'cop', 'ter'] },
//     { word: 'mathematics', syllables: 4, split: ['math', 'e', 'mat', 'ics'] },
//     { word: 'encyclopedia', syllables: 6, split: ['en', 'cy', 'clo', 'pe', 'di', 'a'] },
//     { word: 'refrigerator', syllables: 5, split: ['re', 'fri', 'ge', 'ra', 'tor'] },
//     { word: 'architecture', syllables: 4, split: ['ar', 'chi', 'tec', 'ture'] }
//   ]
// };

export default function SyllableTapGame() {
  const [difficulty, setDifficulty] = useState('easy');
  const [wordPool, setWordPool] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [taps, setTaps] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isFirstWord, setIsFirstWord] = useState(true);

useEffect(() => {
    fetchWords(difficulty);
  }, []);

  const fetchWords = async (level) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/syllable-game/${level}`);
      const words = res.data;
      setDifficulty(level);
      setUsedWords([]);
      setWordPool(words);
      setGameComplete(false);
      setScore(0);
      setIsFirstWord(true);
      pickNewWord(words, []);
    } catch (err) {
      console.error('Error fetching syllable game questions:', err);
    }
  };

  const pickNewWord = (availableWords, used) => {
    const unusedWords = availableWords.filter(
      (w) => !used.some((usedWord) => usedWord.word === w.word)
    );

    if (unusedWords.length === 0) {
      setCurrentWord(null);
      setGameComplete(true);
      // submitScore();
      return;
    }

    const random = unusedWords[Math.floor(Math.random() * unusedWords.length)];
    setCurrentWord(random);
    setUsedWords([...used, random]);
    setTaps(0);
    setFeedback('');
  };

  // const submitScore = async () => {
  //   try {
  //     await axios.post('http://localhost:5000/api/scores', {
  //       score,
  //       difficulty
  //     });
  //     console.log('🎯 Score submitted successfully');
  //   } catch (err) {
  //     console.error('❌ Failed to submit score:', err);
  //   }
  // };
const handleDifficultyChange = (e) => {
    fetchWords(e.target.value);
  };

  const handleTap = () => {
    if (feedback) return;
    setTaps((prev) => prev + 1);
  };

  const handleSubmit = () => {
    if (!currentWord) return;
    if (taps === currentWord.syllables) {
      setFeedback('✅ Great job!');
      setScore((prev) => prev + 20);
    } else {
      setFeedback(`❌ Oops! It has ${currentWord.syllables} syllables.`);
    }
  };

  const nextWord = () => {
    setIsFirstWord(false);
    pickNewWord(wordPool, usedWords);
  };

  const repeatGame = () => {
    fetchWords(difficulty);
  };


  useEffect(() => {
    fetchWords(difficulty);
  }, []);


  return (
    <div className="syllable-tap-game">
      <h2 className="game-title"> Syllable Tap Game</h2>

      <div className="difficulty-select">
        <label>Difficulty: </label>
        <select value={difficulty} onChange={handleDifficultyChange}>
          <option value="easy">🟢Easy </option>
          <option value="medium">🟡Medium </option>
          <option value="hard">🔴Hard </option>
        </select>
      </div>

      {currentWord ? (
        <>
          <p className="current-word-display">{currentWord.word}</p>
          {isFirstWord && (
  <p className="syllable-split-display">
    {currentWord.split.map((syllable, idx) => (
      <span key={idx} className="syllable">{syllable}</span>
    ))}
  </p>
)}

          <button onClick={handleTap} className="tap-button">Tap</button>
          <p className="tap-count">Taps: {taps}</p>

          {!feedback && taps > 0 && (
            <button onClick={handleSubmit} className="submit-button">Submit</button>
          )}

          <p className={`feedback-message ${feedback.startsWith('✅') ? 'correct' : feedback.startsWith('❌') ? 'wrong' : ''}`}>
            {feedback}
          </p>

          {feedback && (
            <button onClick={nextWord} className="next-button">Next Word</button>
          )}
        </>
      ) : gameComplete ? (
        <div className="game-over-message">
          <p> You completed all words in <strong>{difficulty}</strong> mode!</p>
          <p> Your score: {score}/{wordPool.length*20}</p>
          <button onClick={repeatGame} className="repeat-game-button">🔁 Repeat All Words</button>
        </div>
      ) : (
        <p className="loading-message">Loading...</p>
      )}
    </div>
  );
}