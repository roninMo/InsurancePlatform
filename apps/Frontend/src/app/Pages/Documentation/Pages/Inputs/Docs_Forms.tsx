import {Outlet} from "react-router-dom";
import styles from './Docs_Inputs.module.scss';


export const Docs_Forms = () => {
  return (
    <div className="w-full gap-2">
      <h2 className='pb-10'>Forms Page</h2>
      <Outlet />
    </div>
  );
}
