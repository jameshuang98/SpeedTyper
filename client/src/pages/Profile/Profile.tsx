import React from 'react'
import { Hidden } from '@mui/material';

import ProfileCard from 'components/ProfileCard/ProfileCard';
import ProfileForm from 'components/ProfileForm/ProfileForm';
import { useAuth } from 'contexts/AuthContext';

import classes from './Profile.module.scss';

type Props = {}

export default function Profile(props: Props) {
    const { user } = useAuth();
    if (!user) {
        return <div>You must be logged in!</div>
    }

    return (
        <div>
            <img className={classes.image} alt="background sky" src="https://images.unsplash.com/photo-1587279535322-b20697908487?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            <div className={classes.container}>
                <Hidden mdDown>
                    <ProfileCard />
                </Hidden>
                <ProfileForm />
            </div>
        </div>
    )
}