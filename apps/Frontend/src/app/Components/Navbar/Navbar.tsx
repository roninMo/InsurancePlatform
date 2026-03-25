import { useEffect, useState } from 'react';
import { NavigateOptions, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@Project/ReactComponents';
import styled from '@emotion/styled';

import styles from './Navbar.module.scss';
import { HashLink } from '../Utils/HashLink/HashLink';


export interface NavbarProps {}

export const Navbar = ({}: NavbarProps) => {
  const navigate = useNavigate();

  // Handles the current theme that's rendered from the page via user preference and localStorage
  const [currentTheme, setCurrentTheme] = useState<string>(localStorage.getItem('theme') || '');

  // Scroll behavior logic
  const { hash, key, pathname, state } = useLocation();


  //------------------------------------------------//
  // Theme                                          //
  //------------------------------------------------//
  // Initialize the Theme and display settings
  useEffect(() => {
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


  //------------------------------------------------------------------------------------//
  // React Router Hash Link ScrollRestoration Logic when navigate is used with an id    //
  //------------------------------------------------------------------------------------//
  useEffect(() => {
    const didNavigate = state?.fromNavigate;
    console.log(`NavigationHandling: `, {didNavigate, hash, key, pathname, state});

    if (didNavigate) {
      const scrollOpts: ScrollIntoViewOptions = { behavior: 'smooth' }

      // Ensure the page is loaded before we try to scroll
      const timeout = setTimeout(() => {
        if (hash) {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) element.scrollIntoView(scrollOpts);
        } else {
          document.documentElement.scrollIntoView(scrollOpts);
        }

        // We've already rerendered from navigation, just clear the state
        window.history.replaceState({...state, fromNavigate: false}, '');
      }, 10);
      
      return () => clearTimeout(timeout);
    }

  }, [pathname, /* hash, */ key]); // when the page is updated, or the user navigates to another id on the page

  const onNavigate = (url: string, opts?: NavigateOptions) => {
    if (!url) return;
    navigate(url, opts);
  }


  // Navbar Dropdown
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const onHoverDropdown = (hovering: boolean) => {
    if (hovering && !showDropdown) setShowDropdown(true);
    else if (!hovering && showDropdown) setShowDropdown(false);1
  }


  return (
    <div role="navigation" id='Nav' className='bg-div border-styles border-b fixed z-30 w-full shadow-xl'>
        {/* <ScrollRestoration /> This is for instant scroll behavior */}
        <div className='w-full row justify-between items-center relative z-10 bg-div px-3'>

          <div id='NavLinks' className='NavLinks rowStart items-center gap-8'>
            <HomeIcon id="HomeLink" className='rowStart items-center gap-3'>
              <HashLink url="/" styles='rowStart gap-2 p-2 transition duration-300 theme-focus cursor-pointer bg-default outline-css rounded-lg outline-focus'>
                <Icon variant='CodeBracket' styles='size-6 text-blue-600 dark:text-indigo-400' />
              </HashLink>
              <h4 className='label-colors'>Portfolio</h4>
            </HomeIcon>

            <Links 
              id='Links' 
              onMouseEnter={() => onHoverDropdown(true)}
              onMouseLeave={() => onHoverDropdown(false)}
              className='rowStart gap-0 *:p-6 *:px-4 *:transition *:text-base *:cursor-pointer'
            >
              <HashLink label="Home" url="/" styles='bg-div hover:bg-div-hover' />
              <HashLink label="Demos" url="/Demos" styles='bg-div hover:bg-div-hover' />
              <HashLink label="Mock Database" url="/MockDatabase" styles='bg-div hover:bg-div-hover' />
              <HashLink label="Contact" url="/Contact" styles='bg-div hover:bg-div-hover' />
              <HashLink label="Documentation" url="/Documentation" styles='bg-div hover:bg-div-hover' />
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
          ${showDropdown && 'translate-y-0 opacity-100'} shadow-xl
        `}>
          Navbar dropdown
        </Dropdown>
    </div>
  );
}


const HomeIcon = styled.div``;
const Links = styled.div``;
const Profile = styled.div``;
const Dropdown = styled.div``;
