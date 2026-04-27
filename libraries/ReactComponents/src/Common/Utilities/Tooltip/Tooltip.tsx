import { ReactNode, RefObject, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { CodeRenderer } from '../CodeSnippets/CodeRenderer';
import { Icon } from '../../Icons/Icon';
import { Ht } from '../../Content/HeightTransWrapper/HeightTransWrapper';
import { interpFloat, interpV2 } from '../Utils';

import styled from '@emotion/styled';
import styles from './Tooltip.module.scss';


// Tooltip variants 
export type TooltipType = 'text' | 'code' | 'custom' | 'none';
export type TooltipProps = TooltipBase & TooltipContentProps; 
export type TooltipContentProps = TextTooltipProps | CodeTooltipProps | CustomTooltipProps;
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
  // #region Transform Logic
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


      //--------------------------//
      // Smoothed scroll logic    //
      //--------------------------//
      const scrollDelta = targetScroll.current - currentScroll.current; // with @see handleGlobalWheel
      if (Math.abs(scrollDelta) > 0.1) {
        const nonLinearFactor = 0.025 + (Math.abs(scrollDelta) / 4000);
        currentScroll.current = interpFloat(currentScroll.current, targetScroll.current, nonLinearFactor);
        tooltip.scrollTop = Math.round(currentScroll.current); // - quick, then eases to a stop.
      }

      //--------------------------//
      // Interpolation logic      //
      //--------------------------//
      let tooltipLoc = { ...tooltipLocation.current };
      let targetLoc = { ...mouseLoc };

      const spacingOffset = 16; // used specifically for window bounds
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
      targetLoc.x = Math.min( (mouseLoc.x + offsetX), (windowWidth - (width + offsetX + spacingOffset)) );

      // If it should be placed above the mouse, subtract by the tooltip height and invert the offset
      targetLoc.y = mouseLoc.y + offsetY;
      if (!shouldPlaceBelow) targetLoc.y = mouseLoc.y - height - offsetY;


      //----------------------------------//
      // Animation logic                  //
      //----------------------------------//
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
      // tooltip.style.transform = `translate(calc(${tooltipLoc.x}px), calc(${tooltipLoc.y}px))`;
      // we're not combining location values with translate percents for placement
      // so calc isn't needed, and decimal pixels could cause a blurred render, so:
      tooltip.style.transform = `translate(${Math.round(tooltipLoc.x)}px, ${Math.round(tooltipLoc.y)}px)`;

      /** Capture the ref's value from this calculation */
      tooltipLocation.current = tooltipLoc; 
      prevMouseLocation.current = { ...mouseLoc };


      //----------------------------------//
      // Animation loop                   //
      //----------------------------------//
      frameId = requestAnimationFrame(animate);
    };



    //----------------------------------//
    // Scroll Logic                     //
    //----------------------------------//
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

        const scrollAmount = e.deltaY /// 2; // scrolls are in linear increments of 100, we're using this value additively
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



    // Initial frame call
    document.addEventListener('mousemove', captureMouseMove);
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    frameId = requestAnimationFrame(animate);

    //----------------------------------//
    // Cleanup                          //
    //----------------------------------//
    return () => {
      document.removeEventListener('mousemove', captureMouseMove);
      window.removeEventListener('wheel', handleGlobalWheel);
      cancelAnimationFrame(frameId);
      initialMove.current = true;
      
      // Reset the tooltip state
      tooltipLocation.current = { x: 0, y: 0 };
      currentScroll.current = 0;
      targetScroll.current = 0;
    };
  }, [showTooltip]);
  // #endregion




  //----------------------------------------//
  // Code Snippet and Render delay          //
  //----------------------------------------//
  // #region Code Snippet and Render Delay
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
        <CodeRenderer 
          language='tsx' 
          code={code} 
          showLineNumbers={showLineNumbers} 
          customStyle={{ 
            paddingBottom: '1rem', 
            paddingRight: type == 'component' || type == 'interface' ? '6rem' : '1rem'
          }}
        />
      </div>
    );
  }, [shouldRender, code]);
  // #endregion




  //----------------------------------------//
  // Copy code on hover                     //
  //----------------------------------------//
  // #region Copy Code Snippet Animation
  const copiedSnippetRef = useRef<HTMLDivElement>(null);
  const copyShortcutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!('code' in props)) return;
    const copyCodeSnippet = async () => {
      try {
        await navigator.clipboard.writeText(code || '');
        restartCopiedAnimation();
      } catch (err) {
        console.error('Tooltip failed to copy: ', err);
      }
    }
    
    const restartCopiedAnimation = () => {
      const copyShortcutEl = copyShortcutRef.current;
      const copiedNotification = copiedSnippetRef.current;
      if (!copiedNotification || !copyShortcutEl) return;

      // hide the shortcut and notify the user it was copied to clipboard
      copyShortcutEl.classList.remove('animate-fade-pulse-i');
      copiedNotification.classList.remove('animate-fade-pulse');
      
      // Force reflow: This tells the browser to recalculate styles immediately
      void copiedNotification.offsetWidth; 
      
      copyShortcutEl.classList.add('animate-fade-pulse-i');
      copiedNotification.classList.add('animate-fade-pulse');
    };

    window.addEventListener('copy', copyCodeSnippet);
    return () => window.removeEventListener('copy', copyCodeSnippet);
  }, [showTooltip]);
  // #endregion




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
          <OpenAnimation show={isRenderDelayDone} cStyles='col gap-2' heightTransClass='height-trans-500'>
            <AnimContent className='rowStart items-center gap-4'>
              <label className='p-2'>
                {type == 'component' || type == 'interface' || type == 'type' 
                  ? 'Code' 
                  : 'Example'
                }
              </label>

              <div className='grid grid-cols-1 justify-items-start items-center'>
                <div ref={copyShortcutRef} className='row-start-1 col-start-1 tooltip-copy-text'>
                  Ctrl + /
                </div>

                <div ref={copiedSnippetRef} className='row-start-1 col-start-1 tooltip-copied-notification'>
                  Copied to clipboard
                  <Icon variant='Checkbox' styles='tooltip-copied-icon' />
                </div>
              </div>
            </AnimContent>
            <Suspense>
              { MemoizedCodeSnippet }
            </Suspense>
          </OpenAnimation>

          <OpenAnimation show={!isRenderDelayDone} cStyles='content-auto' heightTransClass='height-trans-500'>
            <p className='p-2 italic loading-text'>Loading code...</p>
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
const OpenAnimation = styled(Ht)``;
const AnimContent = styled.div``;
const CodeVariant = styled.div``;
