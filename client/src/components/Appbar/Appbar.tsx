import React from 'react';
import './Appbar.scss';
import { AppBar, Toolbar, Typography } from '@mui/material';

function Appbar() {
    return (
        <div className="appbar">
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