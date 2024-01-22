import React, { MouseEventHandler } from 'react'
import ResultCard from './ResultCard'
import "./Postgame.scss"

type Props = {
    correctWords: number;
    incorrectWords: number;
    characters: number;
    reset: MouseEventHandler<HTMLButtonElement>;
}

function Postgame({ correctWords, incorrectWords, characters, reset }: Props) {

    return (
        <div className='postgame-container'>
            <ResultCard
                correctWords={correctWords}
                incorrectWords={incorrectWords}
                characters={characters}
                reset={reset}
            />
        </div>
    )
}

export default Postgame