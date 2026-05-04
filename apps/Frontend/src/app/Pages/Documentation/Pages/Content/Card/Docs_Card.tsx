import { useState, useMemo, SetStateAction, Dispatch, useContext } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { getSourceCode, TooltipContextActions, TooltipService } from "@Project/ReactComponents";
import { buttonParamDescElements, buttonParamsList, buttonParamTypeElements } from '../../Inputs/Button/Docs_Button';

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import styled from '@emotion/styled';

import AlertCodeSnippets from '../Alert/Docs_AlertJsxComponents?raw';
import CardCodeSnippets from './Docs_CardJsxComponents?raw';
import { 
  Example_DefaultCard, 
  Example_Card, 
  Example_CardButton, 
  Example_CardLink, 
} from './Docs_CardJsxComponents';


export const Docs_Card = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const { show, hide } = useContext(TooltipService);
  const [currentTab, setCurrentTab] = useState<string>('default');
  const tabs: string[] = ['default', 'card', 'card-button', 'card-link'];
  const tabLabels: string[] = ['Default', 'Card', 'Card Button', 'Card Link'];

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
        Alert Component
      </h3>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          The <Kw>Card</Kw> component is a themed container with variants that allow you to structure your content
          in specific ways to suit your needs. It's easy to use and highly customizable, give it a try.
          
          The card types are 
          <Kw onClick={() => onClickTab('default')} styles="keyword-interactive">default</Kw>, 
          <Kw onClick={() => onClickTab('card')} styles="keyword-interactive">card</Kw>, 
          <Kw onClick={() => onClickTab('card-button')} styles="keyword-interactive">card-button</Kw>, or
          <Kw onClick={() => onClickTab('card-link')} styles="keyword-interactive">card-link</Kw>.

        </div>
      </div>

      <div className='span-12'>
        <p className='p-2 showcase-text'>
          If you're just looking for more of a notification-like element with various themes, use &nbsp;
          <span 
            onMouseEnter={() => show({ code: getSourceCode(AlertCodeSnippets, "Example_Alert"), type: "component" })} 
            onClick={hide}
            onMouseLeave={hide}
          >
            <DocLink label='Alert' url='/Documentation/Forms/Alert' />
          </span>
          
          . It functions like an html element, and you can either add content or nested html elements.
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
          <ShowcaseElement jsx={getSourceCode(CardCodeSnippets, "Example_DefaultCard")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-12 p-8'>
              <Example_DefaultCard />
            </div>
          </ShowcaseElement>
        }
        { currentTab == 'card' && 
          <ShowcaseElement jsx={getSourceCode(CardCodeSnippets, "Example_Card")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-12 p-8'>
              <Example_Card />
            </div>
          </ShowcaseElement>
        }
        { currentTab == 'card-button' && 
          <ShowcaseElement jsx={getSourceCode(CardCodeSnippets, "Example_CardButton")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-12 p-8'>
              <Example_CardButton />
            </div>
          </ShowcaseElement>
        }
        { currentTab == 'card-link' && 
          <ShowcaseElement jsx={getSourceCode(CardCodeSnippets, "Example_CardLink")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-12 p-8'>
              <Example_CardLink />
            </div>
          </ShowcaseElement>
        }
      </Variants>


      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Select Parameters' openByDefault>
          <ParamTable 
            params={paramTableItems} 
            additionalStyles='mt-4' 
          />
        </Dropdown>
      </div>
      
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
  'type', 'noBackground', 'noBorder', 'hoverTheme'
];

// Variant's contextual params
const variantParamsList: Record<string, string[]> = {
  'card': ['noDivider'],
  'card-button': [
    'noDivider', 'buttonProps', 'buttonLocation', 'focusTheme'
  ],
  'card-link': [
    'noDivider', 'linkText', 'onClickLink'
  ]
}

// Nested Params
const childParamsList: Record<string, string[]> = {
  'buttonProps': buttonParamsList
};


// variant specific context params
const paramContextsList: Record<string, ParamContext[]> = {
  "card": [ 
    { 
      overwrite: 'type', name: 'type="card"',
      contextParam: true, variantOption: false 
    }, 
    // { name: 'noDivider', contextParam: false, variantOption: true }, 
  ],

  "card-button": [ 
    { 
      overwrite: 'type', name: 'type="card-button"',
      contextParam: true, variantOption: false 
    }, 
    // { name: 'noDivider', contextParam: false, variantOption: true }, 
    // { name: 'buttonProps', contextParam: false, variantOption: true }, 
    // { name: 'buttonLocation', contextParam: false, variantOption: true }, 
    // { name: 'focusTheme', contextParam: false, variantOption: true }, 
  ],

  "card-link": [ 
    { 
      name: 'type', overwrite: 'type="card-link"',
      contextParam: true, variantOption: false 
    }, 
    // { name: 'noDivider', contextParam: false, variantOption: true }, 
    // { name: 'linkText', contextParam: false, variantOption: true }, 
    // { name: 'onClickLink', contextParam: false, variantOption: true }, 
  ],
};


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// Static FC component functions do not take up memory or increase load times, they're static and diffing is nominal
const paramTypeElements: Record<string, React.FC> = {
  'type': () => <ParamType type="CardType" tooltip={{ code: Code_CardTypes }} />,
  'noBackground': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('noBackground', 'noBackground', 'var') }} />,
  'noBorder': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('noBorder', 'noBorder', 'var') }} />,
  'hoverTheme': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('hoverTheme', 'hoverTheme', 'var') }} />,
  
  // card, card-button, card-link
  'noDivider': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('noDivider', 'noDivider', 'var') }} />,
  
  // card-button
  'buttonProps': () => <ParamType type="ButtonProps" tooltip={{ code: Code_ButtonProps }} />,
  'buttonLocation': () => <ParamType type="ButtonLocation" tooltip={{ code: Code_ButtonLocation }} />,
  'focusTheme': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('focusTheme', 'focusTheme', 'var') }} />,
  
  // card-link
  'linkText': () => <ParamType type="string" tooltip={{ code: dParArg('linkText', 'Click me') }} />,
  'onClickLink': () => <ParamType type="MouseEvent" tooltip={{ code: Code_OnClickLink }} />,
};

