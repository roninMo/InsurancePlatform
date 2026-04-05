import {MouseEvent, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { NavigateOptions, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@Project/ReactComponents';
import { HashLink } from '../Utils/HashLink/HashLink';

import styled from '@emotion/styled';
import styles from './Navbar.module.scss';


export interface NavbarProps {}

// this should be wrapped in a memo to make it a nuclear component, check if the effects and events for the dropdown, scroll, and theme still work
export const Navbar = ({}: NavbarProps) => {
  const navigate = useNavigate();

  // Handles the current theme that's rendered from the page via user preference and localStorage
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem('theme') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Scroll behavior logic
  const { hash, key, pathname, state } = useLocation();


  //------------------------------------------------//
  // Theme                                          //
  //------------------------------------------------//
  // Initialize the Theme and display settings
  useLayoutEffect(() => {
    if (!currentTheme) {
      const userPreferenceTheme: string = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      localStorage.setItem('theme', userPreferenceTheme);
      
      setAndUpdateTheme(userPreferenceTheme)
			// Todo; try out requestAnimationUpdate for updating the theme
    }
    

  }, [currentTheme]);

  const updateTheme = (newTheme: string) => {
    localStorage.setItem('theme', newTheme);

    // Prevent transitions from affecting theme changes
    document.body.classList.add('disable-transitions');

    // Toggle dark mode
    // document.body.classList.toggle('dark');
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    // Force a browser reflow/repaint (cheaply)
    void(document.documentElement.offsetHeight); // Reading any computed style property (like 'opacity' or 'offsetHeight') forces the browser to apply the style changes immediately

    // Add back transition logic for the elements.
    document.body.classList.remove('disable-transitions');
  }

  const setAndUpdateTheme = (newTheme: string) => {
      setCurrentTheme(newTheme);
      updateTheme(newTheme);
  }


  //------------------------------------------------------------------------------------//
  // React Router Hash Link ScrollRestoration Logic when navigate is used with an id    //
  //------------------------------------------------------------------------------------//
  useEffect(() => {
    const didNavigate = state?.fromNavigate;
    // console.log(`NavigationHandling: `, {didNavigate, hash, key, pathname, state});

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
  
  
  //------------------------------------------------//
  // Navbar Dropdown                                //
  //------------------------------------------------//
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isDropdownAllowed, setIsDropdownAllowed] = useState<boolean>(false); // delay
  const navbarRef = useRef(null);
  const navbarDropdownId = 'navbar-dropdown';
  const navbarLinks = 'navbar-links';
  
  // Just close the navbar once the mouse has left the page 
  // This handles weird scenarios when it's left open when you move up to the search or off the page
  useEffect(() => {
    const onMouseLeftPage = () => {
      setShowDropdown(false);
    }
    document.addEventListener('mouseleave', onMouseLeftPage);

    // Remove event listeners when this component is unrendered
    return () => document.removeEventListener('mouseleave', onMouseLeftPage);
  }, [])


  // Prevent the dropdown from opening right after they navigate so they have time to navigate
  useEffect(() => {
    setIsDropdownAllowed(false);

    // once the delay is done, check if we're already hovering over the navbar
    const timeout = setTimeout(() => {
      setIsDropdownAllowed(true);
      const dropdownElement: any = navbarRef.current;
      const isHovering = dropdownElement.matches(':hover');
      // console.log(`dropdownElement, hovering: ${isHovering}`, dropdownElement);
      if (isHovering) setShowDropdown(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [key]);

  const hoveringOverDropdown = (hovering: boolean, event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (!isDropdownAllowed) return;
    
    const element: any = event?.target as HTMLElement;
    // console.log('hoveringOverDropdown: ', element);
    const isWithinDropdown = element.closest(`#${navbarDropdownId}`);
    // const isWithinLinks = element.closest(`#${navbarLinks}`);
    
    // Since it's an element hidden behind the navbar, only this is needed
    if (!hovering && isWithinDropdown) setShowDropdown(false);
    else setShowDropdown(true);
    // setShowDropdown(true);
  }


  return (
    <NavbarAndDropdown role="navigation" id='Nav' className='bg-div border-styles border-b fixed z-30 w-full shadow-xl'>
        {/* <ScrollRestoration /> This is for instant scroll behavior */}
        <Container className='w-full row justify-between items-center relative z-10 bg-div px-3'>

          <NavLinkContainer id={navbarLinks} className='NavLinks rowStart items-center gap-8'>
            <HomeIcon id="HomeLink" className='rowStart items-center gap-3'>
              <HashLink url="/" styles='rowStart gap-2 p-2 transition duration-300 theme-focus cursor-pointer bg-default outline-css rounded-lg outline-focus'>
                <Icon variant='CodeBracket' styles='size-6 text-blue-600 dark:text-indigo-400' />
              </HashLink>
              <h4 className='label-colors'>Portfolio</h4>
            </HomeIcon>

            <Links 
              id='Links' 
              onMouseEnter={(e) => hoveringOverDropdown(true, e)}
              onMouseLeave={(e) => hoveringOverDropdown(false, e)}
              ref={navbarRef}
              className='rowStart gap-0 *:p-6 *:px-4 *:transition *:text-base *:cursor-pointer'
            >
              <HashLink label="Home" url="/" styles='bg-div hover:bg-div-hover' />
              <HashLink label="Demos" url="/Demos" styles='bg-div hover:bg-div-hover' />
              <HashLink label="Mock Database" url="/MockDatabase" styles='bg-div hover:bg-div-hover' />
              <HashLink label="Contact" url="/Contact" styles='bg-div hover:bg-div-hover' />
              <HashLink label="Documentation" url="/Documentation" styles='bg-div hover:bg-div-hover' />
            </Links>
          </NavLinkContainer>


          <Profile className='rowStart items-center gap-4'>
            <div> Account </div>
            <div id='HomeLink' className='p-2 outline-css rounded-full transition duration-300 cursor-pointer
                bg-default outline-default theme-focus' >
              <Icon variant='Profile' styles='size-6 text-slate-600 dark:text-slate-500' />
            </div>

            <div className='' onClick={() => setAndUpdateTheme(currentTheme === 'light' ? 'dark' : 'light')}>
              { currentTheme == 'light' ? 
                <Icon variant='LightTheme' styles='size-10 cursor-pointer input-colors hover:text-blue-500 transition' /> : 
                <Icon variant='DarkTheme' styles='size-10 cursor-pointer placeholder-text hover:text-blue-400 transition' />
              }
            </div>
          </Profile>
        </Container>


        <Dropdown
          id={navbarDropdownId}
          onMouseEnter={(e) => hoveringOverDropdown(true, e)}
          onMouseLeave={(e) => hoveringOverDropdown(false, e)}
          className={`absolute w-full bg-div border-styles border-y shadow-xl transition
            height-trans-opacity ${showDropdown ? 'opacity-100 grid-rows-[1fr]' : 'opacity-0 grid-rows-[0fr]'}
        `}>
          <div className={`height-trans-content content-auto ${showDropdown && 'height-trans-op-content'}`}>
            <Links className='row justify-center gap-8 pr-14 pb-10 pt-4 *:mx-4 *:my-2 *:col *:gap-3'>
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
                <HashLink label="Forms"           url="/Documentation" styles="footer-link" />
                <HashLink label="Components"      url="/Documentation" styles="footer-link" />
                <HashLink label="Layout"          url="/Documentation" styles="footer-link" />
              </div>
            
              <div>
                <HashLink label="Contact"       url="/Contact" styles="footer-link-header" />
                <HashLink label="Email"         url="/Contact" styles="footer-link" />
                <HashLink label="Phone"         url="/Contact" styles="footer-link" />
                <HashLink label="Social Media"  url="/Contact" styles="footer-link" />
                <HashLink label="Form"          url="/Contact" styles="footer-link" />
              </div>
            </Links>
          </div>
        </Dropdown>
          
          
    </NavbarAndDropdown>
  );
}


// Styled Components
const NavbarAndDropdown = styled.div``;
const Container = styled.div``;
const NavLinkContainer = styled.div``;
const HomeIcon = styled.div``;
const Links = styled.div``;
const Profile = styled.div``;
const Dropdown = styled.div``;
