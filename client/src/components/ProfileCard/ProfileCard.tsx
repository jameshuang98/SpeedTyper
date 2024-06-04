import React, { useCallback, useMemo } from 'react'
import { Paper, Divider, Typography, CircularProgress, Avatar } from '@mui/material'

import ProfileStat from './ProfileStat';
import { useAuth } from 'contexts/AuthContext'
import { getUserScores } from 'api/scores';
import useService from 'hooks/useService';
import { sortResults } from 'helpers';

import classes from "./ProfileCard.module.scss"

function ProfileCard() {
    const { user } = useAuth();
    const userId = useMemo(() => user?.id, [user]);
    const fetchScores = useCallback(() => getUserScores(userId!), [userId]);
    const { loading, error, response } = useService(fetchScores);
    const mostRecentAttempt = response?.data.sort(sortResults("recent"))[0];
    const highestAttempt = response?.data.sort(sortResults("highest"))[0];



    const renderContent = () => {
        if (loading) {
            return <CircularProgress sx={{margin: "5rem auto 0 auto"}} />;
        } else if (error) {
            return <div className={classes.error}>Error getting data!</div>;
        } else {
            return (
                <div className={classes.content}>
                    <div className={classes.stats}>
                        <ProfileStat statName="Highest WPM" statValue={highestAttempt ? highestAttempt.correctWords : "N/A"} />
                        <Divider />
                        <ProfileStat statName="Last played:" statValue={mostRecentAttempt ? (new Date(mostRecentAttempt.createdDate)).toLocaleDateString('en-US') : "N/A"} />
                        <Divider />
                        <ProfileStat statName="Most recent result:" statValue={mostRecentAttempt ? mostRecentAttempt.correctWords : "N/A"} />
                        <Divider />
                        <ProfileStat statName="Number of attempts:" statValue={response && response.data.length} />
                    </div>
                </div>
            );
        }
    };

    return (
        <Paper elevation={3} className={classes.card}>
            <div className={classes.header}>
                <Avatar
                    sx={{ bgcolor: "blue", width: 64, height: 64, margin: ".5rem auto .5rem auto"  }}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    src={user?.profileImageURL}
                >
                    {user?.firstName[0]}
                </Avatar>
                <Typography variant="h6" className={classes.name}>
                    {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" className={classes.username}>
                    {user?.username}
                </Typography>
            </div>
            <Divider />
            {renderContent()}
        </Paper>
    )
}

export default ProfileCard