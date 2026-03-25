import { ReactNode } from "react";
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

export const HashLink = ({ url, label, opts = { type: 'router'}, styles, children }: HashLinkProps) => {
  const navigate = useNavigate();
  const customNavFunction = opts?.customNavFunction;
  const state = { ...opts.state, fromNavigate: true };
  const type = opts.type;

  const onClickToNavigate = () => {
    if (customNavFunction) {
      customNavFunction();
      return;
    }

    // Internal site navigation
    if (type == 'useNavigate') {
      navigate(url, {...opts, state}); // Internal ScrollToView State @see Navbar.tsx
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
    console.log(`has children \n`);
    return (
      <Link to={url} state={state} className={linkStyles}>
        { children }
      </Link>
    );
  }
  return (
    <>
      { type == 'router' && !customNavFunction ?
          <Link to={url} state={state} className={linkStyles}>{ label }</Link>
        : 
          <div onClick={() => onClickToNavigate()} className={linkStyles}>{ label }</div>
      }
    </>
  );
}
