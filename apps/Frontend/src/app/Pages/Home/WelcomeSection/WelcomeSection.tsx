import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Button } from '@Project/ReactComponents';
import { Modal } from '../../../Components/Utils/Modal/Modal';
import { Dropdown } from '../../../Components/Content/Dropdown/Dropdown';
import { InsuranceAppLinks, MockDatabaseLinks, QuickLinkProps, QuickLinks, QuickLinksProps, SpotifyDemoLinks, SSAutoSaveLinks } from './QuickLinks/QuickLinks';
import { HashLink } from '../../../Components/Utils/HashLink/HashLink';
import styled from '@emotion/styled';

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import BackgroundAnim from "../../../../assets/lottie/Background looping animation.json";
import downtown_city_night from '../../../../assets/images/downtown_city_night.png';
import styles from './WelcomeSection.module.scss';



export const WelcomeSection = () => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  //--------------------------------------------//
  // Background Animation                       //
  //--------------------------------------------//
  useEffect(() => {
    // Resume animation
    if (lottieRef.current) {
      lottieRef.current.play();
    }

    // 2. cleanup for lottie (sometimes it's causing slowness)
    return () => {
      if (!lottieRef?.current) return;
      
      const animationItem = lottieRef.current as any;
      animationItem?.destroy(); // Destroys this specific instance
    };
  }, [lottieRef]); // Re-runs if animation data changes


  //--------------------------------------------//
  // Modal and Quick Links                      //
  //--------------------------------------------//
  const [navModalOpen, setNavModalOpen] = useState<boolean>(false);
  const openNavMenu = () => setNavModalOpen(true);
  const closeNavMenu = () => setNavModalOpen(false);

  // Quick links
  const [mockDBLinks, setMockDBLinks] = useState<QuickLinkProps[]>(MockDatabaseLinks);
  const [insPlatLinks, setInsPlatLinks] = useState<QuickLinkProps[]>(InsuranceAppLinks);
  const [spotifyLinks, setSpotifyLinks] = useState<QuickLinkProps[]>(SpotifyDemoLinks);
  const [SSASLinks, setSSASLinks] = useState<QuickLinkProps[]>(SSAutoSaveLinks);

  // Opened dropdown state
  const [openedMockDB, setOpenedMockDB] = useState<boolean>(false);
  const [openedInsPlat, setOpenedInsPlat] = useState<boolean>(false);
  const [openedSpotify, setOpenedSpotify] = useState<boolean>(false);
  const [openedSSAS, setOpenedSSAS] = useState<boolean>(false);

  const setOpenedDropdown = (opened: boolean, setState: Dispatch<SetStateAction<boolean>>) => {
    setState(opened);
  }

  const setQuickLinks = (
    links: QuickLinkProps[], 
    setState: Dispatch<SetStateAction<QuickLinkProps[]>>, 
    openState: Dispatch<SetStateAction<boolean>>
  ) => {
    setState(links);
    openState(false);
  }


  //--------------------------------------------//
  // Development / Production / Env Config      //
  //--------------------------------------------//
  // Development / Production Config
  const whatsNewMenu = () => {
    console.log(`What's new`);
  }

  const environmentMenu = () => {
    console.log(`Dev / Prod`);
  }

  return (
    <div id='welcome-section' className='span-12 col w-full'>
      <Container className={`spacing place-content-center lg:pt-44 relative`}>
        <Background className={`home-bg-sm lg:home-bg-lg `}>
          <Lottie 
            lottieRef={lottieRef}
            animationData={JSON.parse(JSON.stringify(BackgroundAnim))} // this is required 
            loop={true} 
            rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }} // This works like "background-size: cover"
            className={`home-bg-sm-lottie lg:home-bg-lg-lottie`}
          />
        </Background>

        <Content className={`
          z-10 span-12 lg:span-7 xl:span-6 2xl:span-6 
          p-4 md:px-8  pb-14 lg:pb-24 col items-start gap-2 
        `}>
          
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
            Hello, over the past couple years I've worked with multiple teams to develop and automate production level applications using best practices 
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
              onClick={() => openNavMenu()}
              size='lg'
              color='primary'
              additionalStyles='text-base rounded-lg'
            />

            <HashLink url="/Documentation" opts={{ type: 'useNavigate' }}>
              <Button displayText='Documentation'
                onClick={() => {}}
                size='lg'
                color='primary'
                additionalStyles='text-base rounded-lg'
              />
            </HashLink>
          </div>
        </Content>
      </Container>


      {/* Get Started Modal */}
      <Modal label="Quick Links" isModalOpen={navModalOpen} setModalOpen={setNavModalOpen}>
        <div className='col gap-4 w-[70vw] h-[65vh] px-4 ='>
            
            {/* Mock Database */}
            <Dropdown label="Mock Database" openByDefault hasBeenOpened={openedMockDB} setHasBeenOpened={setOpenedMockDB} styles='text-base lg:text-lg header-colors font-medium' >
              <div className="pl-8">
                <QuickLinks links={mockDBLinks} initialRender={openedMockDB} />
              </div>
            </Dropdown>

            {/* Insurance Platform */}
            <Dropdown label="Insurance Platform" openByDefault hasBeenOpened={openedInsPlat} setHasBeenOpened={setOpenedInsPlat} styles='text-base lg:text-lg header-colors font-medium' >
              <div className="pl-8">
                <QuickLinks links={insPlatLinks} initialRender={openedInsPlat} />
              </div>
            </Dropdown>

            {/* Spotify Demo */}
            <Dropdown label="Spotify Demo" hasBeenOpened={openedSpotify} setHasBeenOpened={setOpenedSpotify} styles='text-base lg:text-lg header-colors font-medium' >
              <div className="pl-8">
                <QuickLinks links={spotifyLinks} initialRender={openedSpotify} />
              </div>
            </Dropdown>

            {/* ServerSide AutoSave */}
            <Dropdown label="ServerSide Autosave" hasBeenOpened={openedSSAS} setHasBeenOpened={setOpenedSSAS} styles='text-base lg:text-lg header-colors font-medium' >
              <div className="pl-8">
                <QuickLinks links={SSASLinks} initialRender={openedSSAS} />
              </div>
            </Dropdown>


        </div>
      </Modal>

      {/* <FadeToBackground className='-mt-10 py-14 
        bg-gradient-to-t from-75% to-90% 
        from-slate-300 dark:from-slate-900 
        to-transparent 
      ' /> */}
    </div>
  );
}


// Styled Components
const Background = styled.div``;
const Container = styled.div``;
const Content = styled.div``;

/* 
  background-image: url(${downtown_city_night});
  background-size: cover;
  background-position-x: -2px;
  background-position-y: 70px;
  background-position: center;
  background-repeat: no-repeat; 
`;
*/