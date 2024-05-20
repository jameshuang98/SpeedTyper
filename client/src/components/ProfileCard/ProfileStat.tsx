import React from 'react';
import { Typography } from '@mui/material';

import classes from "./ProfileCard.module.scss";

type Props = {
    statName: string,
    statValue: string
};

function ProfileStat({ statName, statValue }: Props) {
    return (
        <Typography variant="caption" className={classes.detail}>
            <p>
                {statName}
            </p>
            <p>
                {statValue}
            </p>
        </Typography>
    )
}

export default ProfileStat