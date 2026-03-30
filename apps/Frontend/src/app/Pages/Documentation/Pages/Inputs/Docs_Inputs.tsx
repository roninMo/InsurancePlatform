import styles from './Docs_Inputs.module.scss';
import {Outlet} from "react-router-dom";


export const Docs_Inputs = () => {
  return (
    <div className="w-full gap-2">
      <h1>Documentation Input Page</h1>
      <Outlet />
    </div>
  );
}
