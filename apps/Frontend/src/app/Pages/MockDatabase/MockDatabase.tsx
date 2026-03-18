import { Navbar } from '../../Components/Navbar/Navbar';
import styles from './MockDatabase.module.scss';

export const MockDatabase =() => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className='dropdown-spacing py-10' />

      <div className='p-4'>
        <h4> Mock Database </h4>

      </div>
    </>
  );
}

export default MockDatabase;
