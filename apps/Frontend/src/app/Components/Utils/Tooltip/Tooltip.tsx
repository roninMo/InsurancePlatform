import { ReactNode, RefObject, Suspense, useEffect, useMemo, useRef } from 'react';
import { CodeBlock } from '../../../Pages/Documentation/Documentation';

import styles from './Tooltip.module.scss';


export interface TooltipProps {
  coords: DOMRect;
  opts: TooltipStyling & (TextTooltipProps | CodeTooltipProps | CustomTooltipProps);
}

/* A universal tooltip that can be used with any component. */
export const Tooltip = ({coords, opts }: TooltipProps) => {
  const { additionalStyles } = opts;
  const tooltipRef = useRef<HTMLDivElement>(null); // update outside of react's render updates
  const tooltipCoords = useRef<{ x: number, y: number}>({ x: 0, y: 0 });

  // Capture the mouse's current location
  useEffect(() => {
    const trackMouseCoordinates = (e: globalThis.MouseEvent) => {
      const coordinates = { x: e.clientX, y: e.clientY };
      tooltipCoords.current = coordinates;
      
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = 
          `translate(${e.clientX + 12}px, ${e.clientY + 16}px)`;
      }

    }

    // Handle construction and teardown of the event listener
    document.addEventListener('mousemove', trackMouseCoordinates);
    return () => document.removeEventListener('mousemove', trackMouseCoordinates);
  }, []);


  //------------------------------//
  // Text tooltip                 //
  //------------------------------//
  if ('text' in opts) {
    const { text } = opts;

    return (
      <TooltipContainer addStyles={additionalStyles} ref={tooltipRef}>
        { text }
      </TooltipContainer>
    );
  }


  //------------------------------//
  // Code Snippet tooltip         //
  //------------------------------//
  if ('code' in opts) {
    const { code, showLineNumbers } = opts;

    return (
      <TooltipContainer addStyles={additionalStyles} ref={tooltipRef}>
        <Suspense>
          <MemoizedCodeSnippet jsx={code} showLineNumbers={showLineNumbers} />
        </Suspense>
      </TooltipContainer>
    );
  }


  //------------------------------//
  // custom tooltip               //
  //------------------------------//
  if ('children' in opts) {
    const { children } = opts;
    const NestedComponents: React.FC = children;

    return (
      <TooltipContainer addStyles={additionalStyles} ref={tooltipRef}>
        { NestedComponents && <NestedComponents /> }
      </TooltipContainer>
    );
  }

  // return <></>;
  return (
    <TooltipContainer addStyles={additionalStyles} ref={tooltipRef}>
      Tooltip Component
    </TooltipContainer>
  );
}


// Utility function for retrieving the tooltip's focus element's coordinates
export const getTooltipCoords = (
  event: React.MouseEvent,
  show: (rect: DOMRect, payload: any) => void,
  tooltipProps: any
) => {
  // Get the exact size and position of the element
  const rect = event.currentTarget.getBoundingClientRect(); // If this returns an empty object try retrieving the dimensions
  show(rect, tooltipProps);
  // console.log(`\nrendering the tooltip: `, event, {rect, tooltipProps});
}


// Tooltip variants 
export interface TextTooltipProps {
  text: string;
}

export interface CodeTooltipProps {
  code: string;
  showLineNumbers?: boolean;
}

export interface CustomTooltipProps {
  children: React.FC;
}

export interface TooltipStyling {
  additionalStyles?: string;
}


// Tooltip Wrapper
const TooltipContainer = ({ 
  children, 
  styles, 
  addStyles,
  ref 
}: { children: ReactNode; styles?: any; addStyles?: string; ref: RefObject<HTMLDivElement | null>; }) => {
  return (
    <div className={`tooltip ${addStyles}`} ref={ref}>
      { children }
    </div>
  );
}

// Memoized Suspense CodeBlock Renderer for react-syntax-highlighter
const MemoizedCodeSnippet = ({ jsx, showLineNumbers }: { jsx: string, showLineNumbers?: boolean }) => {
  // Do not rerender react-syntax-highlighter's import, it still takes time in the DOM to render and is very slow
  const memoizedSnippet = useMemo(() => (
    <div className='-my-[7px] react-syntax-highlighter-margin-fix relative'>
      <CodeBlock language='tsx' code={jsx} showLineNumbers={showLineNumbers} />
    </div>
  ), [jsx]);

  return memoizedSnippet;
}
