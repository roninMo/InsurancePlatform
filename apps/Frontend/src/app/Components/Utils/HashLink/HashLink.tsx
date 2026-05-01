import { memo, ReactNode, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";



export type NavTypes = 'router' | 'page' | 'useNavigate';
export const DEFAULT_NAV_STATE = { fromNavigate: true };
export const DEFAULT_OPTS_STATE = { state: DEFAULT_NAV_STATE };


interface HashLinkPropsBase {
  // The url accepts hashLinks, @see Navbar.tsx
  url: string;
  
  // by default, uses the link-text class
  styles?: string;

  /** Conditionally rendered styles

    // The options for how the link is rendered
    label?: string;
    children?: ReactNode;


    // The ways of navigation, by default it is "router"
    type?: NavTypes;
    customNavigate?: (url?: string, label?: string) => void;

    // If you add the state or opts prop, it must be memoized in order to prevent rerenders 
    state?: Record<string, any>;
    opts?: Record<string, any> & { state?: any };

  */
}

// #region Conditional props
// Either render this component as a traditional link with optional custom styles, or a wrapped component as a link
type VariantProps = 
| { 
    children?: ReactNode; 
    /** @deprecated CANNOT use 'label' when 'children' is present. */
    label?: never; 
  } 
| { 
    label?: string; 
    /** @deprecated CANNOT use 'children' when 'label' is present. */
    children?: never; 
  };

type NavTypeProps = 
// if we're using the navigate function, we need the opts for extra nav functionality 
| {
    type?: Extract<NavTypes, 'useNavigate'>; 
    opts?: Record<string, any> & { state?: any };

    /** @deprecated CANNOT use 'state' when 'type' is 'useNavigate'. */
    state?: never; 
    /** @deprecated CANNOT use 'customNavigate' when 'type' is 'useNavigate'. */
    customNavigate?: never; 
  }
// if the type is not 'useNavigate', we only need state
| { 
    type?: Extract<NavTypes, 'router' | 'page'>;
    state?: Record<string, any>;

    /** @deprecated CANNOT use 'opts' when 'type' is 'router' | 'page'. */
    opts?: never; 
    /** @deprecated CANNOT use 'customNavigate' when 'type' is present. */
    customNavigate?: never; 
  }
// or if they instead used the customNavigate prop, don't use both opts and state (the function handles it, we pass the static props)
| { 
    customNavigate?: (url: string, label?: string) => void; 

    /** @deprecated CANNOT use 'type' when 'customNavigate' is present. */
    type?: NavTypes;
    /** @deprecated CANNOT use 'state' when 'customNavigate' is present. */
    state?: never; 
    /** @deprecated CANNOT use 'opts' when 'customNavigate' is present. */
    opts?: never; 
  };
// #endregion

export type HashLinkProps = HashLinkPropsBase & VariantProps & NavTypeProps; 


// These don't need to rerender
export const HashLink = memo((props: HashLinkProps) => {
  const { 
    url, 
    label, children, 
    type = 'router', customNavigate, 
    state = DEFAULT_NAV_STATE, opts, 
    styles, 
  } = props;

  const navigate = useNavigate(); 
  const { pathname } = useLocation();
  
  // Only merge the objects when the source state data actually changes
  // TODO: Refactor this to handle if they pass in state or opts1
  const mergedState = useMemo(() => ({
    ...state,
    ...DEFAULT_NAV_STATE,
    previousPathname: pathname,
  }), [state, pathname]);

  // Navigation logic for when they aren't using type="router"
  const onClickToNavigate = () => {
    // Custom navigation logic
    console.log('onClickToNavigate?');
    if (customNavigate) {
      console.log('found custom navigation function');
      customNavigate(url, label);
      return;
    }

    // Internal site navigation
    if (type == 'useNavigate') {
      navigate(url, {...opts, state: mergedState}); // Internal ScrollToView State @see Navbar.tsx
      return;
    }
    
    // External site navigation
    if (type == 'page') {
      window.open(url, '_blank', 'noopener,noreferrer'); // new tab, Content Safe / NoHTTPs Referrer
      return;
    }
  }

  // Styles
  const linkStyles = styles ? styles : 'link-text';

  // Router Type navigation
  if (type == 'router' && !customNavigate) return (
    <Link to={url} state={mergedState} className={linkStyles}>
      { label ? label : children }
    </Link>
  );

  // UseNavigate, Page or custom navigation
  else return (
    <div onClick={() => onClickToNavigate()} className={linkStyles}>
      { label ? label : children }
    </div>
  );
});
