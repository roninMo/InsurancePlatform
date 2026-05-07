import {Outlet} from "react-router-dom";
import styles from './Docs_Inputs.module.scss';


export const Docs_Forms = () => {
  return (
    <div className="w-full">
      <Outlet />  
    </div>
  );
}
