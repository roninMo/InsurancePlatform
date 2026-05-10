import { useState } from 'react';
import { Outlet } from "react-router-dom";

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


export const Documentation = () => {
  /* TODO: From where we left off

    - Finish the documentation pages
      - Forms
        x add conditionally rendered variant props for the input component
          - just need to remove the opts variant and fix all the current inputs that are being used
        - add RHF to all components, and change the state to a custom prop that overrides rhf

    - When we're using Textastic 
      - update the props comments to be doc comments for the forms components 

    - @note for the hashLink scroll restoration. 
        Once they navigate to a hash link and it auto scrolls to it's location on the page,
        any scrolling the user did will snap to wherever they scrolled when the animation finishes

    - we need to prevent user scrolling until that animation is done, 
      - if they navigated to a hash link
      - for as long as it takes to navigate
      - try speeding up the animation, it feels kind of sluggish
        - FIX: Use a singleton class to keep track of the current state init, navigating, scrolling, ready
          - with 2 functions: 
            - getNavState() -> HashLink, Navbar
            - shouldScrollToHash(url, wasReload) -> uses the stored prevUrl and reload to check if it's valid to scroll
          - then remove the extra state props passed to hashLinks, they're no longer needed  
        - Another thing, if there isn't a hashLink, have it start at the start of the page

    - Navbar Navigation Handler 
      - We need a specific route map to define the page names for the browser history
      - Should there be history for when we navigate to hashLinks on the same page? And should we add the hash context to the history


    - Add react hook forms soon alongside the option to add state to the value for custom scenarios
      - this changes all inputs, add custom opts for using useState to track value instead.

    - Eventually add aria specific stuff to custom components!


    - Add an alias for the home and docs page, and all page components for quickly reffing imports and readability 
    - Convenience functions for object entries logic and looping (utility functions for Records mapping and retrieval)
      - add documentation to UpdateRecord, and move it to the library utils
      - Add a getEntries to return either an array or the default entries list without calling Object.fromEntries
      - check if there's any other quick functions you can add for Record/map edit and retrieval scenarios
    - Fix up the CustomContent page to use the proper props
    - Decide whether you want to find a place to add the tooltip on the textarea




    - TODO: This will probably be done during MockDatabase's construction  
    - Then add a notifications component that function's like an interactive dropdown for inboxes, system notifications, chat messages
      - Create the initial layout for the dropdown popup that renders the list elements, 
          - and have it templated <T, K> where T = NotificationItemData, K = NotificationItem; learn how to pass dynamic props like this?
        - Then create notificationItems for 
          - A chat system with users and messages
          - A mockDb system notification system that allows for a specific layout and prompt, 
            - with an additional content section for things like
              - certain notifications for db specific actions
              - when a db is created, edited, so on.
              - with the ability to take something like the update history, and pass it into a variant of this for descriptive history state
          - A system notification system similar to above, but for account specific things 


        devlog sidebar render history for each component 
          - with an array of t: time, type: props, parent, state, context, other, log message, log values passed in.
          - a display like a console of each component rerendered with a dropdown quick info and content dropdown,
          - a by component page with a filter search for individual components. with a list of the rerenders and its info from the array
          - a config section to select each prop to have devlogs
          - filtered section should show components enabled, and then those grayed out, with old data from when it was enabled






        - have a linked list tree search to traverse after a filtered search
        - each component ref should have a parent, component, alias (it's label or input value), and props to display as a second sidebar popover
        - check to enable disable logging, and selectable to show current rerenders and logging
        - tabs should be console, filtered, by component, and settings


      - vite ATS code to attach the parentComponentName as a prop to all components
        - https://share.google/aimode/jI9AcgZHCDzDSxLux
        - use this to create a hierarchy of components for traversing and object structure
        - have the devlog capture this and the component's specific props as well, essential for rerender context

      - Devlog that captures the devlogs and rerender states of components, 
        - That has multiple consoles for readability and different focuses to help debug code

        - A popover content bar that comes from the bottom of the screen like a console, with dynamic sizing from a min height
        - It has multiple consoles, and a specific section to select a component to see it's specific devlogs.
          1. The 'Console' tab displays all components selected, their logs, their rerenders, and metadata for both in each message within dropdowns
              - option for render/console. The render view (default) captures all messages tied to a component and 
                  stores them in a rerender IF there was a recent rerender (200ms before / after).
          
          2. The 'Filtered' tab (is created when they filter on the console -> moved to this one for brevity)
              - Let's you select components to show in the console instead of everything enabled.
              - Allows them a sidebar that has a search to select, then a hierarchy (from the current component, to it's children or 
                  back up a level). 
            
          3. The 'By Component' tab allows for a different view, one that lets you select a single component, and show all it's logs and rerenders in a single list
              - The hierarchy should be more open and scrollable (by mouse), or find something to do here
              - The actual menu should be different, rather

          4. The 'Settings' tab allows you to adjust certain settings for the devlog, and anything else used in this popover 
                - setting for displaying logs to the console
                - what components should have devlogs enabled
                - etc.


          Note on Sidebar component selection
            - should have a col row layout, with a div in each row to build a tree diagram |- and negative margins on the containers of the content 
              - <col> <itemRow> <tree> <itemContainer> /> etc.
              - should have a search to filter the found components
              - Components should have their component name, and a ref of the current (their label prop, input value, or id number)
              - The hierarchy should let you click on the nested components, or go back
              - There should be a "{...}" icon in the top right of the sidebar for a popover of their specific props

          Each specific logged message
            - the log has the message, data attached the log, and any additional used in the custom devLog
              - message should have a style for a string value
              - the additional data should use a json stringify library to render this (dropdown)
            - the rerender log captures the [time, component, rerender type, etc.]
              - for the timeline we should have a dropdown of the logs that occurred during this rerender



        - A singleton class that the devlog subscribes to passes both log types to the class for storage and use
          - the history value is a Record<index, DevLog | Rerender> that increments with each log captured
          - There will be an additional two variables created from this


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
        <ContentAndSidebars className="span-12 rowStart gap-4">
          <StickySidebar className='flex items-start min-h-[80vh]'>
            <div className="sticky top-[4.5rem] h-screen overflow-y-auto min-w-[20%] 2xl:min-w-[12%]">
              <Sidebar 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onSetSidebarState={onSetSidebarState}
                LinkSections={DocumentationPage_SidebarLinks}
              />
            </div>
          </StickySidebar>
          
          
          <Content className="w-full py-2">
            <NotificationContainer	className="p-2 rowStart gap-2 selected-box outline-css outline-focus">
              <Icon variant="CircleQuestion" styles="size-5 primary-text" />
              Notification
            </NotificationContainer>
            
            <PageContent className="py-4 pr-4 2xl:pr-0">
              <Outlet />
              
              <div className='span-12'>
                <div className='p-2 showcase-text'>

                  {/* <div className='ascii-text'> 
                        _                       
                        \`*-.                   
                        )  _`-.                
                        .  : `. .               
                        : _   '  \              
                        ; *` _.   `*-._         
                        `-.-'          `-.      
                          ;       `       `.    
                          :.       .        \   
                          . \  .   :   .-'   .  
                          '  `+.;  ;  '      :  
                          :  '  |    ;       ;-.
                          ; '   : :`-:     _.`* ;
                [bug] .*' /  .*' ; .*`- +'  `*'
                      `*-*   `*-*  `*-*'       
                  </div> */}
                  <p className='ascii-text hover:loading-text transition-all'>
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\`*-.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;_`-.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;:&nbsp;`.&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;_&nbsp;&nbsp;&nbsp;'&nbsp;&nbsp;\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;;&nbsp;*`&nbsp;_.&nbsp;&nbsp;&nbsp;`*-._&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`-.-'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`-.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`.&nbsp;&nbsp;&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\&nbsp;&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.&nbsp;\&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;.-'&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'&nbsp;&nbsp;`+.;&nbsp;&nbsp;;&nbsp;&nbsp;'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;'&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;;-.
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;;&nbsp;'&nbsp;&nbsp;&nbsp;:&nbsp;:`-:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_.`*&nbsp;;
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[bue]&nbsp;.*'&nbsp;/&nbsp;&nbsp;.*'&nbsp;;&nbsp;.*`-&nbsp;+'&nbsp;&nbsp;`*'
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`*-*&nbsp;&nbsp;&nbsp;`*-*&nbsp;&nbsp;`*-*'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </p>

                </div>
              </div>
            </PageContent>
          </Content>

          <StickySidebar className='hidden 2xl:flex items-start pt-2 min-w-[20%] 2xl:min-w-[15%]'>
            <div className="sticky top-[4.5rem] h-screen overflow-y-auto min-w-[20%] 2xl:min-w-[12%]">
              <Hashbar />
            </div>
          </StickySidebar>
        </ContentAndSidebars>
        
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
const ContentAndSidebars = styled.div``;
const Content = styled.div``;
const StickySidebar = styled.div``;
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
      { label: 'Dropbox', url: '/Documentation/Forms/Dropbox' },
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
      { label: 'Alert', url: '/Documentation/Content/Alert' },
      { label: 'Card', url: '/Documentation/Content/Card' },
      { label: 'Icon', url: '/Documentation/Content/Icon' },
      { label: 'Dropdown', url: '/Documentation/Content/Dropdown' },
    ]
  },
  // Utils Page and Subroutes
  {
    sectionLink: { label: "Utils", url: "Utils" },
    subLinks: [
      { label: 'DragAndDrop', url: '/Documentation/Utils/DragAndDrop' },
      { label: 'Modal', url: '/Documentation/Utils/Modal' },
      { label: 'Tooltip', url: '/Documentation/Utils/Tooltip' },
      { label: 'HashLink', url: '/Documentation/Utils/HashLink' },
    ]
  }
];


/*



        .
       -.\_.--._.______.-------.___.---------.___
       )`.                                       `-._
      (                                              `---.
      /o                                                  `.
     (                                                      \
   _.'`.  _                                                  L
   .'/| "" """"._                                            |
      |          \             |                             J
                  \-._          \                             L
                  /   `-.        \                            J
                 /      /`-.      )_                           `
                /    .-'    `    J  """"-----.`-._             |\          VK
              .'   .'        L   F            `-. `-.___        \`.
           ._/   .'          )  )                `-    .'""""`.  \)
