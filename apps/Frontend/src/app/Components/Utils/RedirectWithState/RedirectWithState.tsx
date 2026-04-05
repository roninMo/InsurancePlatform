import { NavigateProps, useLocation, Navigate } from "react-router-dom";
import { BASE_NAV_STATE } from "../HashLink/HashLink";

// We use props in the state to handle scroll restoration with react router through the @see Navbar
export const RedirectWithState = ({ to, replace, relative }: NavigateProps) => {
  const location = useLocation();

  return ( 
    <Navigate 
      to={to} 
      state={{...location.state, ...BASE_NAV_STATE}} 
      replace={replace}
      relative={relative}
    />
  );
}
