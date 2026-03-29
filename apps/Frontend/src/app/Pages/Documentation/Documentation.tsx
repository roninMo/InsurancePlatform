import { Navbar } from '../../Components/Navbar/Navbar';
import { CustomContent } from '../Home/CustomContent/CustomContent';
import { Footer } from '../Home/Footer/Footer';
import styles from './Documentation.module.scss';

export const Documentation =() => {
	
	/*
	
	  documentation pages
        - Introduction - list of boxes displaying inputs for each subroot section
            - Inputs, content, utils
			- each subroot/ should have quicklist
			
			
		- Components		
			- Quicklist - div that hovers with box and scale on hover
				- containing div should be placed behind it with z order and a background, not selectable
				- the content or artificial image thats just a default render of each component
				- wrap these in hashlinks for navigation of the docs
		
            - ShowcaseElement
              - Tab Element (Array of title and elements ) to nav between the element and the jsx
                
                - documentation tabs
                  - pass in react nodes with props on the page
                  - jsx content render
				
            - ParamTable
                - grid container for even spacing
                    - divided into Name, type, and description
                - pass in name as a string, type as an element for color coding, and description as a react node to add highlighting and docLinks
								- a class that can be to specific params to change colors/background for an additional params table on component variants params (for specific types)
			
            - ParamType
                - quick element for theme styling, pass in the type
			
            - DocLink
                - subclass the hashlink for theme styles
			
            - Keyword
                - Custom <b> tag for highlighted text with background for keywords
		
		
		- Route Layout
		  - Introduction
		  - Inputs
		    - /
            - /inputs
            - /textarea
            - /radio
            - /select
            - /slider
            - /radioTable
            - /the rest
				
			- same for the other routes
			
			
		- Page Layouts
            - Doc Nav Sidebar (all pages)
            - Content Section
		        - Space for notifications
                - Current page route for content (center)
			- Right side hash link sidebar
			- Footer
		
	*/
	
	
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className='dropdown-spacing py-14' />

      <div className='spacing gap-4 p-4'>
        <CustomContent />
      </div>

      <Footer />
    </>
  );
}

/*
  import { HashLink as Link } from 'react-router-hash-link';

  /// ... inside your component
  <nav>
    <Link to="/#section1">Section 1</Link>
    <Link to="/about#section2">About Section 2</Link>
  </nav>

  /// ... in your content
  <section id="section1">...</section>
*/