import { useState, useMemo, useContext } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { getSourceCode, TooltipService } from "@Project/ReactComponents";

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import styled from '@emotion/styled';

import RadioTableCodeSnippets from './Docs_RadioTableJsxComponents?raw';
import RadioGroupSnippets from '../Radio/Docs_RadioJsxComponents?raw';
import { 
  Example_InlineRadioTable, 
  Example_BlockRadioTable 
} from './Docs_RadioTableJsxComponents';


export const Docs_RadioTable = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<string>('block');
  const tabs: string[] = ['inline', 'block'];
  const tabLabels: string[] = ['Inline', 'Block'];

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
    const params: (ParamItem | 'spacing')[] = getParamsTableItems(baseParamList, contextParams, {}, paramTypeElements, paramDescriptionElements);
    
    // Variant specific params
    const variantParams: string[] = variantParamsList[currentTab] || [];
    const variantContextParams = paramContextsList[currentTab];
    if (variantParams?.length > 0) {
      const spacing: (ParamItem | 'spacing')[] = ['spacing'];
      const variantParamItems: (ParamItem | 'spacing')[] = getParamsTableItems(variantParams, variantContextParams, {}, paramTypeElements, paramDescriptionElements);
      params.push(...spacing, ...variantParamItems);
    }

    return params;
  }, [currentTab]);


  //--------------------------------//
  // Input State Management         //
  //--------------------------------//
  const { show, hide } = useContext(TooltipService);
  const [inlineError, setInlineError] = useState<string>('');
  const [inlineDisabled, setInlineDisabled] = useState<boolean>(false);
  
  const [blockError, setBlockError] = useState<string>('');
  const [blockDisabled, setBlockDisabled] = useState<boolean>(false);


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2">
        Button Component
      </h3>

      <div className='span-12'>
        <p className='p-2 showcase-text'>
          A functional radio table much like the radio group, just with nicer styles. 
          Comes with error handling and theme styling, you just need to pass it the state, 
          and a function to handle when the user selects one of the radio items.
        </p>
      </div>

      <div className='span-12'>
        <p className='p-2 showcase-text'>
          A customizable radio group with multiple styles to fit your needs, and form state and theme styling for 
          a nice look and feel to it. 

          You can use your own hooks for handling state or <Kw>react hook forms</Kw>, with built validation you can add on the fly.
          The different variants are <Kw>default</Kw>, <Kw>column</Kw>, <Kw>columnInline</Kw>, and <Kw>list</Kw>.
        </p>
      </div>
      
      <div className='span-12'>
        <p className='p-2 showcase-text'>
          If you prefer more of a traditional style layout with a decent layout and nicely themed styles, try&nbsp;
          <span 
            onClick={hide} onMouseLeave={hide}
            onMouseEnter={() => show({ 
              code: getSourceCode(RadioGroupSnippets, "Example_ListRadioGroup"), 
              type: "component" 
            })} 
          >
            <DocLink label='RadioGroup' url='/Documentation/Forms/Radio' />
          </span>.
        </p>
      </div>

      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container' id="showcase-variants">
        { tabs.map((tab: string, index: number) => 
          <div onClick={() => onClickTab(tab)} className={tabStyles(tab)} key={`showcase-input-tab-${tab}-${index}`} >
            {/* { tab && tab.charAt(0) ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''} */}
            { tabLabels[index] }
          </div>
        )}
      </Tabs>
      
      {/* Variants */}
      <Variants className='span-12 py-2'>
        { currentTab == 'inline' && 
          <ShowcaseElement jsx={getSourceCode(RadioTableCodeSnippets, "Example_InlineRadioTable")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={inlineError} setError={setInlineError}
              disabled={inlineDisabled} setDisabled={setInlineDisabled}
              elementStateTypes={[]} 
            >
              <Example_InlineRadioTable error={inlineError} disabled={inlineDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }

        { currentTab == 'block' && 
          <ShowcaseElement jsx={getSourceCode(RadioTableCodeSnippets, "Example_BlockRadioTable")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={blockError} setError={setBlockError}
              disabled={blockDisabled} setDisabled={setBlockDisabled}
              elementStateTypes={[]} 
            >
              <Example_BlockRadioTable error={blockError} disabled={blockDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }

      </Variants>

      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Radio Table Parameters' openByDefault>
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
  'variant', 'name', 'label', 'description',
  'spacing', 'radioItems', 'currentValue', 'onSelect', 'onMouseEnter', 'onMouseLeave',
  'spacing', 'error', 'errorMessage', 'disabled', 'required',
];



const variantParamsList: Record<string, string[]> = {
  'none': [],
}


const paramContextsList: Record<string, ParamContext[]> = {
  "text": [],
  "number": [
    { name: 'type="number"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'incrementButtons', 
      contextParam: false,
      variantOption: true,
    },
  ],
};


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// Static FC component functions do not take up memory or increase load times, they're static and diffing is nominal
const paramTypeElements: Record<string, React.FC> = {
  'variant': () => <ParamType type="RadioVariant" tooltip={{ code: Code_RadioVariant, type: 'type' }} />,
  'name': () => <ParamType type="string" tooltip={{ code: dParArg('name', 'radio-form-name') }} />,
  'label': () => <ParamType type="string" tooltip={{ code: dParArg('label', 'Radio Table Label') }} />,
  'description': () => <ParamType type="string" tooltip={{ code: dParArg('description', 'The description of the radio table.') }} />,

  'radioItems': () => <ParamType type="RadioItem" isArray tooltip={{ code: Code_RadioItem, type: 'interface' }} />,
  'currentValue': () => <ParamType type="RadioItem" tooltip={{ code: Code_RadioItem, type: 'interface' }} />,
  'onSelect': () => <ParamType type="ChangeEvent" tooltip={{ code: Code_onSelect, type: 'type' }} />,
  'onMouseEnter': () => <ParamType type="MouseEvent" tooltip={{ code: Code_onMouseEnter, type: 'type' }} />,
  'onMouseLeave': () => <ParamType type="MouseEvent" tooltip={{ code: Code_onMouseLeave, type: 'type' }} />,

  'error': () => <ParamType type="boolean" tooltip={{ code: dParArg('error', 'error', 'var') }} />,
  'errorMessage': () => <ParamType type="string" tooltip={{ code: dParArg('errorMessage', 'errorMessage', 'var') }} />,
  'disabled': () => <ParamType type="boolean" tooltip={{ code: dParArg('disabled', 'disabled', 'var') }} />,
  'required': () => <ParamType type="boolean" tooltip={{ code: dParArg('required', 'required', 'var') }} />,
};

// Code Snippets
import SourceRadioSnippets from '@lib-rc/Forms/RadioTable/RadioTable.tsx?raw';
const Code_onSelect = 'onSelect: (item: RadioItem, currentValue: RadioItem, e: ChangeEvent<HTMLInputElement>) => void;';
const Code_onMouseEnter = 'onMouseEnter: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;';
const Code_onMouseLeave = 'onMouseLeave: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;';
const Code_RadioVariant = getSourceCode(SourceRadioSnippets, 'RadioVariant', 'type');
const Code_RadioItem = getSourceCode(SourceRadioSnippets, 'RadioItem', 'interface');


const paramDescriptionElements: Record<string, React.FC> = {
  'variant': () => 
    <div className='param-item-desc-text'>
      The style of radio table you want. The options are inline, and block.
    </div>,
  'name': () => 
    <div className='param-item-desc-text'>
      The internal id used for capturing values during submit and with form libraries like @see react-hook-forms.
    </div>,
  'label': () => 
    <div className='param-item-desc-text'>
      The label of the radio table.
    </div>,
  'description': () => 
    <div className='param-item-desc-text'>
      The description of the radio table.
    </div>,

  'radioItems': () => 
    <div className='param-item-desc-text'>
      A list containing the information and state of each radio item. You should use the 
      @see onSelect function for handling the state and which is selected, as this isn't handled internally.
    </div>,
  'currentValue': () => 
    <div className='param-item-desc-text'>
      The currently selected radio item.
    </div>,
  'onSelect': () => 
    <div className='param-item-desc-text'>
      The function used to handle when a new radio item is selected.
    </div>,
  'onMouseEnter': () => 
    <div className='param-item-desc-text'>
      An optional function that runs when the user's mouse first hovers over this element.
    </div>,
  'onMouseLeave': () => 
    <div className='param-item-desc-text'>
      An optional function that runs when the user's mouse leaves the element. 
    </div>,

  'error': () =>
    <div className='param-item-desc-text'>
      Whether there's an error for the radio table component.
    </div>,
  'errorMessage': () =>
    <div className='param-item-desc-text'>
      The error message for the radio table component.
    </div>,
  'disabled': () =>
    <div className='param-item-desc-text'>
      Whether the radio table component is disabled.
    </div>,
  'required': () =>
    <div className='param-item-desc-text'>
      Whether the radio table component is required.
    </div>,
};
