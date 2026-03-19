import { useState, useId, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button } from '@Project/ReactComponents';
import { Modal } from '../../../Components/Layouts/Modal/Modal';

import Lottie from "lottie-react";
import BackgroundAnim from "../../../../assets/lottie/Background looping animation.json";
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
    <div className='span-12 col w-full' id='welcome-section'>
      <div className='bg-default w-full pt-24 absolute top-0 left-0
        min-h-[45rem] xl:min-h-[54rem]  2xl:min-h-[60rem] 
      '>
        <Lottie 
          animationData={BackgroundAnim} 
          loop={true} 
          className='w-full h-full'
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice" // This works like "background-size: cover"
          }}    
        />
      </div>
      <Background className='spacing'>
        <Overlay className='spacing place-content-center
          p-8 pt-44 min-h-[45rem] xl:min-h-[54rem]  2xl:min-h-[60rem] 
          bg-gradient-to-br from-slate-950/80 from-25% via-slate-700/20 via-65% to-transparent
        '>
          <div className='span-12 md:span-9 lg:span-7 xl:span-6 2xl:span-6 col items-start gap-2 p-8 pb-14 lg:pb-24 z-10 bg-div outline-css outline-default opacity-bg-60'>
            
            {/* Dev / Production Config */}
            <div className='rowStart gap-4 pt-2'> 
              <Button displayText="What's new"
                onClick={() => whatsNewMenu()}
                size='default'
                color='none'
                additionalStyles='selected-box rounded-full text-sm hover:theme-focus'
              />

              <Button displayText='Development 1.0.0'
                onClick={() => environmentMenu()}
                size='default'
                color='none'
                additionalStyles='selected-box rounded-full text-sm hover:theme-focus'
              />
            </div>

            {/* Introduction and Description */}
            <h1 className='py-2 text-4xl md:text-5xl lg:text-6xl text-slate-100 dark:text-slate-100 font-semibold text-shadow-lg'>
              Welcome to my site
            </h1>
            <p className='py-2 pb-4 text-xl text-slate-200 dark:text-slate-200 text-shadow-md'>
              Over the years I've worked with multiple teams to develop and automate production level applications using best practices 
              and design patterns. I've deployed multiple nationwide projects, helping both take part in designing or recreating modern 
              versions. And I've enjoyed in helping take part in each team I've been with. I'm always looking for a new opportunity! 
              Here's some of my current experience shared to you
            </p>

            <p className='text-lg placeholder-text italic text-slate-300 dark:text-slate-300 text-shadow-md'>
              Check out some of my side projects here.
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
              <Modal isModalOpen={navModalOpen} setModalOpen={setNavModalOpen} additionalStyles='row'>
                <div className='rowStart items-center gap-2 p-4 outline-css outline-default bg-div'>
                  <div className='col gap-4 w-[50vw] h-[65vh]'>
                      Modal Component
                  </div>
                </div>
              </Modal>

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

      {/* <FadeToBackground className='-mt-10 py-14 
        bg-gradient-to-t from-75% to-90% 
        from-slate-300 dark:from-slate-900 
        to-transparent 
      ' /> */}
    </div>
  );
}

// Styled Components
const Overlay = styled.div``;
const Background = styled.div`
  /* background-image: url(${downtown_city_night});
  background-size: cover;
  background-position-x: -2px;
  background-position-y: 70px;
  background-position: center;
  background-repeat: no-repeat; */
`;
const FadeToBackground = styled.div``;