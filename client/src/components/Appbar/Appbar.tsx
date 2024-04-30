import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import classes from './Appbar.module.scss';

function Appbar() {
    const navigate = useNavigate();

    return (
        <AppBar position="static" className={classes.appbar}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="body1" component="div" className={classes.appName} onClick={() => navigate("/")}>
                    SpeedTyper
                </Typography>
            </Toolbar>
        </AppBar>
    )
};

export default Appbar;