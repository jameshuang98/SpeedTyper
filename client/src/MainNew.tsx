import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';

import Appbar from 'components/Appbar/Appbar';

import './Main.scss';
import samples from './constants/samples'
import isValidKey from './helpers';

// Constants
const linesOfText = 2;
const timeLimit = 600000;

type gameStates = "pregame" | "playing" | "paused" | "postgame";

interface InputWord {
    idx: number;
    word: string;
    isCorrect: boolean;
}

const MainNew: React.FC = () => {

    const [countdown, setCountdown] = useState<number>(timeLimit);
    const [gameState, setGameState] = useState<gameStates>('pregame');

    const [words, setWords] = useState<string[]>([]);
    const [currWordIndex, setCurrWordIndex] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    const [inputWords, setInputWords] = useState<Array<InputWord>>([]);
    const [currWordInput, setCurrWordInput] = useState<string>('');

    const [correctWords, setCorrectWords] = useState<number>(0);
    const [incorrectWords, setIncorrectWords] = useState<number>(0);

    const textInput = useRef<HTMLInputElement>(null);

    // generate random words
    useEffect(() => {
        generateWords();
    }, []);

    // focus the input element if the game starts
    useEffect(() => {
        if (gameState === 'playing' && textInput.current) {
            textInput.current.focus();
        }
    }, [gameState]);

    const generateWords = () => {
        const randomIdx = Math.floor(Math.random() * (samples.length));
        const sampleWords = samples[randomIdx].split(" ");
        setWords(sampleWords);
    };

    function start() {
        // reset state if user is playing again
        if (gameState === 'postgame') {
            generateWords();
            setCurrWordIndex(0);
            setInput("");
            setInputWords([]);
            setCurrWordInput("");
            setCorrectWords(0);
            setIncorrectWords(0);
        }

        // set gameState and start timer
        if (gameState !== 'playing') {
            setGameState('playing');
            let interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 0) {
                        clearInterval(interval);
                        setGameState('postgame');
                        return timeLimit;
                    } else {
                        return prev - 1;
                    }
                })
            }, 1000)
        }
    };

    // Handle user input
    function handleInput({ key }: React.KeyboardEvent<HTMLInputElement>) {
        // Handle user not entering a valid key or entering multiple spaces
        if (!isValidKey(key) || (key === " " && input.slice(-1) === " ")) {
            return;
        }
        // console.log('key', key)

        // Handle going to next word
        if (key === " ") {
            checkWordSpelling();
            setCurrWordInput("");
            setCurrWordIndex(prev => prev + 1);
            setInput(prev => prev + key);

            // Handle user going to previous characters
        } else if (key === 'Backspace') {
            // Handle user going to previous word
            if (input.slice(-1) === " ") {
                if (inputWords.slice(-1)[0].isCorrect) {
                    setCorrectWords(prev => prev - 1);
                } else {
                    setIncorrectWords(prev => prev - 1);
                }
                setCurrWordIndex(prev => prev - 1);
                setCurrWordInput(inputWords.slice(-1)[0].word)
                setInputWords(prev => prev.slice(0, -1))
            } else {
                setCurrWordInput(prev => prev.slice(0, -1));
            }
            setInput(prev => prev.slice(0, -1));

            //Handle user entering normal characters
        } else {
            setCurrWordInput(prev => prev + key);
            setInput(prev => prev + key);
        }
    };

    // Compares correct spelling of word to user-typed word
    const checkWordSpelling = (): void => {
        const wordToCompare = words[currWordIndex];
        const isMatch = wordToCompare === currWordInput.trim();
        if (isMatch) {
            setCorrectWords(prev => prev + 1);
        } else {
            setIncorrectWords(prev => prev + 1);
        }
        setInputWords(prev =>
            [...prev,
            {
                word: currWordInput.trim(),
                idx: currWordIndex,
                isCorrect: isMatch
            }])
    };

    // highlight background of letter depending on if the character is correct or not
    const getWordClass = (wordIdx: number): string => {
        if (wordIdx > currWordIndex || gameState !== "playing") {
            return "";
        }

        // TODO implement state to store past correct/incorrect words
        if (wordIdx < currWordIndex) {
            return inputWords[wordIdx].isCorrect ? "past-word-correct" : "past-word-incorrect";
        }

        const wordToCompare = words[wordIdx];
        const isMatch = wordToCompare.startsWith(currWordInput.trim()) || wordToCompare === currWordInput.trim();
        if (isMatch) {
            return "correct-spelling"
        } else {
            return "incorrect-spelling"
        }

    }

    return (
        <div className="main">
            <Appbar />

            <div className="countdown">
                <h2>{countdown}</h2>
            </div>

            <div className="main-container">
                <div className="output-container">
                    <div className="text sample">
                        {words.map((word, i) => (
                            <span key={i}>
                                <span className={getWordClass(i)}>{word}</span>
                                <span> </span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="input-container">
                    <input disabled={gameState !== 'playing'} ref={textInput} type="text" onKeyDown={handleInput} value={input} />
                </div>

                <div className="button-container">
                    <Button variant="contained" color="success" onClick={start}>
                        Start
                    </Button>
                </div>

                <div>
                    <div>Correct Words:</div>
                    {correctWords}
                </div>

                <div>
                    <div>Incorrect Words:</div>
                    {incorrectWords}
                </div>

                {/* {
                    gameState === 'postgame' && (
                        <div className="section">
                            <div className="columns">
                                <div className="column has-text-centered">
                                    <p className="has-text-light is-size-5">WPM:</p>
                                    <p className="has-text-light is-size-1">{correct}</p>
                                </div>
                                <div className="column has-text-centered">
                                    <p className="has-text-light is-size-5">Accuracy:</p>
                                    <p className="has-text-light is-size-1">{Math.round((correct / (correct + incorrect)) * 100)}%</p>
                                </div>
                            </div>
                        </div>
                    )
                } */}
            </div>
        </div>
    );
}

export default MainNew;