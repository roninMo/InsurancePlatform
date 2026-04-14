import { createContext, useMemo, useState } from "react";
import { Tooltip, TooltipServiceProps } from "../Tooltip";



// Tooltip Context 
export const TooltipService = createContext<TooltipActions>({show: (c) => {}, hide: () => {}, });
interface TooltipActions {
  show: (config?: TooltipServiceProps) => void;
  hide: () => void;
}


// Tooltip Provider
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
  
*/