__________((  _.'__       .-'  J              _.-'   .'        `. \
                   """""""((  .'--.__________(   _.-'___________)..|----------------._____
                            ""                """               ``U'

-----._______
             `-------.__________.--
                       `-.                      ______________.---------------------------
                          `----'`---------'----'

                                                               .-.        .-.
                                                              -  )      .'  )
                                                   __        /  /      /   /
                         .--.                   .-'  """"-._/__(_____.'   /
                      .-'  _)          __     .'  ___.--'                J
                     /  `-.,   .------'  `--.J---'                      /
                     F      `-<                                       .'
                     `.        `.                                 .--'
                     .'|         \                              .'
                   .'            J                             /
                  /              /                            /
                 /              '                           -'
               .'                                          (
              /                               __.----'      \
             /                         __.---'       `.      L
          .-'     _.              .--''                \     \
         /       '             .-'                      \     \
         `--.       /`  __.---'                          \     \
             \     /  .'                                  \     \
             -`.    _/                                     \     \
              ' \_,-'-._                            _       \     L
                    \`.`-                          / )       `.    L
                                                  (   )        \   |
  VK                                              J   (         L   L
                                                   \   \        |   )
                                               .')_.F   \       \  /
                                               (_)'      \       ""
                                              .'         /
                                             /          /
                  F-.                       /           `.
                  )  `._                 _.'/             \
                 /  -   `-------.___'`-'`                  L
                /                  )                       |
               /_.-.                                       )
              --._                                    .' .-.`.
               \  '                                   | /   \ )
             -''`.                                    \ |    Y
           .'.'/| `--'                               .'`.\__/
            ' '      J                            .-'
                      \                         .'
                   _.-'--.           ___     _.'
                .-'       `-    )--'``  `````
              .'    ._    __.--'
