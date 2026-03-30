import {Navigate, RouteObject} from "react-router-dom";

import {Documentation} from "./Documentation";
import {Docs_Inputs} from "./Pages/Inputs/Docs_Inputs";
import {Docs_Content} from "./Pages/Content/Docs_Content";
import {Docs_Utils} from "./Pages/Utils/Docs_Utils";

import {Docs_Button} from "./Pages/Inputs/Button/Docs_Button";
import {Docs_Checkbox} from "./Pages/Inputs/Checkbox/Docs_Checkbox";
import {Docs_Input} from "./Pages/Inputs/Input/Docs_Input";
import {Docs_Radio} from "./Pages/Inputs/Radio/Docs_Radio";
import {Docs_RadioTable} from "./Pages/Inputs/RadioTable/Docs_RadioTable";
import {Docs_Select} from "./Pages/Inputs/Select/Docs_Select";
import {Docs_Slider} from "./Pages/Inputs/Slider/Docs_Slider";
import {Docs_Textarea} from "./Pages/Inputs/Textarea/Docs_Textarea";

import {Docs_Card} from "./Pages/Content/Card/Docs_Card";
import {Docs_Container} from "./Pages/Content/Container/Docs_Container";

import {Docs_DragAndDrop} from "./Pages/Utils/DragAndDrop/Docs_DragAndDrop";
import {Docs_Notifications} from "./Pages/Utils/Notifications/Docs_Notifications";
import {Docs_Modal} from "./Pages/Utils/Modal/Docs_Modal";
import {Docs_Introduction} from "./Pages/Introduction/Docs_Introduction";


export const DocumentationPageRoutes: RouteObject = {
  path: "/Documentation",
  element: <Documentation/>,
  children: [
    // Homepage redirect
    {
      index: true,
      element: <Navigate to="Introduction" state={{ fromNavigate: true }} replace/>
    },
    {
      path: 'Introduction',
      element: <Docs_Introduction />
    },

    // Inputs
    {
      path: 'Inputs',
      element: <Docs_Inputs/>,
      children: [
        { path: 'Button',  element: <Docs_Button /> },
        { path: 'Checkbox',  element: <Docs_Checkbox /> },
        { path: 'Input',  element: <Docs_Input /> },
        { path: 'Radio',  element: <Docs_Radio /> },
        { path: 'RadioTable',  element: <Docs_RadioTable /> },
        { path: 'Select',  element: <Docs_Select /> },
        { path: 'Slider',  element: <Docs_Slider /> },
        { path: 'Textarea',  element: <Docs_Textarea /> },
      ]
    },

    // Content
    {
      path: 'Content',
      element: <Docs_Content/>,
      children: [
        { path: 'Card',  element: <Docs_Card /> },
        { path: 'Container',  element: <Docs_Container /> },
      ]
    },

    // Utils
    {
      path: 'Utils',
      element: <Docs_Utils/>,
      children: [
        { path: 'DragAndDrop', element: <Docs_DragAndDrop /> },
        { path: 'Modal', element: <Docs_Modal /> },
        { path: 'Notifications', element: <Docs_Notifications /> },
      ]
    },
  ]

};