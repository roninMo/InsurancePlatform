import { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';
import { ParamType } from '../../../Components/ParamType/ParamType';

import SelectCodeSnippets from './Docs_SelectJsxComponents?raw';
import { getSourceCode } from '../../../../../Components/Utils/GetSourceCode';
import { Example_SelectInput } from './Docs_SelectJsxComponents';





export const Docs_Select = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<string>('Default');
  const tabs: string[] = ['Default'];
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
    const params: (ParamItem | 'spacing')[] = getParamsTableItems(baseParamList, contextParams, childParamsList, paramTypeElements, paramDescriptionElements);
    
    // Variant specific params
    const variantParams: string[] = variantParamsList[currentTab] || [];
    const variantContextParams = paramContextsList[currentTab];
    if (variantParams?.length > 0) {
      const spacing: (ParamItem | 'spacing')[] = ['spacing'];
      const variantParamItems: (ParamItem | 'spacing')[] = getParamsTableItems(variantParams, variantContextParams, childParamsList, paramTypeElements, paramDescriptionElements);
      params.push(...spacing, ...variantParamItems);
    }

    return params;
  }, [currentTab]);


  //--------------------------------//
  // Input State Management         //
  //--------------------------------//
  const [error, setError] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2">
        Button Component
      </h3>

      <div className='span-12' id="showcase-element">
        <p className='p-2 showcase-text'>
          A functional radio table much like the radio group, just with nicer styles. 
          Comes with error handling and theme styling, you just need to pass it the state, 
          and a function to handle when the user selects one of the radio items.
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
        { currentTab == 'Default' && 
          <ShowcaseElement jsx={getSourceCode(SelectCodeSnippets, "Example_SelectInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={error} setError={setError}
              disabled={disabled} setDisabled={setDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_SelectInput error={error} disabled={disabled} />
            </ShowcaseExample_StateRef>
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

const showCaseElementStyleProps = {
  styles: "p-4 pl-8 pt-8 pb-2 span-12 lg:span-8",
  stateStyles: "p-4 pl-8 pb-32 span-12 lg:span-8 rowStart gap-2"
};


//---------------------------------------------//
// Component param table logic                 //
//---------------------------------------------//
// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'name', 'label', 'description',
  'spacing', 'value', 'values', 'onSelect', 'placeholder',
  'spacing', 'error', 'errorMessage', 'disabled', 'required', 'tooltip'
];


const variantParamsList: Record<string, string[]> = {
  'none': [],
}

const childParamsList: Record<string, string[]> = {
  'tooltip': [
    'context', 'content',
  ]
};


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
  'name': () => <ParamType type="string" />,
  'label': () => <ParamType type="string" />,
  'description': () => <ParamType type="string" />,

  'value': () => <ParamType type="SelectItemValues" />,
  'values': () => <ParamType type="SelectItemValues" isArray />,
  'onSelect': () => <ParamType type="function" />,
  'placeholder': () => <ParamType type="string" />,

  'error': () => <ParamType type="boolean" />,
  'errorMessage': () => <ParamType type="string" />,
  'disabled': () => <ParamType type="boolean" />,
  'required': () => <ParamType type="boolean" />,

  'tooltip': () => <ParamType type="TooltipBundle" />,
  'context': () => <ParamType type="TooltipActions" tooltip={{ code: Code_TooltipActions, type: 'type' }} />,
  'content': () => <ParamType type="TooltipServiceProps" tooltip={{ code: Code_TooltipService, type: 'type' }} />,
};

// codeblocks - TextInputTypes, TextInputAutoCompleteTypes, InputVariantOps
import TooltipSnippets from './Docs_SelectJsxComponents?raw';
const Code_TooltipActions = getSourceCode(TooltipSnippets, 'TooltipActions', 'interface');
const Code_TooltipService = getSourceCode(TooltipSnippets, 'TooltipServiceProps', 'type');

const paramDescriptionElements: Record<string, React.FC> = {
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

  'value': () => 
    <div className='param-item-desc-text'>
      The value of the currently selected item.
    </div>,
  'values': () => 
    <div className='param-item-desc-text'>
      A list of values used to construct the items that appear in the dropdown.
    </div>,
  'onSelect': () => 
    <div className='param-item-desc-text'>
      The function used to handle when a new item is selected.
    </div>,
  'placeholder': () => 
    <div className='param-item-desc-text'>
      The placeholder text for when the user hasn't selected a value yet.
    </div>,

  'error': () =>
    <div className='param-item-desc-text'>
      Whether there's an error for the select component.
    </div>,
  'errorMessage': () =>
    <div className='param-item-desc-text'>
      The error message for the select component.
    </div>,
  'disabled': () =>
    <div className='param-item-desc-text'>
      Whether the select component is disabled.
    </div>,
  'required': () =>
    <div className='param-item-desc-text'>
      Whether the select component is required.
    </div>,
    
  'tooltip' : () =>
    <div className='param-item-desc-text'>
      Should this component have a tooltip?
    </div>,
  'context': () =>
    <div className='param-item-desc-text'>
      A reference to the tooltip context for rendering the tooltip on this component.
    </div>,
  'content': () =>
    <div className='param-item-desc-text'>
      The props to pass to the tooltip to render it's content.
    </div>,
};
