import React, { MouseEventHandler } from 'react'
import { GameStates } from '../../constants/types';
import { Button, IconButton, Typography } from '@mui/material';
import { RestartAlt, PlayCircleFilled, PlayArrow, Pause } from '@mui/icons-material';

import "./GameStateButton.scss";


type Props = {
  gameState: GameStates
  changeGameState: Function
  reset: MouseEventHandler<HTMLButtonElement>
}

const GameStateButton = (props: Props) => {
  const { gameState, changeGameState, reset } = props;

  return (
    <>
      {
        gameState === 'pregame' && (
          <div className="button-container">
            <IconButton aria-label="play" size="large" className='icon-button' style={{ backgroundColor: gameState === 'pregame' ? "#7cb342" : "#26a69a" }} onClick={() => changeGameState("playing")}>
              <PlayArrow fontSize="inherit" />
            </IconButton>
            <IconButton aria-label="restart" size="large" className='icon-button' style={{ backgroundColor: "#0288d1" }} onClick={reset}>
              <RestartAlt fontSize="inherit" />
            </IconButton>
          </div>
        )
      }

      {
        gameState === 'playing' && (
          <div className="button-container">
            <IconButton aria-label="play" size="large" className='icon-button' style={{ backgroundColor: "#f44336" }} onClick={() => changeGameState("paused")}>
              <Pause fontSize="inherit" />
            </IconButton>
          </div>
        )
      }

      {
        gameState === 'paused' && (
          <div className='column-container'>
            <div className="button-container">
              <IconButton aria-label="play" size="large" className='icon-button' style={{ backgroundColor: "#26a69a" }} onClick={() => changeGameState("playing")}>
                <PlayArrow fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="restart" size="large" className='icon-button' style={{ backgroundColor: "#0288d1" }} onClick={reset}>
                <RestartAlt fontSize="inherit" />
              </IconButton>
            </div>
            <div className='game-state-text'>
              Paused
            </div>
          </div>
        )
      }

      {
        gameState === 'postgame' && (
          <div className="button-container">
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