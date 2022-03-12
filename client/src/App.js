import './App.css';
import { useState, useEffect } from 'react';

import randomWords from 'random-words'

const wordsDisplay = 200;
const timeLimit = 60;


function App() {

  const [words, setWords] = useState([])

  useEffect(() => {
    setWords(generateWords());
  }, [])

  function generateWords() {
    return new Array(wordsDisplay).fill(null).map(() => randomWords())
  }


  return (
    <div className="App">
      <div className="section">
        <div className="card">
          <div className="card-content">
            <div className="content">
              {words.map((word, i) => (
                <>
                  <span>
                    {word}
                  </span>
                  <span> </span>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
