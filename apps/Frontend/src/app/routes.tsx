import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Pages/Home/Home";
import { ErrorPage } from "./Pages/ErrorPage/ErrorPage";
import { Documentation } from "./Pages/Documentation/Documentation";
import { Demos } from "./Pages/Demos/Demos";
import MockDatabase from "./Pages/MockDatabase/MockDatabase";
import { Contact } from "./Pages/Contact/Contact";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Demos",
    element: <Demos />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/MockDatabase",
    element: <MockDatabase />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Contact",
    element: <Contact />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Documentation",
    element: <Documentation />,
    errorElement: <ErrorPage />,
  },


  // Home page
  // Demos
  // Mock Database
  //  - Insurance Demo
  //  - Spotify Demo
  //  - Backend form state save capture Demo
  // Contact
  // Documentation
]);


// function App() {
//   return <RouterProvider router={router} />;
// }