import { ReactNode, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";


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

export const BASE_NAV_STATE = { fromNavigate: true };

// These don't need to rerender
// export const HashLink = memo(({ url, label, opts, styles, children }: HashLinkProps) => 
export const HashLink = ({ url, label, opts = { type: 'router'}, styles, children }: HashLinkProps) => {
  const navigate = useNavigate(); // TODO: remove this from the HashLink component, and pass it in as a prop
  const customNavFunction = opts?.customNavFunction;
  const type = opts.type;
  
  // 2. Only merge the objects when the source data actually changes
const mergedState = useMemo(() => ({
  ...opts?.state,
  ...BASE_NAV_STATE
}), [opts?.state]); // If opts.state is undefined/stable, this never re-runs

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
      window.open(url, '_blank', 'noopener,noreferrer'); // new tab, Content Safe / NoHTTP Referrer
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
}
