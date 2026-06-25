import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "game",
        element: <GamePage />,
      },
    ],
  },
]);
