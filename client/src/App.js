import './App.css';
import { useState, useEffect, useRef } from 'react';

import randomWords from 'random-words'

const wordsDisplay = 200;
const timeLimit = 60;


function App() {

  const [words, setWords] = useState([]);
  const [countdown, setCountdown] = useState(timeLimit);
  const [input, setInput] = useState('');
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currChar, setCurrChar] = useState('');
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState('pregame');
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, [])

  useEffect(() => {
    if (status === 'playing') {
      textInput.current.focus();
    }
  }, [status])

  function generateWords() {
    return new Array(wordsDisplay).fill(null).map(() => randomWords())
  }

  function start() {
    if (status === 'finished') {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar('');
    }
    if (status !== 'playing') {
      setStatus('playing')
      let interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 0) {
            clearInterval(interval);
            setStatus('finished');
            setInput('');
            return timeLimit;
          } else {
            return prev - 1
          }
        })
      }, 1000)
    }
  }

  function handleInput({ keyCode, key }) {
    // check if user presses spacebar
    if (keyCode === 32) {
      checkMatch();
      setInput('');
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar('');
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }

  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const isMatch = wordToCompare === input.trim();
    if (isMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1)
    }
  }

  function getCharClass(wordIndex, charIndex, char) {
    if (currCharIndex && wordIndex === currWordIndex && charIndex === currCharIndex && status !== 'finished') {
      if (char === currChar) {
        return 'has-background-success';
      }else {
        return 'has-background-danger';
      }
    } else if (wordIndex === currWordIndex && currCharIndex >= words[currWordIndex].length) {
      return 'has-background-danger'
    } else {
      return '';
    }
  }

  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countdown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input disabled={status !== 'playing'} ref={textInput} type="text" className="input" onKeyDown={handleInput} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <div className="section">
        <button className="button is-info is-fullwidth" onClick={start}>
          Start
        </button>
      </div>
      <div className="section">
        <div className="card">
          <div className="card-content">
            <div className="content">
              {words.map((word, i) => (
                <span key={i}>
                  <span>
                    {word.split("").map((char, index) => (
                      <span key={index} className={getCharClass(i, index, char)}>{char}</span>
                    ))}
                  </span>
                  <span> </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {status === 'finished' && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">WPM:</p>
              <p className="has-text-primary is-size-1">{correct}</p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5">Accuracy:</p>
              <p className="has-text-info is-size-1">{Math.round((correct / (correct + incorrect)) * 100)} %</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
