import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";
import { HashLink } from "../../Components/Utils/HashLink/HashLink";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import ErrorPageAnim from "../../../assets/lottie/404 Sleep Cat.json";

import styled from "@emotion/styled";
import styles from './ErrorPage.module.scss';


export const ErrorPage = () => {
  const navigate = useNavigate();
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

  const navigateBackToPrevPage = () => {
    navigate(-1);
    console.log('navigating back to the previous page');
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />
      
      <Container className="spacing place-content-center min-h-[100vh]">
        {/* <h4>Error Page</h4> */}
        <div className="span-12 lg:span-2" />
        <Content className='err-page-content'>
          <div className="col items-center gap-8 p-4 pt-20 pb-12">
            <h1 className="label-colors font-bold">Page Not Found</h1>
            <p className="text-2xl placeholder-text">
              Sorry, the page you were looking for was not found.
            </p>
          </div>

          <Lottie 
            lottieRef={lottieRef}
            animationData={JSON.parse(JSON.stringify(ErrorPageAnim))} // this is required 
            loop={true} 
            rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }} // This works like "background-size: cover"
            className={`self-center w-2/3`}
          />

          <div className="col items-center gap-1.5 p-4 pb-10">
            <HashLink 
              label="Back to where we left off" 
              customNavigate={navigateBackToPrevPage} url="" 
              styles="err-page-link"
            />
            <span className="placeholder-text text-lg">or</span>
            <HashLink 
              url="/" 
              label="Home Page" 
              styles="err-page-link"
            />
          </div>
        </Content>
        <div className="span-12 lg:span-2" />
      </Container>
    </>
  );
}


// Styled Components
const Container = styled.div``;
const Content = styled.div``;
