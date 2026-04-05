import { createBrowserRouter } from "react-router-dom";
import { Home } from "./Pages/Home/Home";
import { ErrorPage } from "./Pages/ErrorPage/ErrorPage";
import { Demos } from "./Pages/Demos/Demos";
import MockDatabase from "./Pages/MockDatabase/MockDatabase";
import { Contact } from "./Pages/Contact/Contact";
import {DocumentationPageRoutes} from "./Pages/Documentation/routes_Documentation";


export const defaultNavState = { fromNavigate: true }; // Allows @see Navbar.tsx to implement scroll behavior with hash links and pages
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Demos",
    element: <Demos />,
  },
  {
    path: "/MockDatabase",
    element: <MockDatabase />,
  },
  {
    path: "/Contact",
    element: <Contact />,
  },
  DocumentationPageRoutes,
  {
    path: '*',
    element: <ErrorPage />
  }

  // Home page
  // Demos
  // Mock Database
  //  - Insurance Demo
  //  - Spotify Demo
  //  - Backend form state save capture Demo
  // Contact
  // Documentation
]);
