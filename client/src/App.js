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

  generateWords() {
    return new Array(wordsDisplay).fill(null).map(() => randomWords())
  }
  

  return (
    <div className="App">

    </div>
  );
}

export default App;
