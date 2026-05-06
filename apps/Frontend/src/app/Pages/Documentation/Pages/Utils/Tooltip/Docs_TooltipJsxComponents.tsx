import { StrictMode, useContext, useMemo } from "react";
import { Icon, TooltipProvider, TooltipService } from "@Project/ReactComponents";
import styled from "@emotion/styled";


export const Example_TextTooltip = () => {
  const { show, hide } = useContext(TooltipService);

  // The tooltip provider and context is safe, so you don't need to memoize their objects to prevent extra rerenders.
  const textTooltipProps = {
    text: 'Tooltip text...',
    styles: 'additional-styles'
  }

  return (
    <div className="p-4 bg-default outline-css outline-styles row justify-between items-center gap-2">
      <p>Hover over the icon for a text tooltip for this element.</p>

      <div onMouseEnter={() => show(textTooltipProps)} onMouseLeave={() => hide()}>
        <Icon variant="OutlineInfo" styles="icon-theme size-6" />
      </div>
    </div>
  );
}


export const Example_CodeTooltip = ({ codeSnippet }: {
  codeSnippet: string;
}) => {
  const { show, hide } = useContext(TooltipService);

  // The tooltip provider and context is safe, so you don't need to memoize their objects to prevent extra rerenders.
  const codeTooltipProps = {
    code: codeSnippet,
    showLineNumbers: true,
    type: 'component'
  };

  return (
    <div className="p-4 bg-default outline-css outline-styles row justify-between items-center gap-2">
      <p>Hover over the icon for a code tooltip for this element.</p>

      <div onMouseEnter={() => show(codeTooltipProps)} onMouseLeave={() => hide()}>
        <Icon variant="OutlineInfo" styles="icon-theme size-6" />
      </div>
    </div>
  );
}


export const Example_CustomTooltip = () => {
  const { show, hide } = useContext(TooltipService);

  // For the sake of the example, we're using a memo, but you should optimally use another component. 
  // Always declare this outside of a component because of how react's handles Reconciliation.
  const customTooltipProps = useMemo(() => {
    return () => (
      <div className="p-2 col gap-2">
        <label>Custom Tooltip</label>
        <p> Custom tooltip description... </p>
      </div>
    );
  }, []);

  return (
    <div className="p-4 bg-default outline-css outline-styles row justify-between items-center gap-2">
      <p>Hover over the icon for a custom tooltip for this element.</p>

      <div onMouseEnter={() => show({ children: customTooltipProps })} onMouseLeave={() => hide()}>
        <Icon variant="OutlineInfo" styles="icon-theme size-6" />
      </div>
    </div>
  );
}


export const Example_TooltipProvider = () => {
  // Add the tooltip provider at the base of your router or the application.
  
  return (
    <StrictMode>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </StrictMode>
  );

/* 
  Usage in components within the TooltipProvider:

    const ComponentWithTooltip = () => {
      const { show, hide } = useContext(TooltipContext);

      return (
        <div 
          onMouseEnter={() => show({ text: "Tooltip text..."})}
          onMouseLeave={() => hide()}
        >
          Component with tooltip
        </div>
      )
    }
*/
};


// Makeshift App
const App = styled.div``;
