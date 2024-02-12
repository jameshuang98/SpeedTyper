import { GameStates } from 'constants/types'
import React, { useEffect, useRef } from 'react'

type Props = {
    gameState: GameStates;
    words: Array<string>;
    getWordClass: Function;
    wordRefs: Array<any>;
    lineIndexes: Array<number>;
    currLineIndex: number;
    input: string;
    handleInput: React.KeyboardEventHandler<HTMLInputElement>
}

function TextDisplay(props: Props) {
    const { gameState, words, getWordClass, wordRefs, lineIndexes, currLineIndex, input, handleInput } = props;
    const textInput = useRef<HTMLInputElement>(null);

    // focus the input element if the game starts
    useEffect(() => {
        if (gameState === 'playing' && textInput.current) {
            textInput.current.focus();
        }
    }, [gameState]);

    let formattedWords = words.map((word, i) => (
        <span key={i}>
            <span className={getWordClass(i)} ref={wordRefs[i]}>
                {word}
            </span>
            <span> </span>
        </span>
    ));

    if (gameState === "playing") {
        formattedWords = formattedWords.slice(lineIndexes[currLineIndex]);
    }

    return (
        <div className="main-container">
            <div className="output-container">
                <div className="text sample" style={gameState === "postgame" ? { overflowY: "scroll" } : {}}>
                    {formattedWords}
                </div>
            </div>
            {gameState !== "postgame" && (
                <div className="input-container">
                    <input disabled={gameState !== 'playing'} ref={textInput} type="text" onKeyDown={handleInput} value={input} />
                </div>
            )}
        </div>
    )
}

export default TextDisplay