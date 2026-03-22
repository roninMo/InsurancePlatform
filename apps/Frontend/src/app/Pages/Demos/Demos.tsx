import { Outlet } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";
import styles from './Demos.module.scss';
import { Footer } from "../Home/Footer/Footer";

export const Demos =() => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className='dropdown-spacing py-10' />

      <div className='p-4'>
        <h4> Demo page </h4>

        <Outlet />
      </div>
      
      <div className="py-96" />
      <Footer />
    </>
  );
}