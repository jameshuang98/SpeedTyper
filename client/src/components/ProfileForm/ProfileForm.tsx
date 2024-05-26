import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Paper, Divider, Grid, Typography, TextField, Link, Button, Box } from '@mui/material';
import { compare } from 'fast-json-patch';

import { UserDTO, UserRegistrationRequest } from 'constants/types';
import { patchUser } from 'api/users';
import { useAuth } from 'contexts/AuthContext';
import { useSnackbar } from 'contexts/SnackbarContext';
import useValidateUserForm from 'hooks/useValidateUserForm';

import classes from "./ProfileForm.module.scss";

function ProfileForm() {
    const { user, login } = useAuth();
    const { showSnackbar } = useSnackbar();
    const originalData : UserDTO = {
        firstName: user!.firstName,
        lastName: user!.lastName,
        username: user!.username,
        email: user!.email,
        profileImageURL: user!.profileImageURL
      };
    const { values, errors, validForm, validate } = useValidateUserForm(originalData);

    const handleProfileChange = (fieldName: keyof UserRegistrationRequest, value: string) => {
        validate(fieldName, value, { validatePassword: false, validateProfileImageURL: false });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const patchDocument = compare(originalData, values); // Create the patch document

        try {
            const response = await patchUser(user!.id, patchDocument);
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
                            onBlur={(e) => handleProfileChange("firstName", e.target.value)}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
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
                            onBlur={(e) => handleProfileChange("lastName", e.target.value)}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
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
                            onBlur={(e) => handleProfileChange("username", e.target.value)}
                            error={!!errors.username}
                            helperText={errors.username}
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
                            onBlur={(e) => handleProfileChange("email", e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} >
                        {/* <Link
                            component="button"
                            variant="caption"
                            underline="hover"
                            sx={{ marginTop: "1rem" }}
                            onClick={() => {
                                console.log("Change Password");
                            }}
                        >
                            Change Password
                        </Link> */}
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button disabled={!validForm} variant="contained" size="medium" type="submit" sx={{ margin: "1rem 1rem" }}>
                            <Typography variant="subtitle2">Save</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

export default ProfileForm