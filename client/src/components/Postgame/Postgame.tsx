import React from 'react';
import { Modal, Box, Fade, Backdrop, IconButton, Button } from '@mui/material';
import classes from "./Postgame.module.scss";
import ResultCard from 'components/ResultCard/ResultCard';
import { RestartAlt } from '@mui/icons-material';

type Props = {
    correctWords: number;
    incorrectWords: number;
    characters: number;
    reset: Function;
    open: boolean;
    setOpen: (open: boolean) => void;
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

function Postgame({ correctWords, incorrectWords, characters, reset, open, setOpen }: Props) {
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
                            buttons={
                                <>
                                    <IconButton aria-label="restart" size="small" sx={{ backgroundColor: "#0288d1", color: "white" }} disableRipple={true} onClick={handleReset}>
                                        <RestartAlt fontSize="inherit" />
                                    </IconButton>
                                    <Button variant="contained" size="small" onClick={handleClose}>
                                        <p style={{ fontSize: ".7rem" }}>Check Result</p>
                                    </Button>
                                </>
                            }
                        />
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};

export default Postgame;