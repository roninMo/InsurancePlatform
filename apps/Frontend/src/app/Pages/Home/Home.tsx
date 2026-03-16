import { useState, useId } from 'react';
import styled from '@emotion/styled';
import CustomContent from './CustomContent/CustomContent';
import { Navbar } from '../../Components/Navbar/Navbar';

import styles from './Home.module.scss';
import { WelcomeSection } from './WelcomeSection/WelcomeSection';




export const Home = () => {
  // Image generation text - Beautiful Downtown City Night, Colorful Vibrant Lights with Surreal Weather

  return (
    <>
      {/* Navbar */}
      <Navbar />
      
      <MainContent className='spacing gap-y-4'>
        {/* Welcome page w/GetStarted and Docs */}
        <WelcomeSection />

        {/* Previous Works */}
        {/* Experience, Languages, Frameworks, Adaptability */}
        {/* Contact */}
        {/* Footer */}

        <CustomContent />

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
