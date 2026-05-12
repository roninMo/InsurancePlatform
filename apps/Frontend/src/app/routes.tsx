import { createBrowserRouter } from "react-router-dom";
import { Home } from "./Pages/Home/Home";
import { ErrorPage } from "./Pages/ErrorPage/ErrorPage";
import { Demos } from "./Pages/Demos/Demos";
import { MockDatabase } from "./Pages/MockDatabase/MockDatabase";
import { Contact } from "./Pages/Contact/Contact";
import {DocumentationPageRoutes} from "./Pages/Documentation/routes_Documentation";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    handle: { title: "Home Page" },
  },
  {
    path: "/Demos",
    element: <Demos />,
    handle: { title: "Demos" },
  },
  {
    path: "/MockDatabase",
    element: <MockDatabase />,
    handle: { title: "Mock Database" },
  },
  {
    path: "/Contact",
    element: <Contact />,
    handle: { title: "Contact Us" },
  },
  DocumentationPageRoutes,
  {
    path: '*',
    element: <ErrorPage />,
    handle: { title: "Page Not Found" },
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
