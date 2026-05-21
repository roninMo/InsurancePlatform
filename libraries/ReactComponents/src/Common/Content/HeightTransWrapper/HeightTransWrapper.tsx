import { ReactNode } from 'react';


export interface HeightTransProps {
  /** The condition to show / hide the content via transition. */
  show?: boolean;
  
  /** The styles of the height trans container. This is the actual element's container, not where the content is placed. */
  styles?: string;
  
  /** The content container's styles. */
  cStyles?: string;
  
  /** The rendered children that are nested within this html element. */
  children: ReactNode;

  // custom height trans classes used for specific scenarios.
  /** An optional custom height transition class. */
  heightTransClass?: string;
  
  /** An optional custom height transition content class. */
  heightTransContentClass?: string;
  
  /** Apparently supported with new browsers, uses interpolate size for real time transitions, not just rerenders. Feels useless however it sounds useful. */
  dynamic?: boolean;
}

// Wrapper for adding smooth open close content transitions to keep dynamic content from popping on the screen.
export const Ht = ({ show, cStyles, styles, children, heightTransClass, heightTransContentClass, dynamic }: HeightTransProps) => {
  const htClass = heightTransClass ? heightTransClass : 'height-trans';
  const htcClass = heightTransContentClass ? heightTransContentClass : 'height-trans-content';

  return (
    <div className={`
      ${htClass} ${show ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} 
      ${styles ? styles : ''}
      ${dynamic ? 'dynamic-trans' : ''}
    `}>
      <div className={`${htcClass} ${cStyles ? cStyles : ''}`}>
        { children }
      </div>
    </div>
  );
};
