import { memo, ReactNode, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";


export interface HashLinkProps {
  url: string;
  label?: string;
  opts?: {
    type?: 'router' | 'page' | 'useNavigate';
    state?: any;
    customNavFunction?: () => void;
  }
  styles?: string;
  children?: ReactNode;
}

export const DEFAULT_OPTS: HashLinkProps['opts'] = { type: 'router'};
export const BASE_NAV_STATE = { fromNavigate: true };

// These don't need to rerender
// export const HashLink = memo(({ url, label, opts, styles, children }: HashLinkProps) => 
export const HashLink = memo(({ url, label, opts = DEFAULT_OPTS, styles, children }: HashLinkProps) => {
  const navigate = useNavigate(); 
  const { pathname } = useLocation();
  const customNavFunction = opts?.customNavFunction;
  const type = opts.type;
  
  // Only merge the objects when the source state data actually changes
  const mergedState = useMemo(() => ({
    ...opts?.state,
    ...BASE_NAV_STATE,
    previousPathname: pathname,
  }), [opts?.state, pathname]); // If opts.state is undefined/stable, this never re-runs

  const onClickToNavigate = () => {
    if (customNavFunction) {
      customNavFunction();
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

  const linkStyles = styles ? styles : 'footer-link';
  if (children) {
    return (
      <Link to={url} state={mergedState} className={linkStyles}>
        { children }
      </Link>
    );
  }
  return (
    <>
      { type == 'router' && !customNavFunction ?
          <Link to={url} state={mergedState} className={linkStyles}>{ label }</Link>
        : 
          <div onClick={() => onClickToNavigate()} className={linkStyles}>{ label }</div>
      }
    </>
  );
});
