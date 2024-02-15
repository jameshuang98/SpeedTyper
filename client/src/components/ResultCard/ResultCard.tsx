import React, { MouseEventHandler } from 'react'

import classes from "./ResultCard.module.scss"

import { Paper, Divider, IconButton, Button } from '@mui/material'
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
    <Paper elevation={3} className={classes.card} style={style}>
      <div className={classes.header}>
        Result
      </div>
      <div className={classes.wpm}>
        {correctWords} WPM
      </div>
      <Divider />
      <div className={classes.stats}>
        Accuracy: {accuracy}%
      </div>
      <div className={classes.stats}>
        Typos: {incorrectWords}
      </div>
      <div className={classes.stats}>
        Characters: {characters}
      </div>
      <div className={classes.buttons}>
        <IconButton aria-label="restart" size="small" style={{ backgroundColor: "#0288d1" }} onClick={reset}>
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