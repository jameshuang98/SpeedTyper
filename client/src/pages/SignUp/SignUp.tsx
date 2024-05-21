import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { registerUser } from 'api/auth';
import { UserRegistrationRequest } from 'constants/types';
import { useSnackbar } from 'contexts/SnackbarContext';
import { isValidEmail, isValidPassword, isNotWhiteSpace, hasNonEmptyStringValue, hasEmptyStringValue } from 'helpers';

export default function SignUp() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [values, setValues] = useState<UserRegistrationRequest>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<UserRegistrationRequest>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [validForm, setValidForm] = useState(false);
  
  const validate = (fieldName: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let errorMessage = "";
    switch (fieldName) {
      case "email":
        errorMessage = !isValidEmail(e.target.value) ? "Invalid email" : "";
        break;
      case "password":
        errorMessage = !isValidPassword(e.target.value) ? "Password must be at least 8 characters long, including at least 1 lowercase character, 1 uppercase character, 1 number, and 1 special character" : "";
        break;
      default:
        errorMessage = !isNotWhiteSpace(e.target.value) ? "Cannot be empty" : "";
        break;
    }
    setValues((values: UserRegistrationRequest) => ({ ...values, [fieldName]: e.target.value }));
    setErrors((values: UserRegistrationRequest) => ({ ...values, [fieldName]: errorMessage }));
    const isValid = !hasNonEmptyStringValue({ ...errors, [fieldName]: errorMessage }) && !hasEmptyStringValue({ ...values, [fieldName]: e.target.value })
    setValidForm(isValid);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userRegistrationRequest: UserRegistrationRequest = {
      firstName: data.get('firstName') as string,
      lastName: data.get('lastName') as string,
      email: data.get('email') as string,
      username: data.get('username') as string,
      password: data.get('password') as string
    };

    try {
      const registerResponse = await registerUser(userRegistrationRequest);
      if (registerResponse && registerResponse.statusCode === 201) {
        showSnackbar("Registration Successful", <CheckCircleOutlineIcon fontSize="small" />);
        navigate("/");
      };
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        padding: "2rem !important",
        maxWidth: "550px !important",
        backgroundColor: "#fff",
        marginTop: 8,
        borderRadius: 8
      }}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                autoFocus
                required
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                onBlur={(e) => validate("firstName", e)}
                error={errors.firstName !== ""}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                autoComplete="family-name"
                onBlur={(e) => validate("lastName", e)}
                error={errors.lastName !== ""}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                name="username"
                label="Username"
                autoComplete="username"
                onBlur={(e) => validate("username", e)}
                error={errors.username !== ""}
                helperText={errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onBlur={(e) => validate("email", e)}
                error={errors.email !== ""}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                error={errors.password !== ""}
                onBlur={(e) => validate("password", e)}
                onChange={(e) => validate("password", e)}
                helperText={errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!validForm}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}