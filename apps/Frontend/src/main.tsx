import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// TODO: add background styling that happens before render to prevent page refreshes that reload the wrong theme colors

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
