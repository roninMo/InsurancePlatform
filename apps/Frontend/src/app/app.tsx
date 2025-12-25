import { ChangeEvent, createContext, SyntheticEvent, useEffect, useId, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import { UserTokenInformation } from '@Project/Classes';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Cookies from 'js-cookie';
import styled from '@emotion/styled';

import NxWelcome from './nx-welcome';
import { Button, Input, ProjectReactComponents, TooltipIcon } from '@Project/ReactComponents';
import { ElDropdown, ElMenu, ElOption, ElOptions, ElSelect, ElSelectedcontent } from '@tailwindplus/elements/react';


const AppSpacing = styled.div`
  margin: 0;
  padding: 0;
  min-width: 100vh;
  min-height: 100vh;
`;
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

  const InputId = useId();
  const [input, setInput] = useState<string>("");

  const InputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value;
    setInput(newValue);

    console.log({Event: e, newValue});
  }

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const buttonPress = (e: any) => {
    setError(!error); 
    setErrorMessage("Invalid text."); 
    
    console.log('set error to ', !error);
  }

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

          <div className='m-10'>
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


            {/* <div className={"mx-auto sm:px-6 lg:px-8 " + styles}> */} 
            <div className=' grid grid-cols-12 gap-x-6 gap-y-4 px-6 py-4 bg-slate-900'>
              <div className='col-span-6 md:col-span-6'>
                <Input 
                  type="email"
                  name="Input"
                  label="Input"
                  description=""
                  value={input}
                  placeholder="yourname@email.com"
                  id={InputId}

                  onChange={InputChanged}
                  // onBlur={onBlur}
                  // onFocus={onFocus}
                  // onClick={mouseClick}

                  error={error}
                  errorMessage={errorMessage}
                  required={false}
                  disabled={false}

                  autocomplete='email'
                />
              </div>

              <div className='col-span-12 mt-2'>
                <Button displayText="Toggle Error" onClick={buttonPress} />
              </div>
              
              <div className='pb-10'></div>
              

                <button className="
                  flex flex-row justify-end items-end gap-2 rounded-md 
                  bg-white dark:bg-slate-800
                  *:bg-white *:dark:bg-slate-800
                  border border-zinc-300 dark:border-white/10 
                  w-max h-max p-2 
                  
                  relative 
                  group 
                  transition-all duration-200 ease-in
                  *:transition-all *:duration-200 *:ease-in
                  
                  overflow-hidden 
                  focus:overflow-visible 
                  
                  *:opacity-0
                  *:focus:opacity-100
                  "
                  // *:opacity-0 *:focus:opacity-100 
                >
                  

                  <span>
                    Dropdowngfdfsgds
                  </span>
                  <svg className="rotate-90 group-focus:rotate-180" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                    viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z" />
                  </svg>

                  {/* Dropdown items */}
                  <div className="absolute shadow-lg -bottom-40 left-0 w-full h-max p-2 bg-white border border-zinc-200 dark:border-white/10  rounded-lg flex flex-col gap-2">
                    <span className="flex flex-row gap-2 items-center hover:bg-zinc-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                        <path fill="currentColor"
                          d="M12 5q-.425 0-.712-.288T11 4V2q0-.425.288-.712T12 1q.425 0 .713.288T13 2v2q0 .425-.288.713T12 5m4.95 2.05q-.275-.275-.275-.687t.275-.713l1.4-1.425q.3-.3.712-.3t.713.3q.275.275.275.7t-.275.7L18.35 7.05q-.275.275-.7.275t-.7-.275M20 13q-.425 0-.713-.288T19 12q0-.425.288-.712T20 11h2q.425 0 .713.288T23 12q0 .425-.288.713T22 13zm-8 10q-.425 0-.712-.288T11 22v-2q0-.425.288-.712T12 19q.425 0 .713.288T13 20v2q0 .425-.288.713T12 23M5.65 7.05l-1.425-1.4q-.3-.3-.3-.725t.3-.7q.275-.275.7-.275t.7.275L7.05 5.65q.275.275.275.7t-.275.7q-.3.275-.7.275t-.7-.275m12.7 12.725l-1.4-1.425q-.275-.3-.275-.712t.275-.688q.275-.275.688-.275t.712.275l1.425 1.4q.3.275.288.7t-.288.725q-.3.3-.725.3t-.7-.3M2 13q-.425 0-.712-.288T1 12q0-.425.288-.712T2 11h2q.425 0 .713.288T5 12q0 .425-.288.713T4 13zm2.225 6.775q-.275-.275-.275-.7t.275-.7L5.65 16.95q.275-.275.687-.275t.713.275q.3.3.3.713t-.3.712l-1.4 1.4q-.3.3-.725.3t-.7-.3M12 18q-2.5 0-4.25-1.75T6 12q0-2.5 1.75-4.25T12 6q2.5 0 4.25 1.75T18 12q0 2.5-1.75 4.25T12 18m0-2q1.65 0 2.825-1.175T16 12q0-1.65-1.175-2.825T12 8q-1.65 0-2.825 1.175T8 12q0 1.65 1.175 2.825T12 16m0-4" />
                      </svg>
                      <p>Light</p>
                    </span>

                    <span className="flex flex-row gap-2 items-center hover:bg-zinc-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                        <path fill="currentColor"
                          d="M12 21q-3.775 0-6.387-2.613T3 12q0-3.45 2.25-5.988T11 3.05q.325-.05.575.088t.4.362q.15.225.163.525t-.188.575q-.425.65-.638 1.375T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q.775 0 1.538-.225t1.362-.625q.275-.175.563-.162t.512.137q.25.125.388.375t.087.6q-.35 3.45-2.937 5.725T12 21m0-2q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5 12q0 2.9 2.05 4.95T12 19m-.25-6.75" />
                      </svg>
                      <p>Dark</p>
                    </span>

                    <span className="flex flex-row gap-2 items-center hover:bg-zinc-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48">
                        <g fill="none" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 32h10v9H19z" />
                          <rect width="38" height="24" x="5" y="8" rx="2" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M22 27h4M14 41h20" />
                        </g>
                      </svg>
                      <p>System</p>
                    </span>

                  </div>
                </button>



            </div>
          </div>
          


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
