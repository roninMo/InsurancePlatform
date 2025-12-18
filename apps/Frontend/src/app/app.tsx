import { Route, Routes, Link } from 'react-router-dom';
import styled from '@emotion/styled';

import { Home } from './components/Home/Home';
import { Navbar } from './components/Navbar/Navbar';


const StyledApp = styled.div`
  margin: 0;
  padding: 0;
`;


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

export interface CookieData {
  name: string;
  value: string;
}



export function App() {
  return (
    <StyledApp>
      <Navbar />

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

    </StyledApp>
  );
}

export default App;
