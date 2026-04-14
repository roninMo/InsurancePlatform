import { ReactNode, RefObject, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { CodeBlock } from '../../../Pages/Documentation/Documentation';

import styles from './Tooltip.module.scss';
import styled from '@emotion/styled';
import { interpFloat, interpV2 } from '@Project/ReactComponents';


// Tooltip variants 
export type TooltipType = 'text' | 'code' | 'custom' | 'none';
export type TooltipProps = TooltipBase & (TextTooltipProps | CodeTooltipProps | CustomTooltipProps); 
export type TooltipServiceProps = TextTooltipProps | CodeTooltipProps | CustomTooltipProps;
export interface TextTooltipProps {
  text: string;
}

export interface CodeTooltipProps {
  code: string;
  showLineNumbers?: boolean;
  type?: 'component' | 'type' | 'interface' | 'example';
}

export interface CustomTooltipProps {
  children: React.FC;
}

export interface TooltipBase {
  showTooltip?: boolean;
  additionalStyles?: string;
}


/* A universal tooltip that can be used with any component. */
export const Tooltip = (props: TooltipProps) => {
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const { showTooltip, additionalStyles } = props;
  const [isVisible, setIsVisible] = useState<boolean>(false); // transitions don't work otherwise
  useEffect(() => { setIsVisible(!!showTooltip) }, [showTooltip]); 

  // Wait until react has done it's initial paint of the application
  useEffect(() => {
    // We should also wait until their computer's cpu is ready 
    const handle = window.requestIdleCallback(() => {
      setShouldRender(true); 
    });
    return () => window.cancelIdleCallback(handle);
  }, []);




  //----------------------------------------//
  // Tooltip transform logic                //
  //----------------------------------------//
  const tooltipRef = useRef<HTMLDivElement>(null); // update outside of react's render updates
  const currentScroll = useRef(0);
  const targetScroll = useRef(0);
  const mouse = useRef({ x: 0, y: 0 }); // Target
  const tooltipLoc = useRef({ x: 0, y: 0 }); // Interpolated position
  const initialMove = useRef(true);

  useEffect(() => {
    if (!showTooltip) return;

    // Retrieve the mouse location and set the initial render location of the tooltip
    const captureMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      if (initialMove.current && tooltipRef.current) {
        tooltipLoc.current = { x: mouse.current.x, y: mouse.current.y };
        initialMove.current = false;
      }
    };

    // The Animation Loop
    let frameId: number;
    const animate = () => {
      // Scroll logic
      currentScroll.current = interpFloat(currentScroll.current, targetScroll.current, 0.05);
      if (tooltipRef.current) { // Adjust the scroll location using the scrollTop (how much we've scrolled)
        tooltipRef.current.scrollTop = currentScroll.current;
      }

      // Interpolation logic
      // skip first frame interpolation
      if (initialMove.current || (mouse.current.x === 0 && mouse.current.y === 0)) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      // Interpolate the tooltip location
      tooltipLoc.current = interpV2(tooltipLoc.current, mouse.current, 0.25);
      if (tooltipRef.current) tooltipRef.current.style.transform = 
        `translate(${tooltipLoc.current.x + 12}px, ${tooltipLoc.current.y + 16}px)`;
      frameId = requestAnimationFrame(animate); // loop
    };

    // Events and animation
    // Add the events and animations for the tooltip
    document.addEventListener('mousemove', captureMouseMove);
    frameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', captureMouseMove);
      cancelAnimationFrame(frameId);
      initialMove.current = true;
      
      // Reset the tooltip state
      tooltipLoc.current = { x: 0, y: 0 };
      mouse.current = { x: 0, y: 0 };
      currentScroll.current = 0;
      targetScroll.current = 0;
    };
  }, [showTooltip]);




  //----------------------------------------//
  // Tooltip Scroll Functionality           //
  //----------------------------------------//
  useEffect(() => {
  if (!isVisible || !tooltipRef.current) return;

  const handleGlobalWheel = (e: WheelEvent) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    // Check if the tooltip is currently overflowed
    const isOverflowed = tooltip.scrollHeight > tooltip.clientHeight;
    
    // stop the page from scrolling past the top/bottom so the user can read the tooltip content.
    if (isOverflowed) {
      const isAtBottom = tooltip.scrollTop + tooltip.clientHeight >= tooltip.scrollHeight;
      const isAtTop = tooltip.scrollTop <= 0; 
      // scrollTop (how many pixels have been scrolled up and are out of view)
      // scrollHeight (the dimensions of the content, including what the overflow hides)
      // clientHeight (the dimensions of the overflow element, not the page location)

      const scrollAmount = e.deltaY / 1.5;
      if (!(scrollAmount > 0 && isAtBottom) && !(scrollAmount < 0 && isAtTop)) {
        e.preventDefault(); // Stop page scroll while tooltip is scrolling
        
        // Add to our target, clamped between 0 and max scroll
        const maxScroll = tooltip.scrollHeight - tooltip.clientHeight;
        targetScroll.current = Math.max(0, Math.min(maxScroll, targetScroll.current + scrollAmount));
      }
    }
  };

  window.addEventListener('wheel', handleGlobalWheel, { passive: false });
  return () => window.removeEventListener('wheel', handleGlobalWheel);
}, [isVisible]);



  //----------------------------------------//
  // Code Variant Render delay              //
  //----------------------------------------//
  const [isRenderDelayDone, setIsRenderDelayDone] = useState<boolean>(false);

  // Quick Render delay for jsx code and to enable the scrollbar (to allow other transition css to work via overflow)
  useEffect(() => {
    // Reset the render delay for the next time the tooltip is opened
    if (!showTooltip && isRenderDelayDone) setIsRenderDelayDone(false);
    
    // Add a delay before allowing the component to render
    if (isRenderDelayDone) return;
    const timeout = setTimeout(() => setIsRenderDelayDone(true), 300);
    return () => clearTimeout(timeout);
  }, [showTooltip]);




  //----------------------------------------//
  // Tooltip variants                       //
  //----------------------------------------//
  // Delay render until the page is loaded
  if (!shouldRender) return <></>;
  
  
  // Union types suck, and nested useStates in wrapped components are breaking transition rerenders
  const allProps = props as TextTooltipProps & CodeTooltipProps & CustomTooltipProps;
  const { 
    text, // TextTooltipProps
    code, showLineNumbers, type, // CodeTooltipProps
    children // CustomTooltipProps
  } = allProps;
  const NestedComponents: React.FC = children;
  
  // variants
  let variant: TooltipType = 'none';
  if ('text' in props) variant = 'text';
  else if ('code' in props) variant = 'code';
  else if ('children' in props) variant = 'custom';
  
  return (
    <div 
      ref={tooltipRef} 
      className={`
        tooltip ${additionalStyles}
        ${variant == 'text' ? 'tooltip-t' : variant == 'code' ? 'tooltip-js' : 'tooltip-c'}
        ${isVisible ? 'tooltip-v' : 'tooltip-h'}
        ${isRenderDelayDone ? 'tooltip-scroll-auto' : 'tooltip-scroll-none'}
      `}
    >
      { variant == 'code' ? 
        <CodeVariant className='col'>

          {/* Keeps transitions while using suspense and a lazy import */}
          <OpenAnimation className={`height-trans-500 ${isRenderDelayDone ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <AnimContent className='height-trans-content content-auto col gap-2'>
              <label className='p-2'>
                {type == 'component' || type == 'interface' || type == 'type' 
                  ? 'Code' 
                  : 'Example'
                }
              </label>
              <Suspense>
                <MemoizedCodeSnippet jsx={code} showLineNumbers={showLineNumbers} />
              </Suspense>
            </AnimContent>
          </OpenAnimation>

          <OpenAnimation className={`height-trans-500 ${!isRenderDelayDone ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <AnimContent className='height-trans-content content-auto'>
              <p className='p-2 italic loading-text'>Loading code...</p>
            </AnimContent>
          </OpenAnimation>
        </CodeVariant>

      : variant == 'text' ?
        <> {text} </>
      
      : variant == 'custom' ?
      <> { NestedComponents && <NestedComponents /> } </>
      
      : <></> }
    </div>
  );
}


// Styled Components
const OpenAnimation = styled.div``;
const AnimContent = styled.div``;
const CodeVariant = styled.div``;


// Memoized Suspense CodeBlock Renderer for react-syntax-highlighter
const MemoizedCodeSnippet = ({ jsx, showLineNumbers = false }: { jsx: string, showLineNumbers?: boolean }) => {
  // Do not rerender react-syntax-highlighter's import, it still takes time in the DOM to render and is very slow
  const memoizedSnippet = useMemo(() => (
    <div className='-my-[7px] react-syntax-highlighter-margin-fix relative'>
      <CodeBlock language='tsx' code={jsx} showLineNumbers={showLineNumbers} />
    </div>
  ), [jsx]);

  return memoizedSnippet;
}
