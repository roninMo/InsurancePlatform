import { Route, Routes, Link } from 'react-router-dom';
import styled from '@emotion/styled';

import Home from './components/home';


const StyledApp = styled.div`
  margin: 0;
  padding: 0;
`;

export function App() {
  return (
    <StyledApp>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
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
      {/* END: routes */}

    </StyledApp>
  );
}

export default App;
