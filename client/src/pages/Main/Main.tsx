import React, { useState, useEffect, useRef, createRef } from 'react';
import { Typography } from '@mui/material';

import { GameState, InputWord } from 'constants/types';
import samples from '../../constants/samples'
import { isValidKey } from '../../helpers';
import GameStateButton from 'components/Button/GameStateButton';
import Postgame from 'components/Postgame/Postgame';
import TextDisplay from 'components/TextDisplay/TextDisplay';
import Countdown from 'components/Countdown/Countdown';

import classes from './Main.module.scss';
import { postScore } from 'api/scores';
import { useAuth } from 'contexts/AuthContext';

// Constants
const timeLimit = 60;

const Main: React.FC = () => {
    const [countdown, setCountdown] = useState<number>(timeLimit);
    const [gameState, setGameState] = useState<GameState>('pregame');
    const [openModal, setOpenModal] = useState(false);

    const [words, setWords] = useState<string[]>([]);
    const [currWordIndex, setCurrWordIndex] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    const [inputWords, setInputWords] = useState<Array<InputWord>>([]);
    const [currWordInput, setCurrWordInput] = useState<string>('');

    const [correctWords, setCorrectWords] = useState<number>(0);
    const [incorrectWords, setIncorrectWords] = useState<number>(0);

    const [wordRefs, setWordRefs] = useState<Array<any>>([]);
    const [lineIndexes, setLineIndexes] = useState<Array<number>>([]);
    const [currLineIndex, setCurrLineIndex] = useState<number>(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { user } = useAuth();
    const hasSubmittedResult = useRef<boolean>(false);  // Using useRef to avoid re-renders

    useEffect(() => {
        reset();
    }, []);

    useEffect(() => {
        getLineIndexes();
    }, [wordRefs]);

    useEffect(() => {
        if (gameState === 'playing' && countdown === 0) {
            setGameState('postgame');
            setOpenModal(true);
            handlePostGame();
        }
    }, [countdown, gameState]);

    useEffect(() => {
        if (gameState === 'playing') {
            intervalRef.current = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [gameState]);

    const generateWords = (): string[] => {
        const randomIdx = Math.floor(Math.random() * (samples.length));
        return samples[randomIdx].split(" ");
    };

    // Get the index of the first word of each line
    const getLineIndexes = () => {
        let indexObj: { [key: number]: number } = {};
        for (const idx in wordRefs) {
            const offsetTop: number = wordRefs[idx]?.current?.offsetTop;
            if (offsetTop && !indexObj.hasOwnProperty(offsetTop)) {
                indexObj[offsetTop] = parseInt(idx);
            }
        }
        const indexes = Object.values(indexObj);

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
        setCurrLineIndex(0);
        setInput("");
        setInputWords([]);
        setCurrWordInput("");
        setCorrectWords(0);
        setIncorrectWords(0);
        setCountdown(timeLimit);
    }

    const submitResult = async (): Promise<void> => {
        const score = {
            userId: user!.id,
            correctWords: correctWords,
            incorrectWords: incorrectWords,
            characters: input.length
        }
        try {
            const response = await postScore(score);
            console.log("response score", response)
        } catch (err: any) {
            console.log(err.response.data);
        }
    }

    const handlePostGame = async () => {
        if (user && !hasSubmittedResult.current) {  // Check if result has already been submitted
            hasSubmittedResult.current = true;       // Mark as submitted to prevent duplicate submissions
            await submitResult();
        }
    };

    const changeGameState = (state: GameState): void => {
        if (gameState !== 'playing' && state === 'playing') {
            setGameState('playing');
            hasSubmittedResult.current = false;  // Reset submission status when game starts
            setCountdown(timeLimit);
        } else if (state === 'paused') {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setGameState('paused');
        }
    };


    // Handle user input
    function handleInput({ key }: React.KeyboardEvent<HTMLInputElement>) {
        // Handle user not entering a valid key or entering multiple spaces
        if (!isValidKey(key) || (key === " " && input.slice(-1) === " ")) {
            return;
        }

        // Handle going to next word
        if (key === " ") {
            // Check if user is going to next line
            if ((currWordIndex + 1) === lineIndexes[currLineIndex + 1]) {
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
            return inputWords[wordIdx].isCorrect ? classes.pastWordCorrect : classes.pastWordIncorrect;
        }

        const wordToCompare = words[wordIdx];
        const isMatch = wordToCompare.startsWith(currWordInput.trim()) || wordToCompare === currWordInput.trim();
        return isMatch ? classes.correctSpelling : classes.incorrectSpelling;
    };

    // Calculating WPM based on gameState
    let WPM;
    switch (gameState) {
        case 'pregame':
            WPM = 0;
            break;
        case 'postgame':
            WPM = correctWords;
            break;
        default:
            WPM = timeLimit === countdown ? 0 : Math.floor((correctWords / (timeLimit - countdown)) * timeLimit);
    };

    return (
        <div className={classes.main}>
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
            <div className={classes.stats}>

                {!openModal &&
                    <>
                        <Typography variant="h5">WPM: {WPM}</Typography>
                        {
                            gameState === 'postgame' &&
                            (
                                <>
                                    <Typography variant="subtitle2">Accuracy: {Math.round((correctWords / (correctWords + incorrectWords)) * 100)}%</Typography>
                                    <Typography variant="subtitle2">Typos: {incorrectWords}</Typography>
                                    <Typography variant="subtitle2">Characters: {input.length}</Typography>
                                </>
                            )
                        }
                    </>
                }
            </div>
            {
                gameState === 'postgame' && (
                    <Postgame
                        correctWords={correctWords}
                        incorrectWords={incorrectWords}
                        characters={input.length}
                        reset={reset}
                        open={openModal}
                        setOpen={setOpenModal}
                    />
                )
            }
            <GameStateButton
                gameState={gameState}
                changeGameState={changeGameState}
                reset={reset}
            />
        </div>
    );
}

export default Main;