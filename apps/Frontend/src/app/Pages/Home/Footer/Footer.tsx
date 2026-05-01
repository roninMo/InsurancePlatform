import { Button, Icon } from '@Project/ReactComponents';
import styled from '@emotion/styled';

import styles from './Footer.module.scss';
import { HashLink } from '../../../Components/Utils/HashLink/HashLink';


export const Footer = () => {

  const navigateTo = (url: string, type: string) => ({});

  return (
    <div className='spacing bg-div' id='footer'>
      <FooterSection className='span-12 col justify-between pt-14'>
      <HorizontalBorder className='border-styles border-default border-t span-12 mx-10 mt-8 pb-12' />
        <div className='p-4 pb-8 pl-8 lg:pl-12'>
          <Icon variant='CodeBracket' styles='size-8 trans text-blue-500 dark:text-blue-400 hover:primary-text' />
        </div>

        <FooterLinks className='row justify-between px-8 lg:px-12 p-4 
          *:col *:gap-6 *:pr-0 *:lg:pr-24'
        >
          <div>
            <HashLink label="Home"            url="/" styles="footer-link-header" />
            <HashLink label="Welcome"         url="/#welcome-section" styles="footer-link" />
            <HashLink label="Previous Works"  url="/#previous-works-section" styles="footer-link" />
            <HashLink label="Experience"      url="/#experiences-section" styles="footer-link" />
            <HashLink label="Resume"          url="/"  opts={{ type: 'page' }} styles="footer-link" />
          </div>
          
          <div>
            <HashLink label="Demos"                     url="/Demos" styles="footer-link-header" />
            <HashLink label="Insurance Application"     url="/Demos" styles="footer-link" />
            <HashLink label="Spotify Demo"              url="/Demos" styles="footer-link" />
            <HashLink label="Mock Database"             url="/MockDatabase" styles="footer-link" />
            <HashLink label="ServerSide Autosave Demo"  url="/Demos" styles="footer-link" />

          </div>
          
          <div>
            <HashLink label="Documentation"   url="/Documentation" styles="footer-link-header" />
            <HashLink label="Forms"           url="/Documentation/Forms" styles="footer-link" />
            <HashLink label="Content"         url="/Documentation/Content" styles="footer-link" />
            <HashLink label="Utils"           url="/Documentation/Utils" styles="footer-link" />
          </div>

          <div>
            <HashLink label="Contact"       url="/Contact" styles="footer-link-header" />
            <HashLink label="Email"         url="/Contact" styles="footer-link" />
            <HashLink label="Phone"         url="/Contact" styles="footer-link" />
            <HashLink label="Social Media"  url="/Contact" styles="footer-link" />
            <HashLink label="Form"          url="/Contact" styles="footer-link" />
          </div>

          <HashLink url=''  />
        </FooterLinks>
      </FooterSection>
      
      <HorizontalBorder className='pt-10 mx-8 span-12 border-styles border-b ' />
      <LLCSection className='p-4 px-8 pb-10 span-12 row justify-between items-center '>
        <p className=''>
          © 2024 Your Company, Inc. All rights reserved.
        </p>
        
        {/* Icons */}
        <div className='rowStart items-center gap-4'>
          <a href="#" className="p-2">
            <span className="sr-only">Facebook</span>
            <Icon variant='Facebook' styles='size-6 svg-init text-colors hover:text-blue-600  dark:hover:text-blue-600' />
          </a>
          <a href="#" className="p-2">
            <span className="sr-only">Instagram</span>
            <Icon variant='Instagram' styles='size-6 svg-init instagram-gray hover:text-rose-400 dark:hover:text-rose-400' />
          </a>
          <a href="#" className="p-2">
            <span className="sr-only">X</span>
            <Icon variant='Twitter' styles='size-6 svg-init text-colors hover:text-sky-400  dark:hover:text-sky-400' />
          </a>
          <a href="#" className="p-2">
            <span className="sr-only">GitHub</span>
            <Icon variant='Github' styles='size-6 svg-init text-colors hover:text-green-500  dark:hover:text-green-500' />
          </a>
          <a href="#" className="p-2">
            <span className="sr-only">YouTube</span>
            <Icon variant='Youtube' styles='size-6 svg-init text-colors hover:text-red-500  dark:hover:text-red-500' />
          </a>
        </div>
      </LLCSection>
    </div>
  );
}


// Styled Components
const ContactSection = styled.div``;
const FooterSection = styled.div``;
const FooterLinks = styled.div``;
const LLCSection = styled.div``;
const HorizontalBorder = styled.div``;
