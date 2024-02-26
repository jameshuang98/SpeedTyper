import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.scss";
import Main from "./pages/Main";
import ScoreHistory from "./pages/ScoreHistory";
import NotFound from "pages/NotFound";

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
    }
  ]);

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
