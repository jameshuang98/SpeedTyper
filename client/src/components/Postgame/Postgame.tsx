import React, { useState } from 'react'
import { Paper, Divider, IconButton, Button, Modal, Typography, Box, Fade, Backdrop } from '@mui/material'
import "./Postgame.scss"
import { InputWord } from 'constants/types';
import ResultCard from 'components/ResultCard/ResultCard';

type Props = {
    correctWords: number;
    incorrectWords: number;
    characters: number;
    reset: Function;
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '15rem',
    height: '18rem',
    borderRadius: '16px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function Postgame({ correctWords, incorrectWords, characters, reset }: Props) {
    const [open, setOpen] = useState(true);
    const handleClose = () => setOpen(false);
    const handleReset = () => {
        setOpen(false);
        reset();
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
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
        </div>
    );
}

export default Postgame