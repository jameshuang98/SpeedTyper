import { GameStates, InputWord } from 'constants/types'
import React, { useEffect, useRef } from 'react'

type Props = {
    gameState: GameStates,
    words: Array<string>,
    getWordClass: Function,
    wordRefs: Array<any>,
    lineIndexes: Array<number>,
    currLineIndex: number,
    input: string,
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

    return (
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
            </div>

            <div className="input-container">
                <input disabled={gameState !== 'playing'} ref={textInput} type="text" onKeyDown={handleInput} value={input} />
            </div>
        </div>
    )
}

export default TextDisplay