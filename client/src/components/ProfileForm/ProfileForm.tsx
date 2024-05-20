import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Paper, Divider, Grid, Typography, TextField, Link, Button, Box } from '@mui/material';

import { User } from 'constants/types';
import { patchUser } from 'api/users';
import { useAuth } from 'contexts/AuthContext';
import { useSnackbar } from 'contexts/SnackbarContext';

import classes from "./ProfileForm.module.scss";

function ProfileForm() {
    const { user, login } = useAuth();
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        console.log("data form:", data)
        const userData: User = {
            id: user!.id,
            firstName: data.firstName as string,
            lastName: data.lastName as string,
            username: data.username as string,
            email: data.email as string,
            profileImageURL: user!.profileImageURL
        };

        try {
            const response = await patchUser(userData);
            if (response && response.statusCode === 200) {
                login(response.data);
                showSnackbar("Changes Saved", <CheckCircleOutlineIcon fontSize="small" />);
            }
        } catch (err) {
            console.log(err)
        }

    };

    return (
        <Paper elevation={3} className={classes.card}>
            <Typography className={classes.header}>Account</Typography>
            <Divider />
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={4} sx={{ padding: "1.5rem" }}>
                    <Grid item lg={6} md={6} sm={12} sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="caption" sx={{ fontWeight: "bold" }}>First Name</Typography>
                        <TextField
                            required
                            autoComplete="given-name"
                            size="small"
                            margin="none"
                            id="firstName"
                            name="firstName"
                            // label="First Name"
                            defaultValue={user?.firstName}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="caption" sx={{ fontWeight: "bold" }}>Last Name</Typography>
                        <TextField
                            required
                            autoComplete="family-name"
                            size="small"
                            margin="none"
                            id="lastName"
                            name="lastName"
                            // label="Last Name"
                            defaultValue={user?.lastName}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="caption" sx={{ fontWeight: "bold" }}>Username</Typography>
                        <TextField
                            required
                            autoComplete="username"
                            size="small"
                            margin="none"
                            id="username"
                            name="username"
                            // label="Username"
                            defaultValue={user?.username}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="caption" sx={{ fontWeight: "bold" }}>Email</Typography>
                        <TextField
                            required
                            autoComplete="email"
                            size="small"
                            margin="none"
                            id="email"
                            name="email"
                            // label="Email"
                            defaultValue={user?.email}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} >
                        <Link
                            component="button"
                            variant="caption"
                            underline="hover"
                            sx={{ marginTop: "1rem" }}
                            onClick={() => {
                                console.log("Change Password");
                            }}
                        >
                            Change Password
                        </Link>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="contained" size="medium" type="submit" sx={{ margin: "1rem 1rem" }}>
                            <Typography variant="subtitle2">Save</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

export default ProfileForm