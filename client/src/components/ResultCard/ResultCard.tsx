import React, { MouseEventHandler } from 'react'
import { Paper, Divider, IconButton, Button } from '@mui/material'
import "./ResultCard.scss"
import { RestartAlt } from '@mui/icons-material';

type Props = {
  correctWords: number;
  incorrectWords: number;
  characters: number;
  reset: MouseEventHandler<HTMLButtonElement>;
  checkResult: MouseEventHandler<HTMLButtonElement>;
  style: any;
}

function ResultCard(props: Props) {
  const { correctWords, incorrectWords, characters, reset, checkResult, style } = props;
  const accuracy = Math.round((correctWords / (correctWords + incorrectWords)) * 100);

  return (
    <Paper elevation={3} className='result-card' style={style}>
      <div className="header">
        Result
      </div>
      <div className="wpm">
        {correctWords} WPM
      </div>
      <Divider />
      <div className="stat">
        Accuracy: {accuracy}%
      </div>
      <div className="stat">
        Typos: {incorrectWords}
      </div>
      <div className="stat">
        Characters: {characters}
      </div>
      <div className="postgame-buttons">
        <IconButton aria-label="restart" size="small" className='icon-button' style={{ backgroundColor: "#0288d1" }} onClick={reset}>
          <RestartAlt fontSize="inherit" />
        </IconButton>
        <Button variant="contained" size="small" onClick={checkResult}>
          <p style={{ fontSize: ".7rem" }}>Check Result</p>
        </Button>
      </div>
    </Paper>
  )
}

export default ResultCard