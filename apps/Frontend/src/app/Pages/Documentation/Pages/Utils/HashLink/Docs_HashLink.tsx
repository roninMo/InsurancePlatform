import { useState, useMemo, SetStateAction, Dispatch, useContext } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { getSourceCode, Ht, TooltipContextActions, TooltipService } from "@Project/ReactComponents";

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import styled from '@emotion/styled';

import HashLinkCodeSnippets from './Docs_HashLinkJsxComponents?raw';
import { 
  Example_CustomHashLink,
  Example_DefaultHashLink,
  Example_PageHashLink,
  Example_UseNavigateHashLink, 
} from './Docs_HashLinkJsxComponents';


export const Docs_HashLink = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const { show, hide } = useContext(TooltipService);
  const [currentTab, setCurrentTab] = useState<string>('default');
  const tabs: string[] = ['default', 'page', 'useNavigate', 'custom'];
  const tabLabels: string[] = ['Default', 'Page', 'UseNavigate', 'Custom'];

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


  return (
    <Container className='spacing'>
      <h3 className="span-12 p-2 docs-showcase-header">
        HashLink Component
      </h3>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          The <Kw>HashLink</Kw> component is a dynamic react router <Kw>Link</Kw> that's built to add hashLink navigation functionality 
          and make it easier and more efficient to use the Link element. It has multiple <Kw>Types</Kw> for how you're navigating, 
          and allows you to add a label or your own custom content that's wrapped within it.
        </div>
        
        <div className='p-2 showcase-text'>
          By default the hashLink adds state to navigation that the application uses to handle scrolling to a hashLink like "/home#introduction"
          during a navigation. The types are <Kw>router</Kw>, which is the default behavior. 
          <Kw>page</Kw>, for navigating to a another site in a new tab, and adds nohttp referrer for safety.
          Finally, there's <Kw>useNavigate</Kw> which adds additional&nbsp;
          <span onClick={hide} onMouseLeave={hide} onMouseEnter={() => show({ code: Code_NavigateOptions, type: "interface" })} >
            <DocLink label='options' url='/Documentation/Forms/Slider' />
          </span>

          &nbsp;you can use when navigating for handling window history and internal navigation logic.
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
          <ShowcaseElement jsx={getSourceCode(HashLinkCodeSnippets, "Example_DefaultHashLink")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-10 lg:span-6 p-8'>
              <Example_DefaultHashLink />
            </div>
          </ShowcaseElement>
        }
        { currentTab == 'page' && 
          <ShowcaseElement jsx={getSourceCode(HashLinkCodeSnippets, "Example_PageHashLink")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-10 lg:span-6 p-8'>
              <Example_PageHashLink />
            </div>
          </ShowcaseElement>
        }
        { currentTab == 'useNavigate' && 
          <ShowcaseElement jsx={getSourceCode(HashLinkCodeSnippets, "Example_UseNavigateHashLink")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-10 lg:span-6 p-8'>
              <Example_UseNavigateHashLink />
            </div>
          </ShowcaseElement>
        }
        { currentTab == 'custom' && 
          <ShowcaseElement jsx={getSourceCode(HashLinkCodeSnippets, "Example_CustomHashLink")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <div className='span-10 lg:span-6 p-8'>
              <Example_CustomHashLink />
            </div>
          </ShowcaseElement>
        }
      </Variants>

      <div className='span-12 p-2 pt-0'>
        <Ht show={currentTab == 'default'} cStyles='showcase-text'>
          The default <Kw>HashLink</Kw> only requires the url, and you can optionally pass in a label or html content, styles, and custom navigation state.
          The state must be <Kw>memoized</Kw> for it to prevent unnecessary rerenders.
        </Ht>
        <Ht show={currentTab == 'page'} cStyles='showcase-text'>
          The <Kw>page</Kw> type allows you to use a url to navigate to another site, with safe https referrers while opening in a new tab. 
        </Ht>
        <Ht show={currentTab == 'useNavigate'} cStyles='showcase-text'>
          The <Kw>useNavigate</Kw> type lets you pass in&nbsp;
          <span onClick={hide} onMouseLeave={hide} onMouseEnter={() => show({ code: Code_NavigateOptions, type: "interface" })} >
            <DocLink label='NavigateOptions' url='/Documentation/Forms/Slider' />
          </span>

          &nbsp;to the navigate function. Useful for certain scenarios where you need custom navigation logic.
        </Ht>
        <Ht show={currentTab == 'custom'} cStyles='showcase-text'>
          You don't need to define a <Kw>label</Kw> if you have custom html within the HashLink.
          It works for all <Kw>types</Kw>, and you should use it accordingly.
        </Ht>
      </div>

      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='HashLink Parameters' openByDefault>
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

const Content = styled.div``;
const Jsx = styled(Ht)``;
const JsxCopySnippet = styled.div``;


//---------------------------------------------//
// Component param table logic                 //
//---------------------------------------------//
// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'url', 'styles', 
];

// Variant's contextual params
const variantParamsList: Record<string, string[]> = {
  'default': [
    'label', 'children', 'type', 'state', 'customNavigate',
  ],
  'page': [
    'label', 'children', 'type', 'state', 'customNavigate', 
  ],
  'useNavigate': [
    'label', 'children', 'type', 'opts', 'customNavigate', 
  ],
  'custom': [
    'children', 'type', 'opts', 'customNavigate', 
  ],
}

// Nested Params
const childParamsList: Record<string, string[]> = {
};


// variant specific context params
const paramContextsList: Record<string, ParamContext[]> = {
  "default": [{ name: 'type="router"', overwrite: 'type', contextParam: true }],
  "page": [{ name: 'type="page"', overwrite: 'type', contextParam: true }],
  "useNavigate": [{ name: 'type="useNavigate"', overwrite: 'type', contextParam: true }],
  "custom": [{ name: 'type="undefined"', overwrite: 'type' }],
};


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// Static FC component functions do not take up memory or increase load times, they're static and diffing is nominal
const paramTypeElements: Record<string, React.FC> = {
  'url': () => <ParamType type="string" tooltip={{ code: dParArg('url', '/Home') }} />,
  'styles': () => <ParamType type="string" tooltip={{ code: dParArg('styles', 'link-text') }} />,
  
  'label': () => <ParamType type="string" tooltip={{ code: dParArg('label', 'Click Me') }} />,
  'children': () => <ParamType type="ReactNode" tooltip={{ text: 'The custom content rendered within the HashLink.' }} />,
  
  'type': () => <ParamType type="NavTypes" tooltip={{ code: Code_NavTypes }} />,
  'state': () => <ParamType type="any" tooltip={{ code: dParArg('state', '{ fromNavigate: true }', 'var', 'By default, that HashLink adds this.') }} />,
  'opts': () => <ParamType type="NavigateOptions" tooltip={{ code: Code_NavigateOptions }} />,
  'customNavigate': () => <ParamType type="function" tooltip={{ code: dParArg('customNavigate', '() => MyCustomNavLogic()', 'var') }} />,
};

// Code Snippets
import SourceHashLinkSnippets from '../../../../../Components/Utils/HashLink/HashLink?raw';
const Code_NavTypes = getSourceCode(SourceHashLinkSnippets, 'NavTypes', 'type');
const Code_NavigateOptions = getSourceCode(HashLinkCodeSnippets, 'NavigateOptions', 'interface');


const paramDescriptionElements: Record<string, React.FC> = {
  'url': () => 
    <div className='param-item-desc-text'>
      The url we're navigating to. Accepts id hash links, and by default will scroll to them upon navigation.
      If you don't want this behavior, add "fromNavigate: false" to your state, or use a normal Link.
    </div>,
  'styles': () => 
    <div className='param-item-desc-text'>
      Custom styles for the HashLink. By default, the class used is "link-text".
    </div>,

  'label': () => 
    <div className='param-item-desc-text'>
      The label of the HashLink. If you want custom content instead of text, omit this and add children inside your HashLink in the jsx. 
    </div>,
  'children': () =>
    <div className='param-item-desc-text'>
      Optionally rendered content that's wrapped in a link. Used in place of the label prop. Accepted with all types.
    </div>,

  'type': () =>
    <div className='param-item-desc-text'>
      The type of navigate you're using. The types are "router" (default nav), "page" (new page, no http refer), and "useNavigate" (adds opts: NavigateOptions).
    </div>,
  'state': () =>
    <div className='param-item-desc-text'>
      Any additional state you want to pass to the next page using the useNavigate hook. 
      The HashLink uses this for handling scrollRestoration if you're navigating to a hashLink @see Navbar.tsx.
    </div>,
  'opts': () =>
    <div className='param-item-desc-text'>
      Used with the "useNavigate" type. Allows you to pass custom navigation options (which includes state) to the navigate function.
    </div>,
  'customNavigate': () =>
    <div className='param-item-desc-text'>
      If you want your own navigation logic, you can use this function for additional logic ran alongside the navigation. 
      The type is omitted if you're using a custom navigation function.  
    </div>,
};
