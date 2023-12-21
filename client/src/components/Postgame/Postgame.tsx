import React from 'react'
import ResultCard from './ResultCard'

type Props = {
    correctWords: number;
    incorrectWords: number;
    characters: number;
}

function Postgame({ correctWords, incorrectWords, characters }: Props) {

    return (
        <div className='main-container'>
            <ResultCard
                correctWords={correctWords}
                incorrectWords={incorrectWords}
                characters={characters}
            />
        </div>
    )
}

export default Postgame