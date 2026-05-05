import { useState, useMemo, SetStateAction, Dispatch, useContext } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { getSourceCode, getValuesFromType, TooltipContextActions, TooltipService } from "@Project/ReactComponents";

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import styled from '@emotion/styled';

import TooltipCodeSnippets from '../Tooltip/Docs_TooltipJsxComponents?raw';
import ModalCodeSnippets from './Docs_ModalJsxComponents?raw';
import { 
  Example_Modal,
  Example_ModalOpener, 
} from './Docs_ModalJsxComponents';


export const Docs_Modal = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const { show, hide } = useContext(TooltipService);
  const [currentTab, setCurrentTab] = useState<string>('default');
  const tabs: string[] = ['default'];
  const tabLabels: string[] = ['Default'];

  const showTabContent = (tab: string) => tab == currentTab ? 'grid-rows-[1fr] order-[-1]' : 'grid-rows-[0fr] opacity-0';
  const tabStyles = (tab: string) => `tab-default text-base ${tab == currentTab ? 'tab-active' : ''}`;

  const onClickTab = (tab: string) => {
    setCurrentTab(tab);
    // updateParamContexts(tab);
  }

  //--------------------------------//
  // Param Table State              //
  //--------------------------------//
  const paramTableItems = useMemo(() => {
    const baseParamList: string[] = defaultParams || [];
    const contextParams: ParamContext[] = paramContextsList[currentTab]; 
    const params: (ParamItem | 'spacing')[] = getParamsTableItems(
      baseParamList, contextParams, childParamsList, paramTypeElements, paramDescriptionElements
    );
    
    // Variant specific params
    const variantParams: string[] = variantParamsList[currentTab] || [];
    const variantContextParams = paramContextsList[currentTab];
    if (variantParams?.length > 0) {
      const spacing: (ParamItem | 'spacing')[] = ['spacing'];
      const variantParamItems: (ParamItem | 'spacing')[] = getParamsTableItems(
        variantParams, variantContextParams, childParamsList, paramTypeElements, paramDescriptionElements
      );

      params.push(...spacing, ...variantParamItems);
    }

    return params;
  }, [currentTab]);


  //--------------------------------//
  // Input State Management         //
  //--------------------------------//
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


  return (
    <Container className='spacing'>
      <h3 className="span-12 p-2 docs-showcase-header">
        Modal Component
      </h3>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          The <Kw>Modal</Kw> component is a popup container that you can use for various things like
          system notifications and is useful for adding additional content while retaining the current page layout. 
        </div>
      </div>

      <div className='span-12'>
        <p className='p-2 showcase-text'>
          If you're just looking for a popup on hover for descriptions and contextual information, try &nbsp;
          <span 
            onMouseEnter={() => show({ code: getSourceCode(TooltipCodeSnippets, "Example_Tooltip"), type: "component" })} 
            onClick={hide}
            onMouseLeave={hide}
          >
            <DocLink label='Tooltip' url='/Documentation/Utils/Tooltip' />
          </span>
        </p>
      </div>

      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container'>
        { tabs.map((tab: string, index: number) => 
          <div onClick={() => onClickTab(tab)} className={tabStyles(tab)} key={`showcase-input-tab-${tab}-${index}`} >
            {/* { tab && tab.charAt(0) ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''} */}
            { tabLabels[index] }
          </div>
        )}
      </Tabs>
      
      {/* Variants */}
      <Variants className='span-12 py-2' id="showcase-variants">
        { currentTab == 'default' && 
          <ShowcaseElement jsx={getSourceCode(ModalCodeSnippets, "Example_DefaultModal")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-12 p-8'>
              <Example_ModalOpener isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>
          </ShowcaseElement>
        }
      </Variants>


      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Modal Parameters' openByDefault>
          <ParamTable 
            params={paramTableItems} 
            additionalStyles='mt-4' 
          />
        </Dropdown>
      </div>
      
      {/* Rendered Modal */}
      <Example_Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Container>
  );
}


// Styled Components
const Container = styled.div``;
const Tabs = styled.div``;
const Variants = styled.div``;


