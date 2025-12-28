import { ChangeEvent, createContext, useEffect, useId, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import { UserTokenInformation } from '@Project/Classes';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Cookies from 'js-cookie';
import styled from '@emotion/styled';

import NxWelcome from './nx-welcome';
import { Button, Icon, Input, InputProps_Email, ProjectReactComponents } from '@Project/ReactComponents';


const AppSpacing = styled.div`
margin: 0;
padding: 0;
min-width: 100vh;
min-height: 100vh;
`;
const RoutesSpacing = styled.div``;
const MainContent = styled.div``;
// p-2 pb-4 text-sm/6 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8


// Authentication Context
export interface LoginContextProps {
  accessToken?: string;
  userTokenInformation?: UserTokenInformation | null;
  setUserTokenInformation?: (value: UserTokenInformation | null) => void;
}
export const LoginContext = createContext<LoginContextProps>({});



export function App() {
  const [currentTheme, SetCurrentTheme] = useState<string>(localStorage.getItem('theme') || '');
  const [userTokenInformation, setUserTokenInformation] = useState<UserTokenInformation | null>(null);
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    // Themes and display settings
    if (!currentTheme) {
      const userPreferenceTheme: string = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      localStorage.setItem('theme', userPreferenceTheme);
      SetCurrentTheme(userPreferenceTheme);
    }
    updateTheme(currentTheme);

    // Retrieve login information
    if (!accessToken || !userTokenInformation) {
      getAccessToken();
    }

    // Retrieve Cookies -> metadata, etc.
    Cookies.get('thisWebsite-metadata');

    // Console Information
    console.log('\ninformation: ', { userTokenInformation, accessToken, currentTheme });
  }, [accessToken, currentTheme, userTokenInformation]);

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

  // #region Theme
  const setTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    SetCurrentTheme(newTheme);
    updateTheme(currentTheme);
    // console.log('theme status: ', {currentTheme, newTheme});
  }

  const updateTheme = (theme: 'light' | 'dark' | string) => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }
  // #endregion

  // #region Text Input
  const InputId = useId();
  const [input, setInput] = useState<string>("");
  const InputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value;
    setInput(newValue);

    console.log({Event: e, newValue});
  }
  // #endregion

  // #region Error Toggling
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const toggleError = (e: any) => {
    setError(!error); 
    setErrorMessage("Invalid text."); 
    
    console.log('set error to ', !error);
  }
  // #endregion

  // Input elements
  const [email, setEmail] = useState<string>("");
  const emailId = useId();
  const emailChanged = (e: ChangeEvent<HTMLInputElement>) => setEmail(e?.target?.value);
  
  
  return (
    <AppSpacing className={themeContainerStyles + ``}>
      <div className='bg-white dark:bg-gray-800'>

        <LoginContext.Provider value={{accessToken, userTokenInformation, setUserTokenInformation}}>
          <div role="navigation" className='p-2'>
            <ul>
              <li className='pb-1'>
                <Link to="/">Home</Link>
              </li>
              <li className='pb-1'>
                <Link to="/page-2">Page 2</Link>
              </li>
            </ul>
          </div>

          <RoutesSpacing className='m-10'>
            <Routes>
              <Route 
                path="/"
                element={
                  <div className={`p-2 pb-4 text-sm/6`}>
                    <div>
                      <h2 className={`mb-2`}>Home Page</h2>
                      <p className={`mb-4`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    
                      <button onClick={setTheme}>{currentTheme === "dark" ? 'set to light' : 'set to dark'}</button>
                    </div>
                  </div>
                } 
              />
              
              <Route
                path="/page-2"
                element={
                  <div className={`p-2 pb-4 text-sm/6`}>
                    <Link to="/">Click here to go back to root page.</Link>
                  </div>
                }
              />
            </Routes>
          </RoutesSpacing>


            {/* <div className={"mx-auto sm:px-6 lg:px-8 " + styles}> */} 
            <MainContent className=' grid grid-cols-12 gap-x-6 gap-y-4 px-6 py-4 bg-slate-900'>
              <div className='col-span-4 md:col-span-6'>
                <Input 
                  type="policyNumber"
                  name="Input"
                  label="Input"
                  description=""
                  value={input}
                  placeholder="Input text..."
                  id={InputId}
                  onChange={InputChanged}
                />
              </div>

              <div className='col-span-12 mt-2'>
                <Button displayText="Toggle Error" onClick={toggleError} />
              </div>


              <div className='col-span-12 mt-2 pt-4 grid grid-cols-12 gap-x-8'>
                <div className='col-span-4 pb-2'>
                  <Input 
                    { ...InputProps_Email } value={email}id={emailId}onChange={emailChanged}
                    error={error} errorMessage={errorMessage} required={false} disabled={false}
                  />
                </div>
                <div className='col-span-8'></div>
              </div>
            </MainContent>


            {/* TODO: Add a component used in the app to save the user's previous session, and policy submission information for when they open the site again, to navigate back to where they left off */}
            {/* TODO: Add a sidebar for displaying and debugging save state, that captures both saved and retrieved information that's sent to the backend when autosaved during submissions and during retrieval */}
            {/* TODO: Add debugging and your own util function that overrides console logging (and learn how to use other libraries for capturing and diagnostics, and how to have it as a universal import) */}

            {/* TODO: Create a nice landing page and dashboard that's interactive with the ability to sign in, create a claim, and navigate to next steps / user's policy information for home and auto */}
            {/* TODO: Create an interactive application with animations and a step by step process for creating a claim for both home and auto  */}
            {/* TODO: Create the login/sign in pages and the dashboard */}

            {/* Different platforms to navigate to: */}
            {/* 
              This project
                - User dashboard
                - Landing page -> with links to navigate to the other portals
            */}

            {/* Submit a claim, for home and auto */}
            {/* The Agent portal for accessing and handling user claims (no clue what to build here) */}
            
            {/* Backends for handling data, and try out clustering */}

        </LoginContext.Provider>
      </div>
    </AppSpacing>
  );
}


const themeContainerStyles = `bg-white dark:bg-gray-800`;

export default App;
