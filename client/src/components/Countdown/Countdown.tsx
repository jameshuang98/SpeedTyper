import React from 'react';

type Props = { countdown: number };

export default function Countdown({ countdown }: Props) {
    return (
        <div className="countdown">
            <h2>{countdown}</h2>
        </div>
    )
};