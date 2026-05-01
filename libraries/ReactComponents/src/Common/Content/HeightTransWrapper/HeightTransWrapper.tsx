import { ReactNode } from 'react';


export interface HeightTransProps {
  show?: boolean;
  styles?: string;
  cStyles?: string;
  children: ReactNode;

  // custom height trans classes used for specific scenarios.
  heightTransClass?: string;
  heightTransContentClass?: string;
}

// Wrapper for adding smooth open close content transitions to keep dynamic content from popping on the screen.
export const Ht = ({ show, cStyles, styles, children, heightTransClass, heightTransContentClass }: HeightTransProps) => {
  const htClass = heightTransClass ? heightTransClass : 'height-trans';
  const htcClass = heightTransContentClass ? heightTransContentClass : 'height-trans-content';

  return (
    <div className={`
      ${htClass} ${show ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} 
      ${styles ? styles : ''}
    `}>
      <div className={`${htcClass} ${cStyles ? cStyles : ''}`}>
        { children }
      </div>
    </div>
  );
};
