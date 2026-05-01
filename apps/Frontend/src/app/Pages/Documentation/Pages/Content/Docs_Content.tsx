import styles from './Docs_Content.module.scss';
import {Outlet} from "react-router-dom";


export const Docs_Content = () => {
  return (
    <div className="w-full gap-2">
      <h1>Documentation Content Page</h1>
      <Outlet />
    </div>
  );
}
