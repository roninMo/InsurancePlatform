import { Button, Icon } from '@Project/ReactComponents';
import styles from './Footer.module.scss';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';


export const Footer = () => {
  const navigate = useNavigate();

  const navigateTo = (url: string) => {
    if (!url) return;


  }

  return (
    <div className='spacing bg-div -mt-2'>
      {/* Get Started (Again) */}
      {/* Footer */}
      {/* 
          - Row
              - Icon
              - Links (col)
                - Each item w/ sub links
      */}

      <div className='border-styles border-default border-t span-12 mx-10 mt-8' />
      <GetStartedSection className='span-12 col items-center gap-2 p-4 pt-24'>

        <label className='primary-text text-lg'>Get Started</label>
        <h2 className='pb-8 text-5xl text-center text-shadow-sm'>
          Boost your productivity. <br/> Start using our app today.
        </h2>

        <p className='pb-8 w-[50vw] text-xl text-center '>
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
        </p>

        <Button 
          displayText='Get Started'
          onClick={() => console.log('get started clicked!')}
          size='lg'
          color='primary'
          additionalStyles='text-base'
        />
      </GetStartedSection>


      <FooterSection className='span-12 col justify-between pt-24'>
      <div className='border-styles border-default border-t span-12 mx-10 mt-8 pb-12' />
        <div className='p-4 pb-8 pl-8 lg:pl-12'>
          <Icon variant='CodeBracket' styles='size-8 transition text-blue-500 dark:text-blue-400 hover:primary-text' />
        </div>

        <FooterLinks className='row justify-between px-8 lg:px-12 p-4 
          *:col *:gap-6 *:pr-0 *:lg:pr-24 [&_p]:text-base [&_label]:text-base'
        >
          <div className=''>
            <label>Solutions</label>
            <p className='hover:primary-text'>Marketing</p>
            <p className='hover:primary-text'>Analytics</p>
            <p className='hover:primary-text'>Automation</p>
            <p className='hover:primary-text'>Commerce</p>
            <p className='hover:primary-text'>Insights</p>
          </div>
          
          <div className=''>
            <label>Support</label>
            <p className='hover:primary-text'>Submit Ticket</p>
            <p className='hover:primary-text'>Documentation</p>
            <p className='hover:primary-text'>Guides</p>
          </div>
          
          <div className=''>
            <label>Legal</label>
            <p className='hover:primary-text'>Terms of Service</p>
            <p className='hover:primary-text'>Privacy Policy</p>
            <p className='hover:primary-text'>License</p>
          </div>

          <div className=''>
            <label>Company</label>
            <p className='hover:primary-text'>About</p>
            <p className='hover:primary-text'>Blog</p>
            <p className='hover:primary-text'>Jobs</p>
            <p className='hover:primary-text'>Press</p>
          </div>
        </FooterLinks>
      </FooterSection>
      
      <div className='pt-10 mx-8 span-12 border-styles border-b ' />
      <LLCSection className='p-4 px-8 pb-32 span-12 row justify-between items-center '>
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
const GetStartedSection = styled.div``;
const FooterSection = styled.div``;
const FooterLinks = styled.div``;
const LLCSection = styled.div``;