import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Appbar from "components/Appbar/Appbar";
import Main from "./pages/Main/Main";
import ScoreHistory from "./pages/ScoreHistory/ScoreHistory";
import NotFound from "pages/NotFound/NotFound";
import SignIn from "pages/SignIn/SignIn";
import SignUp from "pages/SignUp/SignUp";
import Profile from "pages/Profile/Profile";
import { SnackbarProvider } from './contexts/SnackbarContext';
import { AuthProvider } from "contexts/AuthContext";

import "./App.scss";


function App() {
  const router = createBrowserRouter([
    {
      element: (
        <>
          <Appbar />
          <Outlet />
        </>
      ),
      children: [
        {
          path: '/',
          element: <Main />,
          errorElement: <NotFound />
        },
        {
          path: '/scores',
          element: <ScoreHistory />
        },
        {
          path: '/login',
          element: <SignIn />
        },
        {
          path: '/register',
          element: <SignUp />
        },
        {
          path: '*',
          element: <NotFound />
        },
        {
          path: '/profile',
          element: <Profile />
        },
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <AuthProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
