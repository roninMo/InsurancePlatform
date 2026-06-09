import { memo, ReactNode, useMemo } from "react";
import { useNavigate, Link, useLocation, NavigateOptions } from "react-router-dom";
import { hashLinkScrollRestoration } from "../../../Singletons/HashLinkScrollRef/HashLinkScrollRestoration";


/** The *navigation* logic used in the {@link HashLink}. */
export type NavTypes = 'router' | 'page' | 'useNavigate';
export const DEFAULT_NAV_STATE = { };
export const DEFAULT_OPTS_STATE = { state: DEFAULT_NAV_STATE };


// #region Base Props
/** The base props for the {@link HashLink}. */
interface HashLinkPropsBase {
	/** The *url* accepts hashes, ***see*** {@link Navbar|Navbar.tsx}. */
  url: string;
  
	/** By default, uses the universal *link-text* class. */
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
    opts?: NavigateOptions;
    
  */
}


// #endregion
// #region Conditional Props
/** Either render this component as a traditional link with optional custom styles, or a wrapped component as a link */
type VariantProps = 
| { 
		/** The rendered *content* within the {@link HashLink}. */
    children?: ReactNode; 
    /** @deprecated CANNOT use 'label' when 'children' is present. */
    label?: never; 
  } 
| { 
		/** The {@link HashLink|HashLink's} displayed text. */
    label?: string; 
    /** @deprecated CANNOT use 'children' when 'label' is present. */
    children?: never; 
  };

type NavTypeProps = 
/** if we're using the navigate function, we need the opts for extra nav functionality  */
| {
		/** The *useNavigate* {@link HashLink} type adds the *NavigateOpts(opts)* prop for adding custom options to **react-router-dom's** `navigate` function, which is used under the hood here. */
    type?: Extract<NavTypes, 'useNavigate'>;
		
		/** **react-router-dom's** navigation options when calling the `navigate` function. */
    opts?: NavigateOptions;
    
    /** @deprecated CANNOT use 'state' when 'type' is 'useNavigate'. */
    state?: never; 
    /** @deprecated CANNOT use 'customNavigate' when 'type' is 'useNavigate'. */
    customNavigate?: never; 
  }

/** if the type is not 'useNavigate', we only need state */
| { 
	// TODO: type 'page' does not need the 'state' prop.
		/** NavTypes **router** and **state** are handled with the default *Link* tag, and with *window.open* for safely navigating to another site. */
    type?: Extract<NavTypes, 'router' | 'page'>;
		
		/** The transient *state* data that's added to *react-router-dom's* `navigate` function. */
    state?: Record<string, any>;
    
    /** @deprecated CANNOT use 'opts' when 'type' is 'router' | 'page'. */
    opts?: never; 
    /** @deprecated CANNOT use 'customNavigate' when 'type' is present. */
    customNavigate?: never; 
  }

/** or if they instead used the customNavigate prop, don't use both opts and state (the function handles it, we pass the static props) */
| { 
		/** Allows you to use your own custom *navigation* logic onClick. This should be **memoized** to prevent an extra rerender. */
    customNavigate?: (url: string, label?: string) => void; 
    
    /** @deprecated CANNOT use 'type' when 'customNavigate' is present. */
    type?: NavTypes;
    /** @deprecated CANNOT use 'state' when 'customNavigate' is present. */
    state?: never; 
    /** @deprecated CANNOT use 'opts' when 'customNavigate' is present. */
    opts?: never; 
  };

/** The HashLink's props */
export type HashLinkProps = HashLinkPropsBase & VariantProps & NavTypeProps; 


// #endregion
/** 
 * A custom react-router Link component that is used for adding **id-hashes** to links, and applying smooth scroll restoration on navigation. 
 * * See {@link hashLinkScrollRestoration()}. 
 */
export const HashLink = memo((props: HashLinkProps) => {
  // #region State
  const { 
    url, 
    label, children, 
    type = 'router', customNavigate, 
    state = DEFAULT_NAV_STATE, opts, 
    styles, 
  } = props;
  
  const navScrollRestoration = hashLinkScrollRestoration;
  const navigate = useNavigate(); 
  const { pathname } = useLocation();
  
  // Only merge the objects when the source state data actually changes
  // TODO: Refactor this to handle if they pass in state or opts
  const mergedState = useMemo(() => ({
    ...state,
    ...DEFAULT_NAV_STATE,
    previousPathname: pathname,
  }), [state, pathname]);
  
  
  // #endregion
  // #region Some of the navigation Scenarios
  // Navigation logic for when they aren't using type="router"
  const clickedLink = () => {
    // Custom navigation logic
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
  
  // #endregion
  // #region HTML
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
    <div onClick={clickedLink} className={linkStyles}>
      { label ? label : children }
    </div>
  );
  // #endregion
});
