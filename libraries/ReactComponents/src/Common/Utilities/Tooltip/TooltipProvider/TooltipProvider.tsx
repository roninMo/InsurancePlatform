import { createContext, useMemo, useState } from "react";
import { Tooltip, TooltipProps, TooltipServiceProps } from "../Tooltip";


// Tooltip Context - pass in props to show() to render your own dynamic content @see tooltip.tsx
export const TooltipService = createContext<TooltipActions>({show: (c) => {}, hide: () => {}, });
export interface TooltipActions { // These are stable refs, calling them won't cause rerenders
  show: (config?: TooltipServiceProps) => void;
  hide: () => void;
}


// Tooltip Provider. Wrapped around the router to create a performant tooltip for any component to use efficiently without rerenders
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [tooltipProps, setTooltipProps] = useState<any>({});

  const actions = useMemo<TooltipActions>(() => ({
    show: (config: any) => {
      setIsVisible(true);
      setTooltipProps(config);
    },
    hide: () => {
      setIsVisible(false);
      setTooltipProps(undefined);
    },
  }), []);


  // Now, only components inside THIS provider re-render when state changes
  return (
    <TooltipService.Provider value={actions}>
      {children}
      <Tooltip { ...tooltipProps } showTooltip={isVisible} />
    </TooltipService.Provider>
  );
};


/* 
  Usage:
  
    - const { show, hide } = useContext(TooltipContext);

    - onMouseEnter={(e) => show({ text: 'Tooltip Text' })}
    - onMouseLeave={hide}
  

  When passed as props:

    - tooltipContext: TooltipActions
    - tooltipContent: TooltipProps

*/
