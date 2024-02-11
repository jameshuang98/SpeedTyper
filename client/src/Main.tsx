import React, { useState, useEffect, useRef, createRef } from 'react';
import { GameStates, InputWord } from 'constants/types';

import Appbar from 'components/Appbar/Appbar';
import GameStateButton from 'components/Button/GameStateButton';

import './Main.scss';
import samples from './constants/samples'
import isValidKey from './helpers';
import Postgame from 'components/Postgame/Postgame';
import TextDisplay from 'components/TextDisplay/TextDisplay';
import Countdown from 'components/Countdown/Countdown';

// Constants
const timeLimit = 60;

const Main: React.FC = () => {

    const [countdown, setCountdown] = useState<number>(timeLimit);
    const [gameState, setGameState] = useState<GameStates>('pregame');

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

    useEffect(() => {
        reset();
    }, []);

    useEffect(() => {
        // for (const ref of wordRefs) {
        //     console.log(ref.current.offsetTop)
        // }
        getLineIndexes();
    }, [wordRefs]);

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

    const reset = () => {
        // generate new words
        const sampleWords = generateWords();
        setWords(sampleWords);

        // add a ref for each word
        setWordRefs((refs) =>
            Array(sampleWords.length)
                .fill(undefined)
                .map((_, i) => refs[i] || createRef()),
        );

        // reset state
        setGameState("pregame");
        setCurrWordIndex(0);
        setInput("");
        setInputWords([]);
        setCurrWordInput("");
        setCorrectWords(0);
        setIncorrectWords(0);
        setCountdown(timeLimit);
    }

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const changeGameState = (state: GameStates): void => {
        console.log("state", state)
        console.log("interval", intervalRef.current)
        // start the game
        if (gameState !== "playing") {
            setGameState("playing");

            intervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 0) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        setGameState("postgame");
                        return timeLimit;
                    } else {
                        return prev - 1;
                    }
                });
            }, 1000);
        }

        // pause the game
        else if (state === "paused" && intervalRef.current) {
            console.log("pause")
            clearInterval(intervalRef.current);
            setGameState("paused");
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
            // Check if user is going to next line
            if ((currWordIndex + 1) === lineIndexes[currLineIndex + 1]) {
                console.log('lineIndexes[currLineIndex + 1]', lineIndexes[currLineIndex + 1])
                console.log('currWordIndex + 1', currWordIndex + 1)
                setCurrLineIndex(prev => prev + 1)
            }

            checkWordSpelling();
            setCurrWordInput("");
            setCurrWordIndex(prev => prev + 1);
            setInput(prev => prev + key);

            // Handle user going to previous characters
        } else if (key === 'Backspace') {
            // Handle user going to previous word
            if (input.slice(-1) === " ") {
                // Check if user is going to previous line
                if ((currWordIndex - 1) < lineIndexes[currLineIndex]) {
                    setCurrLineIndex(prev => prev - 1)
                }

                // Handle updating correct/incorrect count after going to previous word
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
        if (wordIdx > currWordIndex) {
            return "";
        }

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

            {
                true && (
                    <>
                        <Countdown countdown={countdown} />

                        <TextDisplay
                            gameState={gameState}
                            words={words}
                            getWordClass={getWordClass}
                            wordRefs={wordRefs}
                            lineIndexes={lineIndexes}
                            currLineIndex={currLineIndex}
                            input={input}
                            handleInput={handleInput}
                        />

                        {/* <div className="main-container">
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
                            </div>

                            <div className="input-container">
                                <input disabled={gameState !== 'playing'} ref={textInput} type="text" onKeyDown={handleInput} value={input} />
                            </div>
                        </div> */}
                    </>
                )
            }

            <GameStateButton
                gameState={gameState}
                changeGameState={changeGameState}
                reset={reset}
            />

            {
                gameState === 'postgame' && (
                    <Postgame
                        correctWords={correctWords}
                        incorrectWords={incorrectWords}
                        characters={input.length}
                        reset={reset}
                    />
                )
            }
        </div>
    );
}

export default Main;