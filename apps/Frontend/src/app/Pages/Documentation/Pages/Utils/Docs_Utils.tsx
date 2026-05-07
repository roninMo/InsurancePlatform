import styles from './Docs_Utils.module.scss';
import {Outlet} from "react-router-dom";


export const Docs_Utils = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}
