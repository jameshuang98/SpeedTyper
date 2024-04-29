import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.scss";
import Main from "./pages/Main/Main";
import ScoreHistory from "./pages/ScoreHistory/ScoreHistory";
import NotFound from "pages/NotFound/NotFound";
import SignIn from "pages/SignIn/SignIn";
import Appbar from "components/Appbar/Appbar";

function App() {

  const router = createBrowserRouter([
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
    }
  ]);

  return (
    <div>
      <Appbar />
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
