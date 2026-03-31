import { Navbar } from '../../Components/Navbar/Navbar';
import { CustomContent } from '../Home/CustomContent/CustomContent';
import { Footer } from '../Home/Footer/Footer';
import styles from './Contact.module.scss';

export const Contact = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className='dropdown-spacing py-10' />

      <div className='p-4'>
        <h4> Contact Page </h4>

      </div>
      
      <div className='p-4'>
        <CustomContent />
      </div>

      {/* <div className="py-96" /> */}
      <Footer />
    </>
  );
}
