import React, { useState } from 'react';
import SingleLetterSearchBar from './SingleLetterSearchBar';
import LetterBox from './LetterBox';
import './App.css';

const noose = process.env.PUBLIC_URL + '/noose.png';
const upperbody = process.env.PUBLIC_URL + '/upperbody.png';
const oneArm = process.env.PUBLIC_URL + '/1Arm.png';
const bothArms = process.env.PUBLIC_URL + '/bothArms.png';
const oneLeg = process.env.PUBLIC_URL + '/1Leg.png';
const upperandlowerbody = process.env.PUBLIC_URL + '/upperandlowerbody.png';
const dead = process.env.PUBLIC_URL + '/Dead.png';






const HangmanGame = () => {
  const words = ['react', 'docker', 'compose', 'mysql', 'hangman'];
  const [selectedWord, setSelectedWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrongGuesses = 6;

  const [username, setUsername] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [winPercentage, setWinPercentage] = useState(null);

  // Updated images in correct order
  const hangmanImages = [noose, upperbody, upperandlowerbody, oneArm, bothArms, oneLeg, dead];

  const handleLetterGuess = (letter) => {
    if (guessedLetters.includes(letter)) {
      return;
    }
    setGuessedLetters([...guessedLetters, letter]);

    if (!selectedWord.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);
    }
  };

  const isWordGuessed = () => {
    return selectedWord.split('').every(letter => guessedLetters.includes(letter));
  };

  const submitResult = async (result) => {
    try {
      await fetch('http://localhost:5000/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, result })
      });
      fetchWinPercentage();
    } catch (error) {
      console.error('Error submitting result:', error);
    }
  };

  const fetchWinPercentage = async () => {
    try {
      const response = await fetch(`http://localhost:5000/results/stats/${username}`);
      const data = await response.json();
      setWinPercentage(data.winPercentage);
    } catch (error) {
      console.error('Error fetching win percentage:', error);
    }
  };

  const resetGame = () => {
    setSelectedWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
    setWrongGuesses(0);
  };

  if (!gameStarted) {
    return (
      <div className="center-screen">
        <div className="login-card">
          <h2>Enter Your Username</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="input-box"
          />
          <br />
          <button
            onClick={() => {
              if (username.trim() !== '') {
                setGameStarted(true);
              } else {
                alert('Please enter a username!');
              }
            }}
            className="start-button"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (wrongGuesses >= maxWrongGuesses) {
    setTimeout(() => {
      submitResult('loss');
      alert(`You lost! The word was "${selectedWord}".`);
      resetGame();
    }, 100);
  }

  if (isWordGuessed()) {
    setTimeout(() => {
      submitResult('win');
      alert('Congratulations! You guessed the word!');
      resetGame();
    }, 100);
  }

  return (
    <div className="game-container">
      <h1 className="title">Hangman Game</h1>
      
      {/* Hangman Image */}
      <img 
        src={hangmanImages[wrongGuesses]} 
        alt={`Hangman stage ${wrongGuesses}`} 
        className="hangman-image"
      />

      {/* Word display */}
      <div className="word-container">
        {selectedWord.split('').map((letter, index) => (
          <LetterBox
            key={index}
            letter={letter}
            isVisible={guessedLetters.includes(letter)}
          />
        ))}
      </div>

      {/* Search bar */}
      <SingleLetterSearchBar onSearch={handleLetterGuess} />
      
      {/* Wrong guesses count */}
      <p className="wrong-guess-text">Wrong Guesses: {wrongGuesses} / {maxWrongGuesses}</p>

      {/* Win Percentage */}
      {winPercentage !== null && (
        <h3>Your Win Percentage: {winPercentage}%</h3>
      )}
    </div>
  );
};

export default HangmanGame;
