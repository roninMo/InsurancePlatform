import { useState, useId } from 'react';
import styled from '@emotion/styled';
import { Navbar } from '../../Components/Navbar/Navbar';

import styles from './Home.module.scss';
import { WelcomeSection } from './WelcomeSection/WelcomeSection';
import { PreviousWorksSection } from './PreviousWorksSection/PreviousWorksSection';
import { Footer } from './Footer/Footer';
import { Card } from '../../Components/Layouts/Card/Card';
import { ContactUsSection } from './ContactUsSection/ContactUsSection';
import { Experiences } from './Experiences/Experiences';




export const Home = () => {
  // Image generation text - Beautiful Downtown City Night, Colorful Vibrant Lights with Surreal Weather

  return (
    <>
      {/* Navbar */}
      <Navbar />
      
      <MainContent className='spacing gap-0'>
        <WelcomeSection />

        {/* Previous Works */}
        <div className='spacing bg-div'>
          <div className='span-1 hidden lg:block' />
          <PreviousWorksSection additionalStyles='span-12 lg:span-10' />
          <div className='span-1 hidden lg:block' />
        </div>

        <Experiences />
        <ContactUsSection />
        <Footer />
      </MainContent>
    </>
  );
}

const MainContent = styled.div``;
const Container = styled.div``;
const SelectElement = styled.button``;
const CurrentlySelected = styled.div``;
const DropdownItems = styled.div``;
const PrecedingSelectItemElements = styled.div``;
const SubsequentSelectItemElements = styled.div``;
