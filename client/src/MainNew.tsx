import './Main.scss';
import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import samples from './constants/samples'
import isValidKey from './helpers';

// Constants
const linesOfText = 2;
const timeLimit = 60;

type gameStates = "pregame" | "playing" | "postgame";

const MainNew: React.FC = () => {

    const [countdown, setCountdown] = useState<number>(timeLimit);
    const [status, setStatus] = useState<gameStates>('pregame');

    const [words, setWords] = useState<string[]>([]);
    const [currWordIndex, setCurrWordIndex] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    const [currWordInput, setCurrWordInput] = useState<string>('');

    const [correctWords, setCorrectWords] = useState(0);
    const [incorrectWords, setIncorrectWords] = useState(0);

    const textInput = useRef<HTMLInputElement>(null);

    // generate random words
    useEffect(() => {
        const randomIdx = Math.floor(Math.random() * (samples.length));
        const sampleWords = samples[randomIdx].split(" ");
        setWords(sampleWords);
    }, []);

    // focus the input element if the game starts
    useEffect(() => {
        if (status === 'playing' && textInput.current) {
            textInput.current.focus();
        }
    }, [status]);

    function start() {
        // reset state if user is playing again
        if (status === 'postgame') {
            setCurrWordIndex(0);
            setCurrWordInput("");

            setCorrectWords(0);
            setIncorrectWords(0);
        }

        // set status and start timer
        if (status !== 'playing') {
            setStatus('playing');
            let interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 0) {
                        clearInterval(interval);
                        setStatus('postgame');
                        setInput('');
                        return timeLimit;
                    } else {
                        return prev - 1;
                    }
                })
            }, 1000)
        }
    };

    // handles user input
    function handleInput({ key }: React.KeyboardEvent<HTMLInputElement>) {
        if (!isValidKey(key)) {
            console.log("invalid key")
            return;
        }
        // console.log('key', key)

        // TODO handle multiple spaces at same time
        if (key === ' ') {
            checkWordSpelling();
            setCurrWordInput("");
            setCurrWordIndex(prev => prev + 1);
            setInput(prev => prev + key);
            console.log('space');
            // TODO update currWordIndex if we go to previous word
        } else if (key === 'Backspace') {
            setCurrWordInput(prev => prev.slice(0, -1));
            setInput(prev => prev.slice(0, -1));
            console.log('backspace');
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
    };

    // highlight background of letter depending on if the character is correct or not
    // const getWordClass = (): void => {
    //     const wordToCompare = words[currWordIndex];
    //     const isMatch = wordToCompare === currWordInput.trim();
    // }

    return (
        <div className="main">
            <div className="appbar">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="body1" component="div" className="appbar">
                            SpeedTyper
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <div className="countdown">
                <h2>{countdown}</h2>
            </div>

            <div className="main-container">
                <div className="output-container">
                    <div className="text sample">
                        {words.map((word, i) => (
                            <span key={i}>
                                {word}
                                <span> </span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="input-container">
                    <input disabled={status !== 'playing'} ref={textInput} type="text" onKeyDown={handleInput} value={input} />
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
                    status === 'postgame' && (
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