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
  const [isVisible, setIsVisible] = useState<boolean>(false); // transitions don't work otherwise + transform gpu rendering
  useEffect(() => { setIsVisible(!!showTooltip) }, [showTooltip]); 

  // Wait until react has done it's initial paint of the application
  useEffect(() => {
    // We should also wait until their computer's cpu is ready 
    const handle = window.requestIdleCallback(() => setShouldRender(true) );
    return () => window.cancelIdleCallback(handle);
  }, []);




  //----------------------------------------//
  // Tooltip transform logic                //
  //----------------------------------------//
  const tooltipRef = useRef<HTMLDivElement>(null); // tooltip component
  const mouse = useRef({ x: 0, y: 0 }); // target location
  const prevMouseLocation = useRef({ x: 0, y: 0 }); // prevent asynchronous errors @see captureMouseMove () & @see animate ()
  const tooltipLocation = useRef({ x: 0, y: 0 }); // interpolated position
  const initialMove = useRef(true); // whether it's the first frame move
  
  // Scroll functionality 
  const currentScroll = useRef(0); 
  const targetScroll = useRef(0);

  useEffect(() => {
    // Retrieve the mouse location and set the initial render location of the tooltip
    const captureMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    
    document.addEventListener('mousemove', captureMouseMove);




    //----------------------------------//
    // The Animation Loop               //
    //----------------------------------//
    if (!showTooltip) return;
    
    let frameId: number;
    const animate = () => {
      const mouseLoc = { ...mouse.current };
      const prevMouseLoc = { ...prevMouseLocation.current };
      const tooltip = tooltipRef.current;
      if (!tooltip) {
        frameId = requestAnimationFrame(animate);
        return;
      }


      //----------------------------------------------------//
      // Scroll Logic @see handleGlobalWheel () for usage   //
      //----------------------------------------------------//
      // currentScroll.current += (targetScroll.current - currentScroll.current) * 0.01;
      const currentScroll = tooltip.scrollTop;
      const nonLinearFactor = 0.0025 + ( (Math.abs(currentScroll - targetScroll.current) / 2000) ); // faster the more you scroll 
      const smoothedScroll = interpFloat(currentScroll, targetScroll.current, nonLinearFactor);
      tooltip.scrollTop = smoothedScroll; 


      //----------------------------------------------------//
      // Interpolation logic                                //
      //----------------------------------------------------//
      let tooltipLoc = { ...tooltipLocation.current };
      let targetLoc = { ...mouseLoc };

      const offsetX = 12;
      const offsetY = 16;
      let shouldPlaceBelow = true;
      const interpSpeed = 0.1;

      // if we're already at the target location
      if (Math.abs(tooltipLoc.x - targetLoc.x) < 0.1 && Math.abs(tooltipLoc.y - targetLoc.y) < 0.1) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      // Adjust the location based on how close the tooltip is to the edge of the screen
      const width = tooltip.offsetWidth;
      const height = tooltip.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // The vertical check needs to determine whether to be above or below the mouse
      shouldPlaceBelow = (mouseLoc.y + offsetY + height) < windowHeight;
      
      // The tooltip should stay on screen when the mouse approaches the edges
      targetLoc.x = Math.min( (mouseLoc.x + offsetX), (windowWidth - (width + offsetX)) );

      // If it should be placed above the mouse, subtract by the tooltip height and invert the offset
      targetLoc.y = mouseLoc.y + offsetY;
      if (!shouldPlaceBelow) targetLoc.y = mouseLoc.y - height - offsetY;


      //----------------------------------------------------//
      // Animation logic                                    //
      //----------------------------------------------------//
      // first frame (direct move)
      if (initialMove.current) {
        tooltipLoc = { ...targetLoc };
        initialMove.current = false;
        frameId = requestAnimationFrame(animate);
      }

      // Smoothly interp to the target location
      else {
        tooltipLoc = interpV2(tooltipLoc, { 
          x: targetLoc.x, 
          y: targetLoc.y 
        }, interpSpeed);
      }

      // Tooltip animation update
      tooltip.style.transform = `translate(calc(${tooltipLoc.x}px), calc(${tooltipLoc.y}px))`;
      tooltipLocation.current = tooltipLoc; // Capture the ref's value from this calculation
      prevMouseLocation.current = { ...mouseLoc };
      
      // Loop the animation
      frameId = requestAnimationFrame(animate);
    };

    // Initial frame call
    frameId = requestAnimationFrame(animate);


    //----------------------------------//
    // Cleanup                          //
    //----------------------------------//
    return () => {
      document.removeEventListener('mousemove', captureMouseMove);
      cancelAnimationFrame(frameId);
      initialMove.current = true;
      
      // Reset the tooltip state
      tooltipLocation.current = { x: 0, y: 0 };
      currentScroll.current = 0;
      targetScroll.current = 0;
    };
  }, [showTooltip]);




  //----------------------------------------//
  // Tooltip Scroll Functionality           //
  //----------------------------------------//
  useEffect(() => {
  if (!showTooltip || !tooltipRef.current) return;

  // If the tooltip is visible, override native scroll to add tooltip scroll @see animate () for usage
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

      const scrollAmount = e.deltaY / 2; // scrolls are in linear increments of 100, we;re using this value additively
      if (!(scrollAmount > 0 && isAtBottom) && !(scrollAmount < 0 && isAtTop)) {
        e.preventDefault(); // Stop page scroll while tooltip is scrolling
        
        // Add to our target, clamped between 0 and max scroll
        const maxScroll = tooltip.scrollHeight - tooltip.clientHeight;
        const scrollBoundOffset = 25; // accounts for custom scrollbar styles
        targetScroll.current = Math.max(
          0 - scrollBoundOffset,
          Math.min(maxScroll + scrollBoundOffset, ( targetScroll.current + scrollAmount ))
        );
      }
    }
  };

  window.addEventListener('wheel', handleGlobalWheel, { passive: false });
  return () => window.removeEventListener('wheel', handleGlobalWheel);
}, [showTooltip]);




  //----------------------------------------//
  // Code Variant Render delay              //
  //----------------------------------------//
  const [isRenderDelayDone, setIsRenderDelayDone] = useState<boolean>(false);
  const { code, showLineNumbers, type = 'example' } = props as CodeTooltipProps;

  // Quick Render delay for jsx code and to enable the scrollbar (to allow other transition css to work via overflow)
  useEffect(() => {
    // Reset the render delay for the next time the tooltip is opened
    if (!isVisible) {
      if (isRenderDelayDone) setIsRenderDelayDone(false);
      return;
    }
    
    // Add a delay before allowing the component to render
    const timeout = setTimeout(() => {
      if (isVisible) setIsRenderDelayDone(true);
      else setIsRenderDelayDone(false);
    }, 300);
      
    return () => clearTimeout(timeout);
  }, [isVisible]);


  // We want this content to be rendered once the page has loaded
  const MemoizedCodeSnippet = useMemo(() => {
    if (!shouldRender) return null;
    return (
      <div className='-my-[7px] react-syntax-highlighter-margin-fix relative'>
        <CodeBlock 
          language='tsx' 
          code={code} 
          showLineNumbers={showLineNumbers} 
          customStyle={{ 
            paddingBottom: '1rem', 
            paddingRight: type == 'component' || type == 'interface' ? '6rem' : '0'
          }}
        />
      </div>
    );
  }, [shouldRender, code]);




  //----------------------------------------//
  // Tooltip variants                       //
  //----------------------------------------//
  // Delay render until the page is loaded
  if (!shouldRender) return <></>;
  
  
  // Union types suck, and nested useStates in wrapped components are breaking transition rerenders
  const { children } = props as CustomTooltipProps;
  const { text } = props as TextTooltipProps;
  const NestedComponents: React.FC = children;
  
  // variants
  let variant: TooltipType = 'none';
  if ('text' in props) variant = 'text';
  else if ('code' in props) variant = 'code';
  else if ('children' in props) variant = 'custom';


  // render
  if (variant == 'none') return <></>;
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
        <CodeVariant className={`col ${type == 'type' || type == 'example' ? 'tooltip-c-type' : 'tooltip-c-class'}`}>

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
                { MemoizedCodeSnippet }
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