//---------------------------------------------//
// Component param table logic                 //
//---------------------------------------------//
// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'isModalOpen', 'setModalOpen', 'onCloseModal',
  'spacing', 'label', 'noOverlay', 'closeModalButton',
  'spacing', 'containerStyles', 'overlayStyles', 'labelStyles', 'closeIconStyles',
  'spacing', 'children',
];

// Variant's contextual params
const variantParamsList: Record<string, string[]> = {
  'none': [],
}

// Nested Params
const childParamsList: Record<string, string[]> = {
};


// variant specific context params
const paramContextsList: Record<string, ParamContext[]> = {
  "none": [],
};


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// Static FC component functions do not take up memory or increase load times, they're static and diffing is nominal
const paramTypeElements: Record<string, React.FC> = {
  'isModalOpen': () => <ParamType type="boolean" tooltip={{ code: dParArg('isModalOpen', 'isModalOpen', 'var') }} />,
  'setModalOpen': () => <ParamType type="SetState" tooltip={{ code: Code_SetModalOpen }} />,
  'onCloseModal': () => <ParamType type="function" tooltip={{ code: Code_onCloseModal }} />,

  'label': () => <ParamType type="string" tooltip={{ code: dParArg('label', 'Modal Header') }} />,
  'noOverlay': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('noOverlay', 'noOverlay', 'var') }} />,
  'closeModalButton': () => <ParamType type="boolean" optional tooltip={{ code: 'closeModalButton={closeModalButton} // Default = true' }} />,

  'containerStyles': () => <ParamType type="string" tooltip={{ code: dParArg('containerStyles', 'container-classes') }} />,
  'overlayStyles': () => <ParamType type="string" tooltip={{ code: dParArg('overlayStyles', 'overlay-classes') }} />,
  'labelStyles': () => <ParamType type="string" tooltip={{ code: dParArg('labelStyles', 'label-classes') }} />,
  'closeIconStyles': () => <ParamType type="string" tooltip={{ code: dParArg('closeIconStyles', 'closeIcon-classes') }} />,

  'children': () => <ParamType type="ReactNode" tooltip={{ text: 'The content within the rendered modal jsx.' }} />,
};

// Code Snippets
const Code_SetModalOpen = 'setModalOpen: Dispatch<SetStateAction<boolean>>;';
const Code_onCloseModal = 'onCloseModal?: () => void;';

import SourceButtonSnippets from '@lib-rc/Forms/Button/Button.tsx?raw';
const Code_ButtonProps = getSourceCode(SourceButtonSnippets, 'ButtonProps', 'interface');


const paramDescriptionElements: Record<string, React.FC> = {
  'isModalOpen': () =>
    <div className='param-item-desc-text'>
      State for when the modal is open. Controlled by the parent to allow you to control it's open state
    </div>,
  'setModalOpen': () =>
    <div className='param-item-desc-text'>
      The SetState dispatch for opening/closing the modal. 
      Used internally to close the modal when the user clicks away or presses the close button.
    </div>,
  'onCloseModal': () =>
    <div className='param-item-desc-text'>
      Optional additional functionality for when the user closes the modal.
    </div>,
  'label': () =>
    <div className='param-item-desc-text'>
      The label of the modal component.
    </div>,
  'noOverlay': () =>
    <div className='param-item-desc-text'>
      Set to true if you don't want an overlay that darkens the content outside of the modal. 
    </div>,
  'closeModalButton': () =>
    <div className='param-item-desc-text'>
      If you want a button to close the modal within the modal. Clicking outside of the modal also closes the modal by default.
    </div>,
  'containerStyles': () =>
    <div className='param-item-desc-text'>
      The styles of the modal's container. Used to change the theme's background and outline, margin, etc.
    </div>,
  'overlayStyles': () =>
    <div className='param-item-desc-text'>
      If you want custom styles to change the classes of the overlay.
    </div>,
  'labelStyles': () =>
    <div className='param-item-desc-text'>
      Whether you want to override the label's styles.
    </div>,
  'closeIconStyles': () =>
    <div className='param-item-desc-text'>
      Whether you want to override the close icon's styles.
    </div>,
  'children': () =>
    <div className='param-item-desc-text'>
      The components placed inside the modal. Functions like a normal div component, just pass what's placed inside the modal.
    </div>,
};
