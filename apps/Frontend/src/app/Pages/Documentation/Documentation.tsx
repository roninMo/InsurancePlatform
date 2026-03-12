import { Navbar } from '../../Components/Navbar/Navbar';
import styles from './Documentation.module.scss';

export const Documentation =() => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className='dropdown-spacing py-10' />

      <div className='p-4'>
        <h4> Documentation Page </h4>

      </div>
    </>
  );
}
