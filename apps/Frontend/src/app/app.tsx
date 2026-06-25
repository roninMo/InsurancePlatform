import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RouterProvider, ScrollRestoration, useLocation } from 'react-router-dom';
import { router } from './routes';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UserTokenInformation } from '@Project/Classes';
import { jwtDecode } from 'jwt-decode';
import { hashLinkScrollRestoration, TooltipProvider } from '@Project/ReactComponents';
// import astCompLogs from '../assets/astCompLogs.json'; 

import styled from '@emotion/styled';


// Navigation Scroll Restoration and HashLink-Nav Service 
hashLinkScrollRestoration.init({
  baseUrl: import.meta.env.VITE_BASE_URL || window.location.origin,
  historyRef: window.history
});


// Authentication Context
export interface LoginContextProps {
  accessToken?: string;
  userTokenInformation?: UserTokenInformation | null;
  setUserTokenInformation?: (value: UserTokenInformation | null) => void;
}
export const LoginContext = createContext<LoginContextProps>({});


export function App() {
  // #region State Information
  const [userTokenInformation, setUserTokenInformation] = useState<UserTokenInformation | null>(null);
  const [accessToken, setAccessToken] = useState<string>();
  
  // ? Devlog Logging
  console.log('\n\n');
  console.log(`global state`, { globalThis, window });
  console.log(`App rerendered (default console.log): data: `, { userTokenInformation, accessToken }, "another value", { another: 'object' });
  log('content', `App rerendered: data: `, { userTokenInformation, accessToken }, "another value", { another: 'object' });
  useEffect(() => {
    loadLogs();

    // Retrieve and destructure the default export from the imported module
    async function loadLogs() {
      try {
        // @ts-ignore - Ignore tsconfig lookup constraints for this dynamic JSON import
        const { default: abstractComponentLogHistory } = await import('../assets/astCompLogs.json'); 
        
        // This will now print your actual clean { [compName]: data } object!
        console.log(`Ast's captured logs: `, abstractComponentLogHistory);
        
      } catch (e) {
        console.error("Failed to load AST logs", e);
      }
      console.log('\n\n');
    }
  }, []);
  
  
  
  
  // #endregion
  // #region Authentication
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
  
  
  // #endregion
  // #region Rendered HTML / Todo List
  return (
    <AppSpacing className="bg-default">
      <LoginContext.Provider value={{accessToken, userTokenInformation, setUserTokenInformation}}>
        
        {/* Application */}
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>

{/* 
  // TODO List(Old -> Check Documentation, MockDatabase, Home)
    - Add a component used in the app to save the user's previous session, and policy submission information for when they open the site again, to navigate back to where they left off 
    - Add a sidebar for displaying and debugging save state, that captures both saved and retrieved information that's sent to the backend when autosaved during submissions and during retrieval 
    - Add debugging and your own util function that overrides console logging (and learn how to use other libraries for capturing and diagnostics, and how to have it as a universal import) 
    
    - Create a nice landing page and dashboard that's interactive with the ability to sign in, create a claim, and navigate to next steps / user's policy information for home and auto 
    - Create an interactive application with animations and a step by step process for creating a claim for both home and auto  
    - Create the login/sign in pages and the dashboard 


// ? Different platforms to navigate to:
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


  // ? Mock Database - see MockDatabase.tsx
    A way to create fake databases. Creating individual tables, their values, and relations
      - Created data gets sent to the backend for constructing mock databases dynamically. Attach
          databases to each account, and retrieve values from the backend when logging in.
          The data is transient, but the table structures can be cached in localStorage.
          Handle themed values for specific contextual data to return from types for interactive data


  // ? Insurance Demo
    - User dashboard
    - Landing page -> with links to navigate to the other portals
    - Submit a claim page - home and auto
      - Sidebar for steps, fade in/out animations for each step, with a way to add and navigate between steps
      - Business logic for dynamically handling what needs to be filled out during a quote
      - Current submit claim state should be saved on the backend, tied the guid for retrieval
      - Eventual logic should save the form data to the backend while they're entering the information on the backend
      
    - Content to add
    // * Submit a claim, for home and auto 
    // * Login page should accept dummy data, or a universal user for quick access 
    // * An additional settings page to determine whether to use mock data for the insurance page, or a backend 
    // * Backends for handling data, and try out clustering 


  // ? For the devlog, see Documentation.tsx
    - Shows contextual (and combined) rerender history to pinpoint performance issues within your application ( props, hooks, parent, etc. )
    - The primary goal is to capture the history of every component in a better console ui, with search, filtering, and descendant based logging display
    - This will show logs and render information for every component, with the ability to toggle each and quickly traverse the component tree to see what's causing inefficiency
  // ? Brief TODO, an in depth list of what needs to be completed is within Documentation.tsx
    - vite map function to opt components into logging their render times
    - create a state with a component hierarchy to display what devlogs are being captured
      - dev popover that displays the hierarchy of pages -> components -> nested unique component's being logged
      - additional option to change the hierarchy to components, that targets all logs from a component used anywhere
      - Allow the devs to toggle what's being logged in the console, and a list of what's captured
        - from render times and other react specific diagnostics
        - to specific logs added to each component
        - the accumulated rerenders, w/a reference percentage chart to what parent component they were in 
      - capture the e.type, and e.nativeEvent functions in dev logs
*/}
      </LoginContext.Provider>
    </AppSpacing>
  );
  // #endregion
}


// Styled components
const AppSpacing = styled.div``;


export default App;
