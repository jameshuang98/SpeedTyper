import React from 'react'
import { Paper, Divider } from '@mui/material'

type Props = {
  correctWords: number;
  incorrectWords: number;
  characters: number;
}

function ResultCard({ correctWords, incorrectWords, characters }: Props) {
  const accuracy = Math.round((correctWords / (correctWords + incorrectWords)) * 100);

  return (
    <Paper elevation={3} >
      <div>
        WPM: {correctWords}
      </div>
      <Divider />
      <div>
        Accuracy: {accuracy}%
      </div>
      <div>
        Typos: {incorrectWords}
      </div>
      <div>
        Characters: {characters}
      </div>

    </Paper>
  )
}

export default ResultCard