VK            (  _.'  """"
               ""                                _.,._./)
                                             .-''        `-.
                  ___                      .'               `.
           ____.-'   `--.____             /                 <)
         <_.  /__---.    `.  `-""------.-'                   L
          `. //  `,                                        -.|
            \ \    )                                         `._
             | )                                                `-.
 VK          J                                                     `-.
              L  _.      /         \                      _           `--.__
              `. \)     /           `.                     `-._             `-.___
                \    .'              |                   _.'   `-._               `-.
                 |"-'\`-._    \      |     .--._    _.--'          ``-.___           )
                 J  J\`.  `-._ \     |_.--'     """"                      `----.___.'
                  L  )        "J    J
                   `"           L   |
                                ( ...\
                                 \\\\'
                                  `-'




                                           ______  .----.___
                                       .--'      `' `-      `-.
                                    .-'                        `.
                                __.'-                            `.
    VK                        .'                                   `.
                   _.---._   /                                       `.
                 .'       "-'                                          `.
             .--'                                              .         `.
             `._.-"                                             \._        `.
               <_`-.                            .'              |  `.        `.
                |`                   .'     .--'._            .'     `-.       `.
                |         |/         |   .-'      `---.__.---'          `.       `.
                 \``    _.-          | .'                                 `.       `.
                  L   //F `.         |/                                     `-.      \
                  |"""\J    \        |                                         `-.    \
                   |||\F   .'\       |                                            `-._/
                    |`J  .'   \|     F
                    ` F |      )    J
                     J  F      |    J
                     |  F      |    F
                     \_/       |   J
                               |   )
                               F  J
                              J   |
                             ')   F
                             /.   |                             .-""-.__
                             ', J'            _.--"""--._____.-'        `-._
                             `-''          .-'                              `.
                                         .'                        _.._       `.
                                        /                       J""    `-.      \
                                       /                         \        `-.    `.
                                     .'          |               F           \     \
                                     F           |              /             `.    \
                               _.---<_           J             J                `-._/
                             ./`.     `.          \          J F
                          __/ F  )                 \          \
                        <     |                \    >.         L
                         `-.                    |  J  `-.      )
         VK                J         |          | /      `-    F
                            \  o     /         (|/        //  /
                             `.    )'.          |        /'  /
                              `---'`\ `.        |        /  /
                              '|\\ \ `. `.      |       /( /
                                 `` `  \  \     |       \_'
                                        L  L    |     .' /
                                        |  |    |    (_.'
                                        J  J    F
                                        J  J   J
                                        J  J   J                                 .--.
                                        J  J   F                                J    L
                                        |  |  J                                 |    |
                                        |  F  F                                 F    F
                                        F /L  |                                J    J
                                        `' \_)'                               /    /
                                                                             /    /
                                                                           .'    /
                                                   .--""--._              /     /
                                               _.-'         `-.          /     /
                                    __       .'                `.       /     /
                                 _-'-."`-.  J                    \     /     /
                            .---(  `, _   `'|                     `.  J     /
                              `. )                                  ""     /
                               F                                          J
                               L                  |                      J
                               ` (/     /         |                      F
                                |    ._'          |                      |
                               /'`--'`.           |                      J
                               '||\   |-._        `.  ___.               |
                                 `     \  `.        |/    `-            J
                                        F   L       /       J           /
                                        |   J      J         F         J
                                        |    \     J         |        J
                                        |    |L    J         J        J
                                        |    FJ    |          L       |
             VK                         |   J  L   |          L\      F
                                        |   F  |   |           L\    J
                                        F  F   |   |           | L   |
                                       J  J    |   |           | |   F
                                       /  )    F  J            F F  J
                                      ( .'    )   F           J J  F
                                      `"     (   J           /.'  J
                                              `-'           ||-' |)
                                                              '-'


                                               .--.
                                               `.  \
                                                 \  \
                                                  .  \
                                                  :   .
                                                  |    .
                                                  |    :
                                                  |    |
  ..._  ___                                       |    |
 `."".`''''""--..___                              |    |
 ,-\  \             ""-...__         _____________/    |
 / ` " '                    `""""""""                  .
 \                                                      L
 (>                                                      \
/                                                         \
\_    ___..---.                                            L
  `--'         '.                                           \
                 .                                           \_
                _/`.                                           `.._
             .'     -.                                             `.
            /     __.-Y     /''''''-...___,...--------.._            |
           /   _."    |    /                ' .      \   '---..._    |
          /   /      /    /                _,. '    ,/           |   |
          \_,'     _.'   /              /''     _,-'            _|   |
                  '     /               `-----''               /     |
                  `...-'     dp                                !_____)

*/