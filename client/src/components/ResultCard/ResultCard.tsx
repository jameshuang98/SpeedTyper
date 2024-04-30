import React, { ReactNode } from 'react'

import classes from "./ResultCard.module.scss"

import { Paper, Divider } from '@mui/material'

type Props = {
  title: string;
  correctWords: number;
  incorrectWords: number;
  characters: number;
  buttons: ReactNode | null;
}

function ResultCard(props: Props) {
  const { title, correctWords, incorrectWords, characters, buttons } = props;
  const accuracy = Math.round((correctWords / (correctWords + incorrectWords)) * 100);

  return (
    <Paper elevation={3} className={classes.card}>
      <div className={classes.header}>
        {title}
      </div>
      <div className={classes.wpm}>
        {correctWords} WPM
      </div>
      <Divider />
      <div className={classes.content}>
        <div className={classes.stat}>
          <p>Accuracy: {accuracy}%</p>
          <p>Typos: {incorrectWords}</p>
          <p>Characters: {characters}</p>
        </div>
          <div className={classes.buttons}>
            {buttons}
          </div>
      </div>
    </Paper>
  )
}

export default ResultCard