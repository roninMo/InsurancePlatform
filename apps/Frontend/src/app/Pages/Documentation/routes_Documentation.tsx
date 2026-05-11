import { redirect, RouteObject } from "react-router-dom";

import { Documentation } from "./Documentation";
import { Docs_Introduction } from "./Pages/Introduction/Docs_Introduction";
import { Docs_Forms } from "./Pages/Inputs/Docs_Forms";
import { Docs_Content } from "./Pages/Content/Docs_Content";
import { Docs_Utils } from "./Pages/Utils/Docs_Utils";


// Documentation/Forms
import { Docs_Button } from "./Pages/Inputs/Button/Docs_Button";
import { Docs_Checkbox } from "./Pages/Inputs/Checkbox/Docs_Checkbox";
import { Docs_Dropbox } from "./Pages/Inputs/Dropbox/Docs_Dropbox";
import { Docs_Input } from "./Pages/Inputs/Input/Docs_Input";
import { Docs_Radio } from "./Pages/Inputs/Radio/Docs_Radio";
import { Docs_RadioTable } from "./Pages/Inputs/RadioTable/Docs_RadioTable";
import { Docs_Select } from "./Pages/Inputs/Select/Docs_Select";
import { Docs_Slider } from "./Pages/Inputs/Slider/Docs_Slider";
import { Docs_Textarea } from "./Pages/Inputs/Textarea/Docs_Textarea";

// Documentation/
import { Docs_Alert } from "./Pages/Content/Alert/Docs_Alert";
import { Docs_Card } from "./Pages/Content/Card/Docs_Card";
import { Docs_Icon } from "./Pages/Content/Icon/Docs_Icon";
import { Docs_Dropdown } from "./Pages/Content/Dropdown/Docs_Dropdown";

// Documentation/
import { Docs_DragAndDrop } from "./Pages/Utils/DragAndDrop/Docs_DragAndDrop";
import { Docs_Modal } from "./Pages/Utils/Modal/Docs_Modal";
import { Docs_Tooltip } from "./Pages/Utils/Tooltip/Docs_Tooltip";
import { Docs_HashLink } from "./Pages/Utils/HashLink/Docs_HashLink";


export const DocumentationPageRoutes: RouteObject = {
  path: "/Documentation",
  element: <Documentation/>,
  children: [
    { // Documentation base redirect
      index: true,
      // Do not use a navigate element, the navbar's functionality 
      // breaks and we shouldn't remount it during this process
      loader: () => redirect("Introduction")
    },
    {
      path: 'Introduction',
      element: <Docs_Introduction links="all" />,
      handle: { title: "Docs - Get Started" },
    },

    // Inputs
    {
      path: 'Forms',
      element: <Docs_Forms/>,
      children: [
        // Forms base redirect
        { index: true, loader: () => redirect("Introduction") },
        {
          path: 'Introduction',
          element: <Docs_Introduction links="forms" />,
          handle: { title: "Forms - Links" },
        },
        { path: 'Button',  element: <Docs_Button />, handle: { title: "Forms - Button" } },
        { path: 'Checkbox',  element: <Docs_Checkbox />, handle: { title: "Forms - Checkbox" } },
        { path: 'Dropbox',  element: <Docs_Dropbox />, handle: { title: "Forms - Dropbox" } },
        { path: 'Input',  element: <Docs_Input />, handle: { title: "Forms - Input" } },
        { path: 'Radio',  element: <Docs_Radio />, handle: { title: "Forms - Radio" } },
        { path: 'RadioTable',  element: <Docs_RadioTable />, handle: { title: "Forms - Radio Table" } },
        { path: 'Select',  element: <Docs_Select />, handle: { title: "Forms - Select" } },
        { path: 'Slider',  element: <Docs_Slider />, handle: { title: "Forms - Slider" } },
        { path: 'Textarea',  element: <Docs_Textarea />, handle: { title: "Forms - Textarea" } },
      ]
    },

    // Content
    {
      path: 'Content',
      element: <Docs_Content/>,
      children: [
        // Forms base redirect
        { index: true, loader: () => redirect("Introduction") },
        {
          path: 'Introduction',
          element: <Docs_Introduction links="content" />,
          handle: { title: "Content - Links" }
        },
        { path: 'Alert',  element: <Docs_Alert />, handle: { title: "Content - Alert" } },
        { path: 'Card',  element: <Docs_Card />, handle: { title: "Content - Card" } },
        { path: 'Icon',  element: <Docs_Icon />, handle: { title: "Content - Icon" } },
        { path: 'Dropdown',  element: <Docs_Dropdown />, handle: { title: "Content - Dropdown" } },
      ]
    },

    // Utils
    {
      path: 'Utils',
      element: <Docs_Utils/>,
      children: [
        // Utils base redirect
        { index: true, loader: () => redirect("Introduction") },
        {
          path: 'Introduction',
          element: <Docs_Introduction links="utils" />,
          handle: { title: "Utils - Links" }
        },
        { path: 'DragAndDrop', element: <Docs_DragAndDrop />, handle: { title: "Utils - DragAndDrop" } },
        { path: 'Modal', element: <Docs_Modal />, handle: { title: "Utils - Modal" } },
        { path: 'Tooltip', element: <Docs_Tooltip />, handle: { title: "Utils - Tooltip" } },
        { path: 'HashLink', element: <Docs_HashLink />, handle: { title: "Utils - HashLink" } },
      ]
    },
  ]

};