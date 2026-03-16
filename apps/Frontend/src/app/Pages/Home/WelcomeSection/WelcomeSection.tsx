import { useState, useId, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button } from '@Project/ReactComponents';

import downtown_city_night from '../../../../assets/images/downtown_city_night.png';
import styles from './WelcomeSection.module.scss';


export const WelcomeSection = () => {
  const navigate = useNavigate();
  
  // Modal
  const [navModalOpen, setNavModalOpen] = useState<boolean>(false);
  const navModalId = useId();

  const openNavMenu = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    setNavModalOpen(true);
    console.log('opening the navigation modal', event);
  }

  const closeNavMenu = () => {
    setNavModalOpen(false);
    console.log('closing the navigation modal');
  }

  const navigateToDocs = () => {
    console.log('opening the navigation modal');
  }
  
  // Development / Production Config
  const whatsNewMenu = () => {
    console.log(`What's new`);
  }

  const environmentMenu = () => {
    console.log(`Dev / Prod`);
  }


  return (
    <div className='span-12 col w-full'>
      <Background className='spacing'>
        <Overlay className='spacing place-content-center
          p-8 pt-44 min-h-[45rem] xl:min-h-[54rem]  2xl:min-h-[60rem] 
          bg-gradient-to-br from-slate-950/80 from-25% via-slate-700/20 via-65% to-transparent
        '>
          <div className='span-12 md:span-9 lg:span-7 xl:span-6 2xl:span-5 col items-start gap-4 p-2 pb-14'>
            
            {/* Dev / Production Config */}
            <div className='rowStart gap-4 pt-2'> 
              <Button displayText="What's new"
                onClick={() => whatsNewMenu()}
                size='default'
                color='none'
                // color='primary'
                additionalStyles='selected-box rounded-full text-sm hover:theme-focus'
              />

              <Button displayText='Development 1.0.0'
                onClick={() => environmentMenu()}
                size='default'
                color='none'
                // color='primary'
                additionalStyles='selected-box rounded-full text-sm hover:theme-focus'
              />
            </div>

            {/* Introduction and Description */}
            <h1 className='py-2 text-4xl md:text-5xl lg:text-6xl text-slate-200 dark:text-slate-100 font-semibold text-shadow-lg'>
              Deploy to the cloud with confidence
            </h1>
            <p className='pb-4 text-lg text-slate-300 dark:text-slate-300 text-shadow-md'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            </p>

            {/* Buttons */}
            <div className='rowStart gap-4 pt-2'> 
              <Button displayText='Get Started'
                onClick={(e) => openNavMenu(e)}
                size='lg'
                // color='none'
                color='primary'
                additionalStyles='text-base rounded-lg'
              />

              <Button displayText='Documentation'
                onClick={() => navigateToDocs()}
                size='lg'
                // color='none'
                color='primary'
                additionalStyles='text-base rounded-lg'
              />
            </div>
          </div>
        </Overlay>
      </Background>
      <div className='-mt-10 py-14 
        bg-gradient-to-t from-75% to-90% 
        from-white dark:from-slate-900 
        to-transparent 
      ' />
    </div>
  );
}

// Styled Components
const Overlay = styled.div``;
const Background = styled.div`
  background-image: url(${downtown_city_night});
  background-size: cover;
  background-position: center;
  background-position-x: -2px;
`;
