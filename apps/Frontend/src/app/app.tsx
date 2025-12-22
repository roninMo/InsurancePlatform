// Uncomment this line to use CSS modules
// import styles from './app.module.scss';
import { useEffect, useState } from 'react';
import NxWelcome from './nx-welcome';
import { TokenInformation } from '@Project/Classes';
import { ProjectReactComponents } from '@Project/ReactComponents';

export function App() {
  const [value, setValue] = useState<string>("");
  
  useEffect(() => {
    const token: TokenInformation | null = null;
    console.log({token});
  }, []);

  return (
    <div>
      <ProjectReactComponents></ProjectReactComponents>
      <NxWelcome title="@org/Frontend" />
    </div>
  );
}

export default App;