// Code Snippets
import SourceCardSnippets from '../../../../../Components/Content/Card/Card.tsx?raw';
const Code_CardTypes = getSourceCode(SourceCardSnippets, 'CardType', 'type');
const Code_ButtonLocation = getSourceCode(SourceCardSnippets, 'ButtonLocation', 'type');
const Code_OnClickLink = 'onClickLink: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;';

import SourceButtonSnippets from '@lib-rc/Forms/Button/Button.tsx?raw';
const Code_ButtonProps = getSourceCode(SourceButtonSnippets, 'ButtonProps', 'interface');


const paramDescriptionElements: Record<string, React.FC> = {
  'type': () => 
    <div className='param-item-desc-text'>
      The type of Card we're using. Each version have different layouts and preset content at your disposal.
    </div>,
  'noBackground': () => 
    <div className='param-item-desc-text'>
      Whether the container should remove the background that wraps around it's content.
    </div>,
  'noBorder': () => 
    <div className='param-item-desc-text'>
      Whether the container should remove the border that wraps around it's content.
    </div>,
  'hoverTheme': () => 
    <div className='param-item-desc-text'>
      If you want the component to have interactive hover styles. This just affects the background and border during hover.
    </div>,
    
  'noDivider': () => 
    <div className='param-item-desc-text'>
      Every theme that has a title and description separates them from the displayed content using a divider.
    </div>,
    
  'buttonProps': () => 
    <div className='param-item-desc-text'>
      The props used to define the themed Button. This should be memoized to prevent unnecessary rerenders.
    </div>,
  'buttonLocation': () => 
    <div className='param-item-desc-text'>
      Where you want the Button located within the Card element.
    </div>,
  'focusTheme': () => 
    <div className='param-item-desc-text'>
      Do you want the border to have a focused theme when the Button is clicked?
    </div>,
    
  'linkText': () => 
    <div className='param-item-desc-text'>
      The rendered text for the Link.
    </div>,
  'onClickLink': () => 
    <div className='param-item-desc-text'>
      The function used to handle the Link's functionality.
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
