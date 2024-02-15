import React from 'react';

import classes from "./Countdown.module.scss"

type Props = { countdown: number };

export default function Countdown({ countdown }: Props) {
    return (
        <div className={classes.countdown}>
            <h2>{countdown}</h2>
        </div>
    )
};