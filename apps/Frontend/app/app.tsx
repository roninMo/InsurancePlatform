/* eslint-disable @typescript-eslint/no-unused-vars */


import { useState } from 'react';
import NxWelcome from './nx-welcome';

import styles from './app.module.scss';

export function App() {
  const [value, setValue] = useState<string>();

  return (
    <div>
      <NxWelcome title="@org/Frontend" />
    </div>
  );
}

export default App;
