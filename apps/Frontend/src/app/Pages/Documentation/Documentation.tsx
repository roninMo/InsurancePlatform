import { Navbar } from '../../Components/Navbar/Navbar';
import { CustomContent } from '../Home/CustomContent/CustomContent';
import styles from './Documentation.module.scss';

export const Documentation =() => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className='dropdown-spacing py-14' />

      <div className='spacing gap-4 p-4'>
        <CustomContent />
      </div>
    </>
  );
}
