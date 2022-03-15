import './App.css';
import { useState, useEffect } from 'react';

import randomWords from 'random-words'

const wordsDisplay = 200;
const timeLimit = 60;


function App() {

  const [words, setWords] = useState([]);
  const [countdown, setCountdown] = useState(timeLimit);
  const [input, setInput] = useState('');
  const [currWordIndex, setCurrWordIndex] = useState(0);

  useEffect(() => {
    setWords(generateWords());
  }, [])

  function generateWords() {
    return new Array(wordsDisplay).fill(null).map(() => randomWords())
  }

  function start() {
    let interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 0) {
          clearInterval(interval);
        } else {
          return prev - 1
        }
      })

    }, 1000)
  }

  function handleInput({keyCode}) {
    // check if user presses spacebar
    if (keyCode === 32) {
      checkMatch();
      setInput('');
      setCurrWordIndex(currWordIndex + 1)
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const matchBool = wordToCompare === input.trim();
    console.log({matchBool})
  }

  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countdown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input type="text" className="input" onKeyDown={handleInput} value={input} onChange={(e) => setInput(e.target.value)}/>
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
                      <span key={index}>{char}</span>
                    ))}
                  </span>
                  <span> </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
