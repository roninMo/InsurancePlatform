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


export const Documentation = () => {
  /* TODO: From where we left off
  
    x Update any props like input's variant options to be memoized, and flatten any others that shouldn't be an object. 
      - Update the input props to be flattened, and dynamically add variant params based on the input's variant prop


    - Finish the documentation pages
      - Content
        - Alert, Card, Icon, Dropdown
      - Utils
        - Modal, Tooltip & Provider, HashLink, HeightTransWrapper

    - This entails the docs content, component themes, variants, and options
      - Add the introduction pages and quickLinks for the docs sections and introduction


    - Add an alias for the home and docs page, and all page components for quickly reffing imports and readability 
    - Convenience functions for object entries logic and looping (utility functions for Records mapping and retrieval)
      - add documentation to UpdateRecord, and move it to the library utils
      - Add a getEntries to return either an array or the default entries list without calling Object.fromEntries
      - check if there's any other quick functions you can add for Record/map edit and retrieval scenarios
    - Fix up the CustomContent page to use the proper props
    - Decide whether you want to find a place to add the tooltip on the textarea


    - Documentation pages
      - Introduction: list of boxes categorizing each subroot section 
      - each subroot/ should have QuickList to display their components
      - Inputs, content, utils component showcases
    
    - Add react hook forms soon alongside the option to add state to the value for custom scenarios
      - this changes all inputs, add custom opts for using useState to track value instead.

    - Eventually add aria specific stuff to custom components!

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
              <Icon variant="InfoBox" styles="size-5 primary-text" />
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
                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[bug]&nbsp;.*'&nbsp;/&nbsp;&nbsp;.*'&nbsp;;&nbsp;.*`-&nbsp;+'&nbsp;&nbsp;`*'
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