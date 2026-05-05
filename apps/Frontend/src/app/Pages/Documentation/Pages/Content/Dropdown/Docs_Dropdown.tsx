import { useState, useMemo, SetStateAction, Dispatch, useContext } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { getSourceCode, getValuesFromType, TooltipContextActions, TooltipService } from "@Project/ReactComponents";
import { buttonParamDescElements, buttonParamsList, buttonParamTypeElements } from '../../Inputs/Button/Docs_Button';

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import styled from '@emotion/styled';

import DropdownCodeSnippets from './Docs_DropdownJsxComponents?raw';
import { 
  Example_Dropdown, 
} from './Docs_DropdownJsxComponents';


export const Docs_Dropdown = () => {
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
      baseParamList, contextParams, childParamsList, 
      combinedParamTypeEls, combinedParamDescEls
    );
    
    // Variant specific params
    const variantParams: string[] = variantParamsList[currentTab] || [];
    const variantContextParams = paramContextsList[currentTab];
    if (variantParams?.length > 0) {
      const spacing: (ParamItem | 'spacing')[] = ['spacing'];
      const variantParamItems: (ParamItem | 'spacing')[] = getParamsTableItems(
        variantParams, variantContextParams, childParamsList, 
        combinedParamTypeEls, combinedParamDescEls
      );

      params.push(...spacing, ...variantParamItems);
    }

    return params;
  }, [currentTab]);


  //--------------------------------//
  // Input State Management         //
  //--------------------------------//


  return (
    <Container className='spacing'>
      <h3 className="span-12 p-2 docs-showcase-header">
        Dropdown Component
      </h3>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          The <Kw>Dropdown</Kw> component is a dynamic dropdown container and a label with customizable styling. You can keep track of it's 
          internal state for whether it's opened or closed, add or override it's styling and change it's icons to suit your needs.
        </div>
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
          <ShowcaseElement jsx={getSourceCode(DropdownCodeSnippets, "Example_Dropdown")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-12 p-8'>
              <Example_Dropdown isThisTabOpen paramTable={
                <ParamTable 
                  params={paramTableItems} 
                  additionalStyles='mt-4' 
                />
              } />
            </div>
          </ShowcaseElement>
        }
      </Variants>
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
  'label', 'openByDefault', 'icon',
  'spacing', 'openListener', 'overrideOpen', 
  'spacing', 'children', 'styling',
];



// Variant's contextual params
const variantParamsList: Record<string, string[]> = {
  'none': [],
}

// Nested Params
const childParamsList: Record<string, string[]> = {
  'styling': [
    'styles', 'additStyles',
    'labelStyles', 'additLabelStyles',
    'iconStyles', 'additLabelStyles',
  ]
};


// variant specific context params
const paramContextsList: Record<string, ParamContext[]> = {
  "default": [ 
    { name: 'styles', contextParam: false, variantOption: true }, 
    { name: 'labelStyles', contextParam: false, variantOption: true }, 
    { name: 'iconStyles', contextParam: false, variantOption: true }, 
  ],
};


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// Static FC component functions do not take up memory or increase load times, they're static and diffing is nominal
const paramTypeElements: Record<string, React.FC> = {
  'label': () => <ParamType type="string" tooltip={{ code: dParArg('label', 'Example Dropdown') }} />, 
  'openByDefault': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('openByDefault', 'openByDefault', 'var') }} />, 
  'icon': () => <ParamType type="IconTypes" optional tooltip={{ code: Code_IconTypes }} />,
  
  'openListener': () => <ParamType type="function" tooltip={{ code: Code_OpenListener }} />,
  'overrideOpen': () => <ParamType type="boolean" tooltip={{ code: dParArg('overrideOpen', 'overrideOpen', 'var') }} />,
  'children': () => <ParamType type="ReactNode" tooltip={{ text: "The component's that are nested within this jsx element." }} />,
  'styling': () => <ParamType type="" />,

  'styles': () => <ParamType type="string" tooltip={{ code: dParArg('styles', 'container-classes')}} />, 
  'additStyles': () => <ParamType type="string" tooltip={{ code: dParArg('additStyles', 'additional-classes')}} />,
  
  'labelStyles': () => <ParamType type="string" tooltip={{ code: dParArg('labelStyles', 'label-classes')}} />, 
  'additLabelStyles': () => <ParamType type="string" tooltip={{ code: dParArg('additLabelStyles', 'additional-classes')}} />,
  
  'iconStyles': () => <ParamType type="string" tooltip={{ code: dParArg('iconStyles', 'icon-classes')}} />, 
  'additIconStyles': () => <ParamType type="string" tooltip={{ code: dParArg('additIconStyles', 'additional-classes')}} />,
};

// Code Snippets
import SourceDropdownSnippets from '../../../../../Components/Content/Dropdown/Dropdown.tsx?raw';
const Code_IconTypes = getSourceCode(SourceDropdownSnippets, 'CardType', 'type');
const Code_OpenListener = 'openListener?: Dispatch<SetStateAction<boolean>>;';


const paramDescriptionElements: Record<string, React.FC> = {
  'label': () => 
    <div className='param-item-desc-text'>
      The dropdown's label. You can add or override it's styles using labelStyles, or additLabelStyles.
    </div>,
  'openByDefault': () => 
    <div className='param-item-desc-text'>
      Whether the container should remove the background that wraps around it's content.
    </div>,
  'icon': () => 
    <div className='param-item-desc-text'>
      If you want to use your own custom icon for the dropdown.
    </div>,

  'openListener': () => 
    <div className='param-item-desc-text'>
      Pass in your own state to keep track of the dropdown's.
    </div>,
  'overrideOpen': () => 
    <div className='param-item-desc-text'>
      A value for when you want to override whether the dropdown is currently open.
    </div>,
  'children': () => 
    <div className='param-item-desc-text'>
      The components placed inside the dropdown. Functions like a normal div component, just pass what's placed inside the dropdown.
    </div>,
  'styling': () => 
    <div className='param-item-desc-text'>
      A list of conditional props used to style the dropdown's components. You can either override or add to the current styles. 
      These are not nested parameters, they're a part of the dropdown's base props.
    </div>,

  // Conditional Styling Params
  'styles': () => 
    <div className='param-item-desc-text'>
      The styles of the container. If you're using styles, 
      additStyles is restricted, and vice versa. 
    </div>,
  'additStyles': () => 
    <div className='param-item-desc-text'>
      Additional styles for the container. If you're using additStyles, 
      styles is restricted, and vice versa. 
    </div>,
  'labelStyles': () => 
    <div className='param-item-desc-text'>
      The styles of the header. If you're using labelStyles, 
      additLabelStyles is restricted, and vice versa.
    </div>,
  'additLabelStyles': () => 
    <div className='param-item-desc-text'>
      Additional styles for the header. If you're using additLabelStyles, 
      labelStyles is restricted, and vice versa.
    </div>,
  'iconStyles': () => 
    <div className='param-item-desc-text'>
      The styles of the description. If you're using iconStyles, 
      additIconStyles is restricted, and vice versa.
    </div>,
  'additIconStyles': () => 
    <div className='param-item-desc-text'>
      Additional styles for the description. If you're using additIconStyles, 
      iconStyles is restricted, and vice versa.
    </div>,
};


// Combine with the button's documentation refs to prevent code duplication
const combinedParamTypeEls: Record<string, React.FC> = {
  ...paramTypeElements,
  ...buttonParamTypeElements
}

const combinedParamDescEls: Record<string, React.FC> = {
  ...paramDescriptionElements,
  ...buttonParamDescElements
}
