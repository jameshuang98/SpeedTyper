import React, { MouseEventHandler } from 'react'
import { Button, IconButton, Typography } from '@mui/material';
import { RestartAlt, PlayArrow, Pause } from '@mui/icons-material';

import { GameState } from '../../constants/types';

import classes from "./GameStateButton.module.scss";

type Props = {
  gameState: GameState
  changeGameState: Function
  reset: MouseEventHandler<HTMLButtonElement>
}

const GameStateButton = (props: Props) => {
  const { gameState, changeGameState, reset } = props;

  return (
    <>
      {
        gameState === 'pregame' && (
          <div className={classes.buttonContainer}>
            <IconButton aria-label="play" size="large" className={classes.iconButton} style={{ backgroundColor: gameState === 'pregame' ? "#7cb342" : "#26a69a" }} onClick={() => changeGameState("playing")}>
              <PlayArrow fontSize="inherit" />
            </IconButton>
            <IconButton aria-label="restart" size="large" className={classes.iconButton} style={{ backgroundColor: "#0288d1" }} onClick={reset}>
              <RestartAlt fontSize="inherit" />
            </IconButton>
          </div>
        )
      }

      {
        gameState === 'playing' && (
          <div className={classes.buttonContainer}>
            <IconButton aria-label="play" size="large" className={classes.iconButton} style={{ backgroundColor: "#f44336" }} onClick={() => changeGameState("paused")}>
              <Pause fontSize="inherit" />
            </IconButton>
          </div>
        )
      }

      {
        gameState === 'paused' && (
          <div className={classes.columnContainer}>
            <div className={classes.buttonContainer}>
              <IconButton aria-label="play" size="large" className={classes.iconButton} style={{ backgroundColor: "#26a69a" }} onClick={() => changeGameState("playing")}>
                <PlayArrow fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="restart" size="large" className={classes.iconButton} style={{ backgroundColor: "#0288d1" }} onClick={reset}>
                <RestartAlt fontSize="inherit" />
              </IconButton>
            </div>
            <div className={classes.paused}>
              Paused
            </div>
          </div>
        )
      }

      {
        gameState === 'postgame' && (
          <div className={classes.buttonContainer}>
            <Button variant="contained" size="large" onClick={reset} startIcon={<RestartAlt/>}>
              <Typography variant="subtitle2">Try again</Typography>
            </Button>
          </div>
        )
      }
    </>
  );
}

export default GameStateButton