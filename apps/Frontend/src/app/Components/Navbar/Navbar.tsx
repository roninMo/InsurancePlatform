import { memo, MouseEvent, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { ScrollRestoration, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@Project/ReactComponents';
import { HashLink } from '../Utils/HashLink/HashLink';

import styled from '@emotion/styled';
import styles from './Navbar.module.scss';


export interface NavbarProps {}

const NavbarComponent = ({}: NavbarProps) => {
  const navigate = useNavigate();

  // Handles the current theme that's rendered from the page via user preference and localStorage
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem('theme') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  //------------------------------------------------------------------------------------//
  // React Router Hash Link ScrollRestoration Logic when navigate is used with an id    //
  //------------------------------------------------------------------------------------//
  // #region ScrollRestoration Logic 
  const { hash, key, pathname, state } = useLocation();

  // TODO: handle scroll restoration with loader redirects on browser route lists
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
  // #endregion


  //------------------------------------------------//
  // Navbar Dropdown                                //
  //------------------------------------------------//
  // #region Dropdown
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isDropdownAllowed, setIsDropdownAllowed] = useState<boolean>(false); // delay
  const navbarRef = useRef(null);
  const navbarDropdownId = 'navbar-dropdown';
  const navbarLinks = 'navbar-links';
  
  // Just close the navbar once the mouse has left the page 
  // This handles weird scenarios when it's left open when you move up to the search or off the page
  useEffect(() => {
    const onMouseLeftPage = () => setShowDropdown(false);
    document.addEventListener('mouseleave', onMouseLeftPage);

    // Remove event listeners when this component is unrendered
    return () => document.removeEventListener('mouseleave', onMouseLeftPage);
  }, []);


  // Prevent the dropdown from opening right after they navigate so they have time to navigate
  useEffect(() => {
    // Don't prevent dropdown functionality if they clicked a same page link
    const didNavigate = state?.fromNavigate;
    const previousPath = state?.previousPathname;
    if (didNavigate && previousPath == pathname) {
      return;
    }
    
    // Delay opening the dropdown for a second and let the user mouse it's mouse
    setIsDropdownAllowed(false);
    const timeout = setTimeout(() => {
      setIsDropdownAllowed(true);
      const dropdownElement: any = navbarRef.current;
      const isHovering = dropdownElement.matches(':hover');
      // console.log(`dropdownElement, hovering: ${isHovering}`, dropdownElement);
      if (!isHovering && showDropdown) setShowDropdown(false);
      else if (isHovering) setShowDropdown(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [key]);

  const hoveringOverDropdown = (entering: boolean, event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (!isDropdownAllowed) return;
    if (!event.target) return;

    const element: any = event.target as HTMLElement;
    const dropdown = element.closest(`#${navbarDropdownId}`);
    const navLinks = element.closest(`#${navbarLinks}`);

    // It will find these both on enter, and return the element they're within when leaving the element
    const HoveringDropdown = !!dropdown;
    const HoveringNavLinks = !!navLinks;

    // TODO: add debugging or custom logging to only be enabled in dev.
    if (false) { 
      if (entering) console.log('\n');
      console.log(`${entering ? 'entering' : 'leaving'}::elements: `, { 
        HoveringDropdown, HoveringNavLinks, 
        elements: {dropdown, navLinks} 
      });
    }

    // If the dropdown isn't open, only check if they're hovering over the links
    if (!showDropdown && HoveringNavLinks) {
      setShowDropdown(true);
      return;
    }

    // Otherwise, check if it's leaving the dropdown
    else if (!entering && HoveringDropdown) {
      setShowDropdown(false);
      return;
    }
  }
  // #endregion


  //------------------------------------------------//
  // Theme                                          //
  //------------------------------------------------//
  // #region Theme Logic
  // Initialize the Theme and display settings
  useLayoutEffect(() => {
    if (!currentTheme) {
      const userPreferenceTheme: string = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      localStorage.setItem('theme', userPreferenceTheme);
      setAndUpdateTheme(userPreferenceTheme)
    }

  }, [currentTheme]);

  const updateTheme = (newTheme: string) => {
    localStorage.setItem('theme', newTheme);

    // Prevent transitions from affecting theme changes
    document.body.classList.add('disable-transitions');
    
    // Toggle dark mode
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    // Force a browser reflow/repaint (cheaply) - do not use a double RequestAnimationFrame
    void(document.documentElement.offsetHeight); // Reading any computed style property (like 'opacity' or 'offsetHeight') forces the browser to apply the style changes immediately
    
    // Add back transition logic for the elements.
    document.body.classList.remove('disable-transitions');
  }

  const setAndUpdateTheme = (newTheme: string) => {
    setCurrentTheme(newTheme);
    updateTheme(newTheme);
  }
  // #endregion


  return (
    <NavbarAndDropdown role="navigation" id='Nav' className='bg-div border-styles border-b fixed z-30 w-full shadow-xl'>
        {/* <ScrollRestoration /> This is for instant scroll behavior */}
        <Container className='w-full row justify-between items-center relative z-10 bg-div px-3'>

          <NavLinkContainer id={navbarLinks} className='NavLinks rowStart items-center gap-8'>
            <HomeIcon id="HomeLink" className='rowStart items-center gap-3'>
              <HashLink url="/" styles='rowStart gap-2 p-2 transition-all duration-300 theme-focus cursor-pointer bg-default outline-css rounded-lg outline-focus'>
                <Icon variant='CodeBracket' styles='size-6 text-blue-600 dark:text-indigo-400' />
              </HashLink>
              <h4 className='label-colors'>Portfolio</h4>
            </HomeIcon>

            <Links 
              id='Links' 
              onMouseEnter={(e) => hoveringOverDropdown(true, e)}
              onMouseLeave={(e) => hoveringOverDropdown(false, e)}
              ref={navbarRef}
              className='links rowStart gap-0 *:p-6 *:px-4 *:transition-all *:text-base *:cursor-pointer bg-white z-30 opacity-100'
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
            <div id='HomeLink' className='p-2 outline-css rounded-full transition-all duration-300 cursor-pointer
                bg-default outline-default theme-focus' >
              <Icon variant='Profile' styles='size-6 text-slate-600 dark:text-slate-500' />
            </div>

            <div className='' onClick={() => setAndUpdateTheme(currentTheme === 'light' ? 'dark' : 'light')}>
              { currentTheme == 'light' ? 
                <Icon variant='LightTheme' styles='size-10 cursor-pointer input-colors hover:text-blue-500 transition-all' /> : 
                <Icon variant='DarkTheme' styles='size-10 cursor-pointer placeholder-text hover:text-blue-400 transition-all' />
              }
            </div>
          </Profile>
        </Container>


        <NavbarDropdown
          id={navbarDropdownId}
          onMouseEnter={(e) => hoveringOverDropdown(true, e)}
          onMouseLeave={(e) => hoveringOverDropdown(false, e)}
          className={`absolute w-full bg-div border-styles border-y shadow-xl transition-all
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
        </NavbarDropdown>
        
        
    </NavbarAndDropdown>
  );
}

// this should be wrapped in a memo to make it a nuclear component, check if the effects and events for the dropdown, scroll, and theme still work
export const Navbar = memo(NavbarComponent); 


// Styled Components
const NavbarAndDropdown = styled.div``;
const Container = styled.div``;
const NavLinkContainer = styled.div``;
const HomeIcon = styled.div``;
const Links = styled.div``;
const Profile = styled.div``;
const NavbarDropdown = styled.div``;
