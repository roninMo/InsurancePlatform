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

/*
  import { HashLink as Link } from 'react-router-hash-link';

  /// ... inside your component
  <nav>
    <Link to="/#section1">Section 1</Link>
    <Link to="/about#section2">About Section 2</Link>
  </nav>

  /// ... in your content
  <section id="section1">...</section>
*/