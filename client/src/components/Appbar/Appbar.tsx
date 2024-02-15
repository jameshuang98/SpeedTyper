import React from 'react';
import classes from './Appbar.module.scss';
import { AppBar, Toolbar, Typography } from '@mui/material';

function Appbar() {
    return (
        <div className={classes.appbar}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="body1" component="div" className="appbar">
                        SpeedTyper
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
};

export default Appbar;