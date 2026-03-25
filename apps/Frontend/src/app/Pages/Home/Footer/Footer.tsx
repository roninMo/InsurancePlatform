import { Button, Icon } from '@Project/ReactComponents';
import styles from './Footer.module.scss';
import styled from '@emotion/styled';
import { NavigateOptions, useNavigate } from 'react-router-dom';


export const Footer = () => {
  const navigate = useNavigate();

  const navigateTo = (url: string, type: 'router' | 'page' = 'router', opts?: NavigateOptions) => {
    if (!url) return;

    if (type == 'router') {
      navigate(url, opts);
    } else if (type == 'page') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className='spacing bg-div' id='footer'>
      <FooterSection className='span-12 col justify-between pt-14'>
      <HorizontalBorder className='border-styles border-default border-t span-12 mx-10 mt-8 pb-12' />
        <div className='p-4 pb-8 pl-8 lg:pl-12'>
          <Icon variant='CodeBracket' styles='size-8 transition text-blue-500 dark:text-blue-400 hover:primary-text' />
        </div>

        <FooterLinks className='row justify-between px-8 lg:px-12 p-4 
          *:col *:gap-6 *:pr-0 *:lg:pr-24'
        >
          <div>
            <label onClick={() => navigateTo('/', 'router')} className='footer-link-header'>
              Home
            </label>
            <p className='footer-link'
                onClick={() => navigateTo('/#welcome-section', 'router')} >
              Welcome
            </p>
            <p className='footer-link'
                onClick={() => navigateTo('/#previous-works-section', 'router')} >
              Previous Works
            </p>
            <p className='footer-link'
                onClick={() => navigateTo('/#experiences-section', 'router')} >
              Experience
            </p>
            <p className='footer-link'
                onClick={() => navigateTo('/', 'page')} >
              Resume
            </p>
          </div>
          
          <div>
            <label onClick={() => navigateTo('/Demos', 'router')} className='footer-link-header'>
              Demos
            </label>
            <p onClick={() => navigateTo('/Demos/', 'router')} className='footer-link'>Insurance Application</p>
            <p onClick={() => navigateTo('/Demos/', 'router')} className='footer-link'>Spotify Demo</p>
            <p onClick={() => navigateTo('/MockDatabase', 'router')} className='footer-link'>Mock Database</p>
            <p onClick={() => navigateTo('/Demos/', 'router')} className='footer-link'>ServerSide Autosave Demo</p>
          </div>
          
          <div>
            <label onClick={() => navigateTo('/Documentation', 'router')} className='footer-link-header'>
              Documentation
            </label>
            <p onClick={() => navigateTo('/Documentation', 'router')} className='footer-link'>Forms</p>
            <p onClick={() => navigateTo('/Documentation', 'router')} className='footer-link'>Components</p>
            <p onClick={() => navigateTo('/Documentation', 'router')} className='footer-link'>Presentation</p>
          </div>

          <div>
            <label onClick={() => navigateTo('/Contact', 'router')} className='footer-link-header'>
              Contact
            </label>
            <p onClick={() => navigateTo('/Contact', 'router')} className='footer-link'>Email</p>
            <p onClick={() => navigateTo('/Contact', 'router')} className='footer-link'>Phone</p>
            <p onClick={() => navigateTo('/Contact', 'router')} className='footer-link'>Social Media</p>
            <p onClick={() => navigateTo('/Contact', 'router')} className='footer-link'>Page</p>
          </div>
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