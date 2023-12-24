import React, { useState, useEffect, useRef, RefObject, createRef } from 'react';
import { Button } from '@mui/material';

import Appbar from 'components/Appbar/Appbar';

import './Main.scss';
import samples from './constants/samples'
import isValidKey from './helpers';
import Postgame from 'components/Postgame/Postgame';

// Constants
const timeLimit = 60;

type gameStates = "pregame" | "playing" | "paused" | "postgame";

interface InputWord {
    idx: number;
    word: string;
    isCorrect: boolean;
}

type WordProps = {
    displayWords: Array<string>;
    minIdx: number;
    indexes: Array<number>;
}

const Main: React.FC = () => {

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

    const [wordRefs, setWordRefs] = useState<Array<any>>([]);
    const [lineIndexes, setLineIndexes] = useState<Array<number>>([]);
    const [currLineIndex, setCurrLineIndex] = useState<number>(0);

    const WordList = ({ displayWords, minIdx, indexes }: WordProps) => {
        // Filter the words based on currLineIndex
        console.log('indexes[minIdx]', indexes[minIdx])
        return (
            <div className="text sample">
                {displayWords.map((word, i) => {
                    if (i >= indexes[minIdx]) {
                        return (
                            <span key={i}>
                                <span className={getWordClass(i)} ref={wordRefs[i]}>{word}</span>
                                <span> </span>
                            </span>
                        )
                    }
                })}
            </div>
        );
    };


    useEffect(() => {
        // generate random words
        const sampleWords = generateWords();
        setWords(sampleWords);

        // add a ref for each word
        setWordRefs((refs) =>
            Array(sampleWords.length)
                .fill(undefined)
                .map((_, i) => refs[i] || createRef()),
        );

    }, []);

    useEffect(() => {
        // for (const ref of wordRefs) {
        //     console.log(ref.current.offsetTop)
        // }
        getLineIndexes();
    }, [wordRefs]);

    // focus the input element if the game starts
    useEffect(() => {
        if (gameState === 'playing' && textInput.current) {
            textInput.current.focus();
        }
    }, [gameState]);

    const generateWords = (): string[] => {
        const randomIdx = Math.floor(Math.random() * (samples.length));
        return samples[randomIdx].split(" ");
    };

    // Get the index of the first word of each line
    const getLineIndexes = () => {
        let indexObj: { [key: number]: number } = {};
        console.log('wordRefs', wordRefs)
        for (const idx in wordRefs) {
            const offsetTop: number = wordRefs[idx]?.current?.offsetTop;
            if (offsetTop && !indexObj.hasOwnProperty(offsetTop)) {
                indexObj[offsetTop] = parseInt(idx);
            }
        }
        const indexes = Object.values(indexObj);
        console.log("indexes getLineIndexes", indexes)

        if (indexes.length > 0) {
            setLineIndexes(indexes)
        } else {
            setLineIndexes([0]);
        }
    }


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
            if ((currWordIndex + 1) === lineIndexes[currLineIndex + 1]) {
                console.log('lineIndexes[currLineIndex + 1]', lineIndexes[currLineIndex + 1])
                console.log('currWordIndex + 1', currWordIndex + 1)
                setCurrLineIndex(prev => prev + 1)
            }
            checkWordSpelling();
            setCurrWordInput("");
            setCurrWordIndex(prev => prev + 1);
            setInput(prev => prev + key);
            // Check if user is going to next line

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

    // Change word class depending on if the spelling is correct or not
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
                                <span className={getWordClass(i)} ref={wordRefs[i]}>
                                    {word}
                                </span>
                                <span> </span>
                            </span>
                        )).slice(lineIndexes[currLineIndex])}
                    </div>
                    {/* <WordList displayWords={words} minIdx={currLineIndex} indexes={lineIndexes} /> */}
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

                {
                    gameState === 'postgame' && (
                        <Postgame
                            correctWords={correctWords}
                            incorrectWords={incorrectWords}
                            characters={input.length}
                        />

                    )
                }
            </div>
        </div>
    );
}

export default Main;