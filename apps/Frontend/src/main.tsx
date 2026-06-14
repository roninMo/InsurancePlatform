import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import devlog from '@Project/ReactComponents/Common/Utilities/Logging/Devlog';
import App from './app/app';

// Add the custom logging
devlog.initializeLogFunctions();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// TODO: add background styling that happens before render to prevent page refreshes that reload the wrong theme colors

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
