import { useState, lazy } from 'react';
import { Outlet } from "react-router-dom";
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';

import { Navbar } from '../../Components/Navbar/Navbar';
import { Sidebar, SubPageLinkProps } from "../../Components/Sidebar/Sidebar";
import { Hashbar } from '../../Components/Hashbar/Hashbar';
import { Footer } from '../Home/Footer/Footer';
import { Icon } from "@Project/ReactComponents";

import { Docs_Button } from "./Pages/Inputs/Button/Docs_Button";
import { Docs_Checkbox } from "./Pages/Inputs/Checkbox/Docs_Checkbox";
import { Docs_Input } from "./Pages/Inputs/Input/Docs_Input";
import { Docs_Radio } from "./Pages/Inputs/Radio/Docs_Radio";
import { Docs_RadioTable } from "./Pages/Inputs/RadioTable/Docs_RadioTable";
import { Docs_Select } from "./Pages/Inputs/Select/Docs_Select";
import { Docs_Slider } from "./Pages/Inputs/Slider/Docs_Slider";
import { Docs_Textarea } from "./Pages/Inputs/Textarea/Docs_Textarea";

import styled from "@emotion/styled";
import styles from './Documentation.module.scss';

export const CodeBlock = lazy(() => import('../../Components/Utils/LazyReactSyntaxHighlighter')) as React.FC<SyntaxHighlighterProps | any>;


export const Documentation = () => {
  /* TODO: From where we left off

  - Finish and try out DocLinks and Keywords in the descriptions
  - We need a tooltip util component to add to other components that lets you add a string, elements, or jsx code render within it
  
  - Finally, go through each component and refactor to make them very organized and themed
    - Fix the styles, add themes to the global styles for reference
    - Refactor things for efficiency, and make it more neat and organized
    - Finish any of the uncompleted logic that we haven't added yet but left notes on building
		
		- only use bottom border on the paramTable

  */


	/* 
    - Documentation pages
      - Introduction: list of boxes categorizing each subroot section 
      - each subroot/ should have QuickList to display their components
      - Inputs, content, utils component showcases
      
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
        <ContentAndSidebar className="span-12 rowStart gap-4">
          <StickyContainer className='flex items-start min-h-[80vh]'>
            <div className="sticky top-[4.5rem] h-screen overflow-y-auto min-w-[20%] 2xl:min-w-[12%]">
              <Sidebar 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onSetSidebarState={onSetSidebarState}
                LinkSections={DocumentationPage_SidebarLinks}
              />
            </div>
          </StickyContainer>
          
          
          <NotificationContainer className="w-full py-2">
            <div className="p-2 rowStart gap-2 selected-box outline-css outline-focus">
              <Icon variant="InfoBox" styles="size-5 primary-text" />
              Notification
            </div>
            
            <PageContent className="py-4">
              <Outlet />
            </PageContent>
          </NotificationContainer>

          <StickyContainer className='hidden 2xl:flex items-start pt-2 min-w-[20%] 2xl:min-w-[15%]'>
            <div className="sticky top-[4.5rem] h-screen overflow-y-auto min-w-[20%] 2xl:min-w-[12%]">
              <Hashbar />
            </div>
          </StickyContainer>
        </ContentAndSidebar>
        
      </Container>
      
        

      {/*<div className='spacing gap-4 p-4'>*/}
      {/*  /!*<CustomContent />*!/*/}
      {/*</div>*/}
      <Footer />
    </>
  );
}


// Styled Components
const Container = styled.div``;
const ContentAndSidebar = styled.div``;
const StickyContainer = styled.div``;
const NotificationContainer = styled.div``;
const PageContent = styled.div``;


// Documentation Sidebar Links
export const DocumentationPage_SidebarLinks: SubPageLinkProps[] = [
  // Inputs Page and Subroutes
  {
    sectionLink: { label: "Get Started", url: "" },
    subLinks: []
  },
  {
    // TODO: Add redirects to create individual "home" page content for the quickLinks of each section
    sectionLink: { label: "Forms", url: "Forms" }, 
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
];
