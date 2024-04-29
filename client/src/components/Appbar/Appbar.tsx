import React from 'react';
import classes from './Appbar.module.scss';
import { AppBar, Toolbar, Typography } from '@mui/material';

function Appbar() {
    return (
        <AppBar position="static" className={classes.appbar}>
            <Toolbar>
                <Typography variant="body1" component="div" className={classes.appName}>
                    SpeedTyper
                </Typography>
            </Toolbar>
        </AppBar>
    )
};

export default Appbar;