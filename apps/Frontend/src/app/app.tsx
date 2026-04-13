import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RouterProvider, ScrollRestoration, useLocation } from 'react-router-dom';
import { router } from './routes';

import axios from 'axios';
import Cookies from 'js-cookie';
import styled from '@emotion/styled';
import { UserTokenInformation } from '@Project/Classes';
import { jwtDecode } from 'jwt-decode';
import { TooltipProvider } from './Components/Utils/Tooltip/TooltipProvider/TooltipProvider';


const AppSpacing = styled.div``;
// pb-4 p-2 mx-auto max-w-7xl px-2 lg:px-8 sm:px-6


// Authentication Context
export interface LoginContextProps {
  accessToken?: string;
  userTokenInformation?: UserTokenInformation | null;
  setUserTokenInformation?: (value: UserTokenInformation | null) => void;
}
export const LoginContext = createContext<LoginContextProps>({});



export function App() {
  const [userTokenInformation, setUserTokenInformation] = useState<UserTokenInformation | null>(null);
  const [accessToken, setAccessToken] = useState<string>();

  // Authentication
  useEffect(() => {
    // Retrieve login information
    if (!accessToken || !userTokenInformation) {
      getAccessToken();
    }

    // Retrieve Cookies -> metadata, etc.
    Cookies.get('thisWebsite-metadata');

    // Console Information
    console.log('\ninformation: ', { userTokenInformation, accessToken });
  }, [accessToken, userTokenInformation]);

  // Retrieve the access token (login info) in the event the user is already logged in.
  const getAccessToken = async () => {
      let token = localStorage.getItem('accessToken') || '';
      let tokenInformation: UserTokenInformation | null;

      if (token) {
        setAccessToken(token);
        tokenInformation = jwtDecode<UserTokenInformation>(token);
        setUserTokenInformation(tokenInformation);
        if (tokenInformation.email) {
          await axios.post(`http://localhost:3333/loggedIn`, { accessToken: token })
            .then(res => {
              console.log('already logged in response: ', res);
              if (res.status !== 200) {
                localStorage.setItem('accessToken', '');
                tokenInformation = null;
                token = '';
              }
              
              // Refresh token from server
              setUserTokenInformation(tokenInformation);
              setAccessToken(token);
              return;
            }).catch(err => console.log('something happened while trying to access the server!', err));
        }
      }
  };


  // Universal Tooltip
  const [showTooltip, setShowTooltip] = useState<boolean>(false);



  return (
    <AppSpacing className="bg-default">
      <LoginContext.Provider value={{accessToken, userTokenInformation, setUserTokenInformation}}>
        
        {/* Application */}
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>

        {/* TODO: Add a component used in the app to save the user's previous session, and policy submission information for when they open the site again, to navigate back to where they left off */}
        {/* TODO: Add a sidebar for displaying and debugging save state, that captures both saved and retrieved information that's sent to the backend when autosaved during submissions and during retrieval */}
        {/* TODO: Add debugging and your own util function that overrides console logging (and learn how to use other libraries for capturing and diagnostics, and how to have it as a universal import) */}

        {/* TODO: Create a nice landing page and dashboard that's interactive with the ability to sign in, create a claim, and navigate to next steps / user's policy information for home and auto */}
        {/* TODO: Create an interactive application with animations and a step by step process for creating a claim for both home and auto  */}
        {/* TODO: Create the login/sign in pages and the dashboard */}

        {/* Different platforms to navigate to: */}
        {/* 
          Homepage navbar 
            - Home 
            - Demos
            - Mock Database
            - Contact
            - Backend form state save capture Demo
            - etc.

          Settings/User Login
            - User
            - Settings
            - etc.
        */}

        {/* 
          Mock Database
            A way to create fake databases. Creating individual tables, their values, and relations
              - Created data gets sent to the backend for constructing mock databases dynamically. Attach
                  databases to each account, and retrieve values from the backend when logging in.
                  The data is transient, but the table structures can be cached in localStorage
          
            Popovers
            - Sidebar (Tables of the current database)
              - Allows the user to select and rearrange the current list of tables for the selected database
            - TopBar - Information / Data / Edit
              - Information:  The information about the current table (to edit / move the list of it's params)
              - Data:         The values that the database currently has on the table
            - BottomBar (the list of databases, and where to create a new one)
              - Contains boxes of the current databases, and the way to create additional ones.
              - Separate menu for creating a database from scratch, use the edit tab of a specific database to delete it

            - skeleton loaders for values on each of the tabs, loading / error / okay state for color / glow loading anim
            - drag and drop functionality for reordering the table's params, or the values of a table
            - ability to select table and it's foreign keys to display in the data tables
            - eventual bottom border display for inputs on whether the current value is being saved or 
                in sync with the backend. Like a horizontal loading bar that slides to the right while loading

        */}

        {/* 
          Insurance Demo
            - User dashboard
            - Landing page -> with links to navigate to the other portals
            - Submit a claim page - home and auto
              - Sidebar for steps, fade in/out animations for each step, with a way to add and navigate between steps
              - Business logic for dynamically handling what needs to be filled out during a quote
              - Current submit claim state should be saved on the backend, tied the guid for retrieval
              - Eventual logic should save the form data to the backend while they're entering the information on the backend
        */}

        {/* Backend form state save capture Demo
            - Create a quick form to show save state being captured on the backend. It's current state, when we capture save data,
                and the progress and response of the data being saved on the backend. With information displaying the state/progress
          */}

        {/* Submit a claim, for home and auto */}
        {/* Login page should accept dummy data, or a universal user for quick access */}
        {/* An additional settings page to determine whether to use mock data for the insurance page, or a backend */}
        {/* Backends for handling data, and try out clustering */}

      </LoginContext.Provider>
    </AppSpacing>
  );
}


export default App;
