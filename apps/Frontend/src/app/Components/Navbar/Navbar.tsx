import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Icon } from '@Project/ReactComponents';

import styles from './Navbar.module.scss';
import { NavigateOptions, useNavigate } from 'react-router-dom';


export interface NavbarProps {}

export const Navbar = ({}: NavbarProps) => {
  const [currentTheme, setCurrentTheme] = useState<string>(localStorage.getItem('theme') || '');
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize the Theme and display settings
    if (!currentTheme) {
      const userPreferenceTheme: string = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      localStorage.setItem('theme', userPreferenceTheme);
    }
    
    setTheme(currentTheme);

  }, [currentTheme]);

  const setTheme = (newTheme: string) => {
    localStorage.setItem('theme', newTheme);

    // Prevent transitions from affecting theme changes
    document.body.classList.add('disable-transitions');

    // toggle dark mode
    // document.body.classList.toggle('dark');
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    // 3. Force a browser reflow/repaint
    // Reading any computed style property (like 'opacity' or 'offsetHeight') forces the browser to apply the style changes immediately
    window.getComputedStyle(document.body).opacity;
    document.body.classList.remove('disable-transitions');

    setCurrentTheme(newTheme);
  }

  const onNavigate = (url: string, opts?: NavigateOptions) => {
    if (!url) return;
    navigate(url, opts);
  }

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const onHoverDropdown = (hovering: boolean) => {
    if (hovering && !showDropdown) setShowDropdown(true);
    else if (!hovering && showDropdown) setShowDropdown(false);1
  }


  return (
    <div role="navigation" id='Nav' className='bg-div border-styles border-b fixed z-40 w-full shadow-2xl'>
        <div className='w-full row justify-between items-center relative z-10 bg-div px-3'>

          <div id='NavLinks' className='NavLinks rowStart items-center gap-8'>
            <WebpageAndLinks className='rowStart items-center gap-3'>
              <div id='HomeLink' 
                onClick={() => onNavigate('/')} 
                className='rowStart gap-2 p-2 transition duration-300 theme-focus
                            cursor-pointer bg-default outline-css rounded-lg outline-focus'
              >
                <Icon variant='CodeBracket' styles='size-6 text-blue-600 dark:text-indigo-400' />
              </div>
              <h4 className='label-colors'>Portfolio</h4>
            </WebpageAndLinks>

            <Links 
              id='Links' 
              onMouseEnter={() => onHoverDropdown(true)}
              onMouseLeave={() => onHoverDropdown(false)}
              className='rowStart gap-0 *:p-6 *:px-4 *:transition *:text-base *:cursor-pointer'
            >
              <p onClick={() => onNavigate('/')} className='bg-div hover:bg-div-hover'>Home</p>
              <p onClick={() => onNavigate('/Demos')} className='bg-div hover:bg-div-hover'>Demos</p>
              <p onClick={() => onNavigate('/MockDatabase')} className='bg-div hover:bg-div-hover'>Mock Database</p>
              <p onClick={() => onNavigate('/Contact')} className='bg-div hover:bg-div-hover'>Contact</p>
              <p onClick={() => onNavigate('/Documentation')} className='bg-div hover:bg-div-hover'>Documentation</p>
            </Links>
          </div>


          <Profile className='rowStart items-center gap-4'>
            <div> Account </div>
            <div id='HomeLink' className='p-2 outline-css rounded-full transition duration-300 cursor-pointer
                bg-default outline-default theme-focus' >
              <Icon variant='Profile' styles='size-6 text-slate-600 dark:text-slate-500' />
            </div>

            <div className='' onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}>
              { currentTheme == 'light' ? 
                <Icon variant='LightTheme' styles='size-10 cursor-pointer input-colors hover:text-blue-500 transition' /> : 
                <Icon variant='DarkTheme' styles='size-10 cursor-pointer placeholder-text hover:text-blue-400 transition' />
              }
            </div>
          </Profile>
        </div>

        <Dropdown id='navbar-dropdown' className={`absolute w-full h-10 
          bg-div border-styles border-b transition duration-300 ease-in-out
          row items-center -translate-y-12 opacity-0
          ${showDropdown && 'translate-y-0 opacity-100'} shadow-2xl
        `}>
          Navbar dropdown
        </Dropdown>
    </div>
  );
}


const WebpageAndLinks = styled.div``;
const Links = styled.div``;
const Profile = styled.div``;
const Dropdown = styled.div``;
