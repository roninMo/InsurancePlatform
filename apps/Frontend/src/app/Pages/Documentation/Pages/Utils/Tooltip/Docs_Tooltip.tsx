import { useState, useMemo, SetStateAction, Dispatch, useContext, Suspense } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { CodeRenderer, getSourceCode, getValuesFromType, Ht, Icon, TooltipContextActions, TooltipService } from "@Project/ReactComponents";

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import styled from '@emotion/styled';

import ModalCodeSnippets from '../Modal/Docs_ModalJsxComponents?raw';
import TooltipCodeSnippets from './Docs_TooltipJsxComponents?raw';
import { 
  Example_TextTooltip, 
  Example_CodeTooltip,
  Example_CustomTooltip, 
  Example_TooltipProvider
} from './Docs_TooltipJsxComponents';


export const Docs_Tooltip = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const { show, hide } = useContext(TooltipService);
  const [currentTab, setCurrentTab] = useState<string>('text');
  const tabs: string[] = ['text', 'code', 'custom'];
  const tabLabels: string[] = ['Text', 'Code', 'Custom'];

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
      const variantParamItems: (ParamItem | 'spacing')[] = getParamsTableItems(
        variantParams, variantContextParams, childParamsList, paramTypeElements, paramDescriptionElements
      );

      params.push(...variantParamItems);
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
        Tooltip Component
      </h3>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          The <Kw>Tooltip</Kw> component is a highly efficient custom tooltip that works on hover with any component that utilizes the <Kw>TooltipService</Kw>. 
          It's a useContext function that gives you access to show and hide functions for rendering the tooltip without causing any extra overhead, 
          and doesn't rerender any other components in your application. The props passed into these function are also stable, and though they're objects they don't need to be memoized.
        </div>
        
        <div className='p-2 showcase-text'>
          The <Kw>Tooltip</Kw> is very dynamic, and will handle rendering and transitioning smoothly anywhere on the screen, 
          to switching views on the fly if it goes out of bounds of the viewport,
          and has it's own overflow logic with smoothed scrolling for content that doesn't fit within it's container.
        </div>
      </div>
      
      <div className='span-12'>
        <div className='p-2 showcase-text'>
          There are multiple variants of the tooltip. From 
          the <Kw>text</Kw> variant, that accepts the displayed text and additional styles for you to customize the tooltip. 
          The <Kw>code</Kw> variant allows you to pass code snippets in for it to render.
          Finally, the <Kw>custom</Kw> variant allows you to pass in your own component to be rendered within the tooltip.
        </div>
      </div>

      <div className='span-12'>
        <p className='p-2 showcase-text'>
          If you need more a popup notification, try using the &nbsp;
          <span 
            onMouseEnter={() => show({ code: getSourceCode(ModalCodeSnippets, "Example_PopupModal"), type: "component" })} 
            onClick={hide}
            onMouseLeave={hide}
          >
            <DocLink label='Modal' url='/Documentation/Utils/Modal' />
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
        { currentTab == 'text' && 
          <ShowcaseElement jsx={getSourceCode(TooltipCodeSnippets, "Example_TextTooltip")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-10 lg:span-6 p-8'>
              <Example_TextTooltip />
            </div>
          </ShowcaseElement>
        }
        { currentTab == 'code' && 
          <ShowcaseElement jsx={getSourceCode(TooltipCodeSnippets, "Example_CodeTooltip")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-10 lg:span-6 p-8'>
              <Example_CodeTooltip codeSnippet={getSourceCode(SourceTooltipProviderSnippets, 'TooltipProvider', 'component')} />
            </div>
          </ShowcaseElement>
        }
        { currentTab == 'custom' && 
          <ShowcaseElement jsx={getSourceCode(TooltipCodeSnippets, "Example_CustomTooltip")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-10 lg:span-6 p-8'>
              <Example_CustomTooltip />
            </div>
          </ShowcaseElement>
        }
      </Variants>


      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Tooltip Parameters' openByDefault>
          <ParamTable 
            params={paramTableItems} 
            additionalStyles='mt-4' 
          />
        </Dropdown>
      </div>


      <h4 className="span-12 p-2 pt-14 docs-showcase-header">
        The Tooltip Provider
      </h4>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          In order to use the <Kw>Tooltip</Kw>, you need to wrap your application in the <Kw>TooltipProvider</Kw>. 
          This allows the components to have access to the Tooltip's context, and interact with it when needed.   
        </div>
      </div>

      <div className='span-12 py-2'>
        <Container className='col outline-css outline-default'>
          <Tabs className='w-full rowStart items-center gap-4 px-4 border-b border-default rounded-t-md faded-box'>
            <div className='tab-default tab-active'>
              Usage
            </div>
          </Tabs>
    
          <Content className='w-full bg-div rounded-b-md'>
            <Jsx show cStyles='content-auto'>
              <Suspense>
                <MemoizedCodeSnippet jsx={getSourceCode(TooltipCodeSnippets, "Example_TooltipProvider")} />
              </Suspense>
            </Jsx>
          </Content>
        </Container>
      </div>
    </Container>
  );
}


interface MemoizedCodeSnippetProps {
  jsx: string;
}
const MemoizedCodeSnippet = ({ jsx }: MemoizedCodeSnippetProps) => {
  const copyCodeSnippet = async () => {
    try {
      // Sets the system clipboard to the specified text
      await navigator.clipboard.writeText(jsx);
      console.log('copied to clipboard: ', jsx);
      alert('Copied to clipboard!'); // TODO: Add a tooltip like notification to notify when copied to clipboard
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
  
  // Do not rerender react-syntax-highlighter's import, it still takes time in the DOM to render and is very slow
  const memoizedSnippet = useMemo(() => (
    <div className='-my-[7px] react-syntax-highlighter-margin-fix relative'>
      <CodeRenderer language='tsx' code={jsx} showLineNumbers />
      <JsxCopySnippet onClick={copyCodeSnippet} className='p-2 m-4 showcase-jsx-copy-snippet'>
        <Icon variant='CodeBracket' styles='size-6 i-default-color' />
      </JsxCopySnippet>
    </div>
  ), [jsx]);

  return memoizedSnippet;
}

// Styled Components
const Container = styled.div``;
const Tabs = styled.div``;
const Variants = styled.div``;

const Content = styled.div``;
const Jsx = styled(Ht)``;
const JsxCopySnippet = styled.div``;


//---------------------------------------------//
// Component param table logic                 //
//---------------------------------------------//
// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'showTooltip',
];

// Variant's contextual params
const variantParamsList: Record<string, string[]> = {
  'text': [
    'text', 'styles',
  ],
  'code': [
    'code', 'showLineNumbers', 'type'
  ],
  'custom': [
    'children'
  ],
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
  'showTooltip': () => <ParamType type="boolean" tooltip={{ code: dParArg('showTooltip', 'showTooltip', 'var') }} />,
  
  'text': () => <ParamType type="string" tooltip={{ code: dParArg('text', 'Tooltip text...') }} />,
  'styles': () => <ParamType type="string" tooltip={{ code: dParArg('styles', 'tooltip-classes') }} />,
  
  'code': () => <ParamType type="string" tooltip={{ code: dParArg('code', 'StringifiedCode', 'var', "We use vite's ?raw imports for this project.") }} />,
  'showLineNumbers': () => <ParamType type="boolean" tooltip={{ code: dParArg('showLineNumbers', 'showLineNumbers', 'var') }} />,
  'type': () => <ParamType type="CodeType" tooltip={{ code: Code_CodeTypes }} />,
  
  'children': () => <ParamType type="ReactNode" tooltip={{ text: 'The custom content rendered within the tooltip.' }} />,
};

// Code Snippets
import SourceTooltipSnippets from '@lib-rc/Common/Utilities/Tooltip/Tooltip?raw';
import SourceTooltipProviderSnippets from '@lib-rc/Common/Utilities/Tooltip/TooltipProvider/TooltipProvider?raw';
const Code_CodeTypes = getSourceCode(SourceTooltipSnippets, 'CodeTypes', 'type');


const paramDescriptionElements: Record<string, React.FC> = {
  'showTooltip': () =>
    <div className='param-item-desc-text'>
      Whether the tooltip is displayed. This is handled internally, and is adjusted using the TooltipProvider's show() and hide() context functions.
    </div>,

  // Text Tooltip
  'text': () =>
    <div className='param-item-desc-text'>
      The tooltip's rendered text.
    </div>,
  'styles': () =>
    <div className='param-item-desc-text'>
      Optional custom styling for the tooltip's container
    </div>,

  // Code Tooltip
  'code': () =>
    <div className='param-item-desc-text'>
      The stringified code you want to render in the tooltip's code renderer. We're using react-syntax-highlighter.
    </div>,
  'showLineNumbers': () =>
    <div className='param-item-desc-text'>
      Set to true if you want to display the line numbers for this code snippet.
    </div>,
  'type': () =>
    <div className='param-item-desc-text'>
      The type of code you're displaying. Changes the rendered styles and the label of the code block based on it's type. 
      The options are component, type, interface, and example.
    </div>,


  // Custom Tooltip
  'children': () =>
    <div className='param-item-desc-text'>
      The components placed inside the modal. Functions like a normal div component, just pass what's placed inside the modal.
    </div>,
};
