import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./app";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  // {
  //   path: "/about",
  //   element: <About />,
  // },


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