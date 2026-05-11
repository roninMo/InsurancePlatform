import { useMemo } from "react";
import { HashLink } from "../../../../../Components/Utils/HashLink/HashLink";


export const Example_DefaultHashLink = () => {
  return (
    <div className="p-4 bg-default outline-css outline-default col gap-4">
      <HashLink label="Router HashLink" url="./#param-table" />

      {/* Alternatively, here's what you can pass in */}
      {/* <HashLink 
        type="router" // By default
        label="Click Me" 
        url="./#param-table"
        state={{ // optional state to pass to the navigate function (must be memoized) }}
        styles="link-text"
      /> */}

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
        labore et dolore magna aliqua.
      </p>
    </div>
  );
}


export const Example_PageHashLink = () => {
  return (
    <div className="p-4 bg-default outline-css outline-default col gap-4">
      <HashLink label="Page HashLink" type="page" url="https://react-hook-form.com/" />

      {/* Alternatively, here's what you can pass in */}
      {/* <HashLink 
        type="page"
        label="Click Me" 
        url="https://react-hook-form.com/"
        state={{ // optional state to pass to the navigate function (must be memoized) }}
        styles="link-text"
      /> */}
      
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
        labore et dolore magna aliqua.
      </p>
    </div>
  );
}


export const Example_UseNavigateHashLink = () => {
  
  // If you need to prevent rerenders for performance reasons, opts or state must be memoized for efficiency.
  const customNavOpts: NavigateOptions = useMemo(() => {
    return {
      replace: true, // Replace the current history state
      state: { /* additional state is added and memoized with the hashLink's default state functionality */}
    }
  }, []);

  return (
    <div className="p-4 bg-default outline-css outline-default col gap-4">
      <HashLink 
        label="useNavigate HashLink" 
        type="useNavigate" 
        opts={customNavOpts}
        url="/Documentation/Utils/Modal" 
      />
      
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
        labore et dolore magna aliqua.
      </p>
    </div>
  );
}


export const Example_CustomHashLink = () => {
  
  // If you need to prevent rerenders for performance reasons, opts or state must be memoized for efficiency.
  const customNavState = useMemo(() => {
    return { 
      customState: true, 
      /* additional state is added and memoized with the hashLink's default state functionality */
    }
  }, []);

  return (
    <div className="p-4 bg-default outline-css outline-default col gap-4">
      <HashLink url="/Documentation/Utils/Modal" state={customNavState} styles="p-4 col gap-2 bg-div outline-css outline-styles transition-all hover:outline-focus">
        {/* Add any content here. */}
        <h5 className="pb-2 link-text"> Custom HashLink </h5>
        <p> HashLink Content  </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
          labore et dolore magna aliqua.
        </p>
      </HashLink>
      
    </div>
  );
}

// @note Copied from react-router-dom 7.11.0 for code snippet refs
interface NavigateOptions {
    /** Replace the current entry in the history stack instead of pushing a new one */
    replace?: boolean;
    
    /** Adds persistent client side routing state to the next location */
    state?: any;
    
    /** If you are using {@link https://api.reactrouter.com/v7/functions/react_router.ScrollRestoration.html <ScrollRestoration>}, 
     * prevent the scroll position from being reset to the top of the window when navigating 
     */
    preventScrollReset?: boolean;
    /** Defines the relative path behavior for the link. 
     * "route" will use the route hierarchy so ".." will remove all URL segments 
     * of the current route pattern 
     * while "path" will use the URL path so ".." will remove one URL segment. 
     */
    relative?: "route" | "path";
    
    /** Wraps the initial state update for this navigation in a 
     * {@link https://react.dev/reference/react-dom/flushSync ReactDOM.flushSync} call 
     * instead of the default {@link https://react.dev/reference/react/startTransition React.startTransition} 
     */
    flushSync?: boolean;
    
    /** Enables a {@link https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API View Transition} 
     * for this navigation by wrapping the final state update in `document.startViewTransition()`. 
     * If you need to apply specific styles for this view transition, you will also need to leverage the 
     * {@link https://api.reactrouter.com/v7/functions/react_router.useViewTransitionState.html useViewTransitionState()} hook.  
     */
    viewTransition?: boolean;
    
    /** Specifies the default revalidation behavior after this submission */
    unstable_defaultShouldRevalidate?: boolean;
}
