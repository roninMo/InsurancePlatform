import { useRef, useEffect } from "react";
import { LogRenderData } from "./DevLog";


/** The DevlogCompHierarchyBuilder adds this to components to capture why a component is rerendering, for contextual troubleshooting in a component hierarchy */
export function useRenderTracker(compId: string, currentProps: Record<string, any>): LogRenderData {
  const renderCountRef = useRef(0);
  const prevPropsRef = useRef<Record<string, any>>({});
  
  renderCountRef.current++;
  
  const isInitialRender = renderCountRef.current === 1;
  const propsChanged: Record<string, { prev: any; next: any }> = {};
  
  if (!isInitialRender) {
    // Diff the props exactly how React does under the hood
    for (const key in currentProps) {
      if (!Object.is(prevPropsRef.current[key], currentProps[key])) {
        propsChanged[key] = {
          prev: prevPropsRef.current[key],
          next: currentProps[key]
        };
      }
    }
  }
  
  // Preserve the current props for the next evaluation frame
  prevPropsRef.current = { ...currentProps };
  
  return {
    propsChanged,
    isInitialRender,
    renderCount: renderCountRef.current
  };
}