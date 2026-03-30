import styles from './Docs_Inputs.module.scss';
import {Outlet} from "react-router-dom";


export const Docs_Forms = () => {
  return (
    <div className="w-full gap-2">
      <h1 className='pb-10'>Documentation Forms Page</h1>
      <Outlet />
    </div>
  );
}
