import { useState } from 'react';
import { Navbar } from '../../Components/Navbar/Navbar';
import {Sidebar, SubPageLinkProps} from "../../Components/Sidebar/Sidebar";
import { Hashbar } from '../../Components/Hashbar/Hashbar';
import { Footer } from '../Home/Footer/Footer';
import { CustomContent } from '../Home/CustomContent/CustomContent';

import styled from "@emotion/styled";
import styles from './Documentation.module.scss';
import {Outlet} from "react-router-dom";
import {Docs_Button} from "./Pages/Inputs/Button/Docs_Button";
import {Docs_Checkbox} from "./Pages/Inputs/Checkbox/Docs_Checkbox";
import {Docs_Input} from "./Pages/Inputs/Input/Docs_Input";
import {Docs_Radio} from "./Pages/Inputs/Radio/Docs_Radio";
import {Docs_RadioTable} from "./Pages/Inputs/RadioTable/Docs_RadioTable";
import {Docs_Select} from "./Pages/Inputs/Select/Docs_Select";
import {Docs_Slider} from "./Pages/Inputs/Slider/Docs_Slider";
import {Docs_Textarea} from "./Pages/Inputs/Textarea/Docs_Textarea";
import {Icon} from "@Project/ReactComponents";


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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const onSetSidebarState = (wasOpened: boolean) => {
    console.log(`The sidebar was ` + wasOpened ? 'opened' : 'closed');
  };
	
  
	
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className='dropdown-spacing py-4' />
        
      <Container className="spacing pt-10">
        
        {/* Page Content*/}
        <ContentAndSidebar className="min-h-[80vh] span-12 md:span-8 lg:span-9 rowStart gap-4">
          <Sidebar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onSetSidebarState={onSetSidebarState}
            LinkSections={DocumentationPage_SidebarLinks}
          />
          
          
          <NotificationContainer className="w-full py-2">
            <div className="p-2 rowStart gap-2 selected-box outline-css outline-focus">
              <Icon variant="InfoBox" styles="size-5 primary-text" />
              Notification
            </div>
            
            <PageContent className="py-4">
              <Outlet />
            </PageContent>
          </NotificationContainer>
        </ContentAndSidebar>
        
        <div className="span-2  md:span-3 lg:span-3 xs:hidden md:visible outline-css outline-styles">
          <Hashbar 
            linkSections={[]}
          />
        </div>
      </Container>
      
        

      {/*<div className='spacing gap-4 p-4'>*/}
      {/*  /!*<CustomContent />*!/*/}
      {/*</div>*/}

      {/*<div className="p-8">*/}
      {/*  <CustomContent />*/}
      {/*</div>*/}
      <Footer />
    </>
  );
}


// Styled Components
const Container = styled.div``;
const ContentAndSidebar = styled.div``;
const NotificationContainer = styled.div``;
const PageContent = styled.div``;


// Documentation Sidebar Links
export const DocumentationPage_SidebarLinks: SubPageLinkProps[] = [
  // Inputs Page and Subroutes
  {
    sectionLink: { label: "Forms", url: "Forms" }, // TODO: Add redirects to create individual "home" page content for the quicklinks of each section
    subLinks: [
      { label: 'Button', url: '/Documentation/Forms/Button' },
      { label: 'Checkbox', url: '/Documentation/Forms/Checkbox' },
      { label: 'Input', url: '/Documentation/Forms/Input' },
      { label: 'Radio', url: '/Documentation/Forms/Radio' },
      { label: 'Radio Table', url: '/Documentation/Forms/RadioTable' },
      { label: 'Select', url: '/Documentation/Forms/Select' },
      { label: 'Slider', url: '/Documentation/Forms/Slider' },
      { label: 'Textarea', url: '/Documentation/Forms/Textarea' },
    ]
  },
  // Content Page and Subroutes
  {
    sectionLink: { label: "Content", url: "Content" },
    subLinks: [
      { label: 'Card', url: '/Documentation/Content/Card' },
      { label: 'Container', url: '/Documentation/Content/Container' },
    ]
  },
  // Utils Page and Subroutes
  {
    sectionLink: { label: "Utils", url: "Utils" },
    subLinks: [
      { label: 'DragAndDrop', url: '/Documentation/Utils/DragAndDrop' },
      { label: 'Modal', url: '/Documentation/Utils/Modal' },
      { label: 'Notifications', url: '/Documentation/Utils/Notifications' },
    ]
  }
]
