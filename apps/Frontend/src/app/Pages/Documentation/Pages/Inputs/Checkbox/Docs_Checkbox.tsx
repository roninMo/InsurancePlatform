
import { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';
import { ParamType } from '../../../Components/ParamType/ParamType';

import CheckboxCodeSnippets from './Docs_CheckboxJsxComponents?raw';
import { getSourceCode } from '../../../../../Components/Utils/GetSourceCode';
import { 
  Example_DefaultCheckbox,
  Example_ListCheckbox,
  Example_InlineCheckbox 
} from './Docs_CheckboxJsxComponents';



export const Docs_Checkbox = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<string>('list');
  const tabs: string[] = ['default', 'list', 'inline',];
  const tabLabels: string[] = ['Default', 'List', 'Inline',];

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
  const [defaultError, setDefaultError] = useState<string>('');
  const [defaultDisabled, setDefaultDisabled] = useState<boolean>(false);
  
  const [listError, setListError] = useState<string>('');
  const [listDisabled, setListDisabled] = useState<boolean>(false);
  
  const [inlineError, setInlineError] = useState<string>('');
  const [inlineDisabled, setInlineDisabled] = useState<boolean>(false);


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2">
        Checkbox Component
      </h3>

      <div className='span-12' id="showcase-element">
        <p className='p-2 showcase-text'>
          A functional checkbox component with multiple styled variants for different use cases. 
          The functionality handles everything, you just need to pass it the state, 
          and a function to handle when the user toggles one of the checkboxes.
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
      <Variants className='span-12 py-2'>
        { currentTab == 'default' && 
          <ShowcaseElement jsx={getSourceCode(CheckboxCodeSnippets, "Example_DefaultCheckbox")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={defaultError} setError={setDefaultError}
              disabled={defaultDisabled} setDisabled={setDefaultDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_DefaultCheckbox error={defaultError} disabled={defaultDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }

        { currentTab == 'list' && 
          <ShowcaseElement jsx={getSourceCode(CheckboxCodeSnippets, "Example_ListCheckbox")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={listError} setError={setListError}
              disabled={listDisabled} setDisabled={setListDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_ListCheckbox error={listError} disabled={listDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }

        { currentTab == 'inline' && 
          <ShowcaseElement jsx={getSourceCode(CheckboxCodeSnippets, "Example_InlineCheckbox")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={inlineError} setError={setInlineError}
              disabled={inlineDisabled} setDisabled={setInlineDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_InlineCheckbox error={inlineError} disabled={inlineDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
      </Variants>

      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Checkbox Parameters' openByDefault>
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

const showCaseElementStyleProps = {
  styles: "p-4 pl-8 pt-8 pb-2 span-12 lg:span-8",
  stateStyles: "p-4 pl-8 span-12 lg:span-8 rowStart gap-2"
};


//---------------------------------------------//
// Component param table logic                 //
//---------------------------------------------//
// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'variant', 'id', 'name', 'label', 'description',

  'spacing', 'items', 'onSelect', 'onMouseEnter', 'onMouseLeave',
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
  'variant': () => <ParamType type="CheckboxVariant" />,
  'id': () => <ParamType type="string" />,
  'name': () => <ParamType type="string" />,
  'label': () => <ParamType type="string" />,
  'description': () => <ParamType type="string" />,

  'items': () => <ParamType type="CheckboxItems" isArray />,
  'onSelect': () => <ParamType type="function" />,
  'onMouseEnter': () => <ParamType type="ParamItem" />,
  'onMouseLeave': () => <ParamType type="ParamItem" />,

  'error': () => <ParamType type="boolean" />,
  'errorMessage': () => <ParamType type="string" />,
  'disabled': () => <ParamType type="boolean" />,
  'required': () => <ParamType type="boolean" />,
};

const paramDescriptionElements: Record<string, React.FC> = {
  'variant': () =>
    <div className='param-item-desc-text'>
      The style of checkbox you want. The options are default, inline, and list.
    </div>,
  'name': () =>
    <div className='param-item-desc-text'>
      The internal id used for capturing values during submit and with form libraries like @see react-hook-forms.
    </div>,
  'label': () =>
    <div className='param-item-desc-text'>
      The label of the checkbox component.
    </div>,
  'description': () =>
    <div className='param-item-desc-text'>
      The description of the checkbox component.
    </div>,

  'items': () =>
    <div className='param-item-desc-text'>
      A list containing the information and state of each checkbox item. You should use the 
      @see onSelect function for handling the state and whether each item is checked, as this isn't handled internally. 
    </div>,
  'onSelect': () =>
    <div className='param-item-desc-text'>
      The function used to handle when one of the checkbox items are selected. 
    </div>,
  'onMouseEnter': () =>
    <div className='param-item-desc-text'>
      An optional event function for when you hover over the checkbox component.
    </div>,
  'onMouseLeave': () =>
    <div className='param-item-desc-text'>
      An optional event function for when the user's mouse leaves the checkbox component.
    </div>,

  'error': () =>
    <div className='param-item-desc-text'>
      Whether there's an error for the checkbox component.
    </div>,
  'errorMessage': () =>
    <div className='param-item-desc-text'>
      The error message for the checkbox component.
    </div>,
  'disabled': () =>
    <div className='param-item-desc-text'>
      Whether the checkbox component is disabled.
    </div>,
  'required': () =>
    <div className='param-item-desc-text'>
      Whether the checkbox component is required.
    </div>,
};
