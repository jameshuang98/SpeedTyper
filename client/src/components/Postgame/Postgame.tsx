import React, { useState } from 'react';
import { Paper, Modal, Typography, Box, Fade, Backdrop } from '@mui/material';
import classes from "./Postgame.module.scss";
import ResultCard from 'components/ResultCard/ResultCard';

type Props = {
    correctWords: number;
    incorrectWords: number;
    characters: number;
    reset: Function;
};

const style = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '15rem',
    height: '18rem',
    borderRadius: '16px',
    boxShadow: 24,
};

function Postgame({ correctWords, incorrectWords, characters, reset }: Props) {
    const [open, setOpen] = useState(true);
    const handleClose = () => setOpen(false);
    const handleReset = () => {
        setOpen(false);
        reset();
    };

    return (
        <div className={classes.Container}>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                disableAutoFocus
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                        style: {
                            backgroundColor: 'rgb(0,0,0,0.2)',
                        },
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <ResultCard
                            correctWords={correctWords}
                            incorrectWords={incorrectWords}
                            characters={characters}
                            reset={handleReset}
                            checkResult={handleClose}
                            style={{
                                position: 'absolute' as 'absolute',
                                top: '0%',
                                left: '0%',
                            }}
                        />
                    </Box>
                </Fade>
            </Modal>

            <Paper className={classes.stats}>
                <Typography variant="h5">{correctWords} WPM</Typography>
                <Typography variant="subtitle2">Accuracy: {Math.round((correctWords / (correctWords + incorrectWords)) * 100)}%</Typography>
            </Paper>
        </div>
    );
};

export default Postgame;