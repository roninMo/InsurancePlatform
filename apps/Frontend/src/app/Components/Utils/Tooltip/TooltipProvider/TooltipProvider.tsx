import { createContext, useState } from "react";
import { Tooltip } from "../Tooltip";


// Tooltip Context 
export const TooltipContext = createContext({
  show: (rect: DOMRect, payload: any) => {},
  hide: () => {},
});

// TooltipContext.tsx
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<any>({});
  const [coords, setCoords] = useState<DOMRect | null>(null);
  
  const show = (rect: DOMRect, payload: any) => { 
    setCoords(rect); 
    setData(payload); 
  };


  // Now, only components inside THIS provider re-render when state changes
  return (
    <TooltipContext.Provider value={{ show, hide: () => setCoords(null) }}>
      {children}
      {coords && <Tooltip coords={coords} opts={data} />}
    </TooltipContext.Provider>
  );
};

/* 
  Usage:
  
    - const { show, hide } = useContext(TooltipContext);

    - onMouseEnter={(e) => show(e.currentTarget.getBoundingClientRect(), { text, code, type: 'code' })}
    - onMouseLeave={hide}
  
*/
