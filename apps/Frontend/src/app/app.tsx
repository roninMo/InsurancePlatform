/* eslint-disable @typescript-eslint/no-unused-vars */  


import { useState, createContext, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// import  { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';

import styled from '@emotion/styled';
import axios from 'axios';

import { Navbar } from './Components/Navbar/Navbar';
import { Home } from './Components/Home/Home';


const StyledApp = styled.div`
  margin: 0;
  padding: 0;
`;


// https://www.npmjs.com/package/jwt-decode
export interface TokenInformation {
  issuedAt: number;
  exp: number;

  payload?: string;
}

export interface UserTokenInformation extends TokenInformation {
  username: string;
  id: number;
  email: string;
  name: string;
}


// http://npmjs.com/package/react-cookie
export interface CookieData { 
  name: string;
  value: string;
}


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
  // const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  Cookies.get('metadata');

  useEffect(() => {
    // Retrieve login information
    if (!accessToken || !userTokenInformation) {
      getAccessToken();
    }

    // Retrieve Cookies -> metadata, theme info, etc.
    // Cookies.Get('thisWebsite-currentTheme');

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

  return (
    <StyledApp>
      <LoginContext.Provider value={{accessToken, userTokenInformation, setUserTokenInformation}}>
        {/* <Navbar /> */}

        <br />
        <hr />
        <br />
        <div role="navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/page-2">Page 2</Link>
            </li>
          </ul>
        </div>

        
        <br />
        <hr />
        <br />
        <Routes>
          {/* <Route path="/">
            <Home />
          </Route> */}


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
          
          <Route 
            path="/"
            element={
              <div>
                <Home />
              </div>
            } 
          />
          <Route
            path="/page-2"
            element={
              <div>
                <Link to="/">Click here to go back to root page.</Link>
              </div>
            }
          />
        </Routes>
        <br />
        <hr />
        <br />

      </LoginContext.Provider>
    </StyledApp>
  );
}

export default App;
