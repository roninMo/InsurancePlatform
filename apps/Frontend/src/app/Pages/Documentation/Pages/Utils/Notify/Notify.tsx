import { ReactNode, useEffect } from 'react';
import styles from './Notify.module.scss';


export interface NotifyProps {
  onLoaded: () => void;
  children: ReactNode;
}

export const Notify = ({ onLoaded, children }: NotifyProps) => {
  useEffect(() => {
    // This runs as soon as the lazy component is inserted into the DOM
    console.log('the content has been loaded!');
    onLoaded();
  }, [onLoaded]);
  
  return (
    <>
      {children}
    </>
  );
}
