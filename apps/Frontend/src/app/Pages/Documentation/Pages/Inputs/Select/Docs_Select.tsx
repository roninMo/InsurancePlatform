import { useState, useMemo, SetStateAction, Dispatch, useContext } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { getSourceCode, TooltipContextActions, TooltipService } from "@Project/ReactComponents";

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';
import { ElementState } from '../../../Components/ShowcaseElement/ElementStates/ElementState';

import { DocLink } from '../../../Components/DocLink/DocLink';
import { Kw } from '../../../Components/Keyword/Keyword';
import styled from '@emotion/styled';

import SelectCodeSnippets from './Docs_SelectJsxComponents?raw';
import { 
  Example_MultiSelectInput, 
  Example_SelectInput 
} from './Docs_SelectJsxComponents';


export const Docs_Select = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const { show, hide } = useContext(TooltipService);
  const [currentTab, setCurrentTab] = useState<string>('Default');
  const tabs: string[] = ['Default', 'MultiSelect'];
  const tabLabels: string[] = ['Default', 'Multi Select'];

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

  const [dropdownSettings, setDropdownSettings] = useState<{closeOnLeave?: boolean; keepOpenOnSlct?: boolean; preventOpenOnTab?: boolean }>({});
  const [msDropdownSettings, setMsDropdownSettings] = useState<{closeOnLeave?: boolean; keepOpenOnSlct?: boolean; preventOpenOnTab?: boolean }>({});

  const updateDropdownSettings = (
    setting: 'closeOnLeave' | 'keepOpenOnSlct' | 'preventOpenOnTab', 
    setState: Dispatch<SetStateAction<{closeOnLeave?: boolean; keepOpenOnSlct?: boolean; preventOpenOnTab?: boolean}>>
  ) => {
    setState(prevState => {
      const currentValue: true | false | undefined = prevState[setting];
      let newValue: true | false | undefined; // undefined settings don't influence normal variant behavior
      if (currentValue === undefined) newValue = true;
      if (currentValue === true) newValue = false;
      if (currentValue === false) newValue = undefined;

      return {...prevState, [setting]: newValue };
    });
  }


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2">
        Select Component
      </h3>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          The select component is a custom component that functions just like a select. It has built in styling and event functionality
          for handling both select and <Kw>multi select</Kw> functionality, with built in options for how the dropdown behaves for either.
          It has themed styling, and allows you to pass in custom Icons for the <Kw>selectItems</Kw>, and allows you to take control of the state with ease.
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
      <Variants className='span-12 py-2'>
        { currentTab == 'Default' && 
          <ShowcaseElement jsx={getSourceCode(SelectCodeSnippets, "Example_SelectInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={error} setError={setError}
              disabled={disabled} setDisabled={setDisabled}
              elementStateTypes={[]} additionalStateStyles='pb-0'
            >
              <Example_SelectInput 
                error={error} 
                disabled={disabled} 
                closeOnLeave={dropdownSettings.closeOnLeave}
                keepOpenOnSlct={dropdownSettings.keepOpenOnSlct}
                preventOpenOnTab={dropdownSettings.preventOpenOnTab}
              />
            </ShowcaseExample_StateRef>

            <div className={`pb-32 showcase-state-ref-states-c`}>
              {/* Close dropdown when mouse leaves the select? */}
              <div className={ dropdownSettings.closeOnLeave === true ?  'element-state-v-green' :
                dropdownSettings.closeOnLeave === false ? 'element-state-v-red' : 'element-state-v-gray' }>
                <ElementState type='closeOnLeave' onClick={() => updateDropdownSettings('closeOnLeave', setDropdownSettings)} isSelected />
              </div>

              {/* Keep dropdown open onSelect? */}
              <div className={ dropdownSettings.keepOpenOnSlct === true ?  'element-state-v-green' :
                dropdownSettings.keepOpenOnSlct === false ? 'element-state-v-red' :'element-state-v-gray' }>
                <ElementState type='keepOpenOnSlct' onClick={() => updateDropdownSettings('keepOpenOnSlct', setDropdownSettings)} isSelected />
              </div>

              {/* Prevent opening the dropdown when user tabs to the select? */}
              <div className={ dropdownSettings.preventOpenOnTab === true ?  'element-state-v-green' :
                dropdownSettings.preventOpenOnTab === false ? 'element-state-v-red' : 'element-state-v-gray' }>
                <ElementState type='preventOpenOnTab' onClick={() => updateDropdownSettings('preventOpenOnTab', setDropdownSettings)} isSelected />
              </div>
              
              <span className='pl-4 rowStart items-center text-nowrap *:pr-4 *:text-sm *:italic *:font-semibold'>
                <span className='ok-text'>green="true",</span> 
                <span className='error-text'>red="false",</span> 
                <span className='text-colors'>gray="undefined"</span>
              </span>
            </div>
          </ShowcaseElement>
        }
        
        { currentTab == 'MultiSelect' && 
          <ShowcaseElement jsx={getSourceCode(SelectCodeSnippets, "Example_MultiSelectInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={error} setError={setError}
              disabled={disabled} setDisabled={setDisabled}
              elementStateTypes={[]} additionalStateStyles='pb-0'
            >
              <Example_MultiSelectInput 
                error={error} 
                disabled={disabled} 
                closeOnLeave={msDropdownSettings.closeOnLeave}
                keepOpenOnSlct={msDropdownSettings.keepOpenOnSlct}
                preventOpenOnTab={msDropdownSettings.preventOpenOnTab}
              />
            </ShowcaseExample_StateRef>

            <div className={`pb-32 showcase-state-ref-states-c`}>
              {/* Close dropdown when mouse leaves the select? */}
              <div className={ msDropdownSettings.closeOnLeave === true ?  'element-state-v-green' :
                msDropdownSettings.closeOnLeave === false ? 'element-state-v-red' : 'element-state-v-gray' }>
                <ElementState type='closeOnLeave' onClick={() => updateDropdownSettings('closeOnLeave', setMsDropdownSettings)} isSelected />
              </div>

              {/* Keep dropdown open onSelect? */}
              <div className={ msDropdownSettings.keepOpenOnSlct === true ?  'element-state-v-green' :
                msDropdownSettings.keepOpenOnSlct === false ? 'element-state-v-red' :'element-state-v-gray' }>
                <ElementState type='keepOpenOnSlct' onClick={() => updateDropdownSettings('keepOpenOnSlct', setMsDropdownSettings)} isSelected />
              </div>

              {/* Prevent opening the dropdown when user tabs to the select? */}
              <div className={ msDropdownSettings.preventOpenOnTab === true ?  'element-state-v-green' :
                msDropdownSettings.preventOpenOnTab === false ? 'element-state-v-red' : 'element-state-v-gray' }>
                <ElementState type='preventOpenOnTab' onClick={() => updateDropdownSettings('preventOpenOnTab', setMsDropdownSettings)} isSelected />
              </div>
              
              <span className='pl-4 rowStart items-center text-nowrap *:pr-4 *:text-sm *:italic *:font-semibold'>
                <span className='ok-text'>green="true",</span> 
                <span className='error-text'>red="false",</span> 
                <span className='text-colors'>gray="undefined"</span>
              </span>
            </div>
          </ShowcaseElement>
        }
      </Variants>

      <h3 className="span-12 p-2 pt-8">
        Customizing the Dropdown's behavior
      </h3>

      <div className='span-12'>
        <div className='p-2 showcase-text'>
          There's also custom properties for overriding the dropdown behavior to suit your needs. If you want the dropdown to close 
          when the user's mouse leaves the dropdown, enable <Kw>closeDropdownOnLeave</Kw>. If you want to adjust when the dropdown closes for both the <Kw>Select</Kw> or <Kw>MultiSelect</Kw>, 
          set <Kw>keepDropdownOpenOnSelect</Kw> to true or false. Leaving it undefined will let each variant keep it's natural behavior.

          <br/><br/>
          Finally, by default if you tab to the select component, the dropdown will automatically open. 
          If you don't want this behavior, set <Kw>preventOpenOnTabFocus</Kw> to true.
        </div>
      </div>

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
  'name', 'label', 'description',
  'spacing', 'value', 'values', 'multiSelect', 'onSelect', 'placeholder',
  'spacing', 'error', 'errorMessage', 'disabled', 'required', 'tooltip',
  'dropdownOptions'
];


const variantParamsList: Record<string, string[]> = {
  'none': [],
}

const childParamsList: Record<string, string[]> = {
  'tooltip': [
    'context', 'content',
  ],
  'dropdownOptions': [
    'closeDropdownOnLeave',
    'keepDropdownOpenOnSelect',
    'preventOpenOnTabFocus',
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
  'name': () => <ParamType type="string" tooltip={{ code: dParArg('name', 'select-form-name') }} />,
  'label': () => <ParamType type="string" tooltip={{ code: dParArg('label', 'Select Label') }} />,
  'description': () => <ParamType type="string" tooltip={{ code: dParArg('description', 'the description of the Select component.') }} />,

  'value': () => <ParamType type="SelectItem" tooltip={{ code: Code_SelectItem, type: 'interface' }} />,
  'values': () => <ParamType type="SelectItem" isArray tooltip={{ code: Code_SelectItem, type: 'interface' }} />,
  'multiSelect': () => <ParamType type="boolean" tooltip={{ code: dParArg('multiSelect', 'multiSelect', 'var') }} />,
  'onSelect': () => <ParamType type="changeEvent" tooltip={{ code: Code_onSelect, type: 'type' }} />,
  'placeholder': () => <ParamType type="string" tooltip={{ code: dParArg('placeholder', 'Placeholder text...') }} />,

  'error': () => <ParamType type="boolean" tooltip={{ code: dParArg('error', 'error', 'var') }} />,
  'errorMessage': () => <ParamType type="string" tooltip={{ code: dParArg('errorMessage', 'An error occurred.') }} />,
  'disabled': () => <ParamType type="boolean" tooltip={{ code: dParArg('disabled', 'disabled', 'var') }} />,
  'required': () => <ParamType type="boolean" tooltip={{ code: dParArg('required', 'required', 'var') }} />,

  'tooltip': () => <ParamType type="TooltipOptions" />,
  'context': () => <ParamType type="TooltipContextActions" tooltip={{ code: Code_TooltipContextActions, type: 'interface' }} />,
  'content': () => <ParamType type="TooltipContentProps" tooltip={{ code: Code_TooltipService, type: 'interface' }} />,

  'dropdownOptions': () => <ParamType type="SelectOpts" />,
  'closeDropdownOnLeave': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('closeDropdownOnLeave', 'true | false | undefined', 'var'), type: 'interface' }} />,
  'keepDropdownOpenOnSelect': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('keepDropdownOpenOnSelect', 'true | false | undefined', 'var'), type: 'interface' }} />,
  'preventOpenOnTabFocus': () => <ParamType type="boolean" optional tooltip={{ code: dParArg('preventOpenOnTabFocus', 'true | false | undefined', 'var'), type: 'interface' }} />,

};

// Code Snippets
import SourceSelectSnippets from '@lib-rc/Forms/Select/SelectItem/SelectItem.tsx?raw';
const Code_SelectItem = getSourceCode(SourceSelectSnippets, 'SelectItem', 'interface');
const Code_onSelect = 'onSelect: (selected: SelectItem, index: number) => void;';

import TooltipServiceSnippets from '@lib-rc/Common/Utilities/Tooltip/TooltipProvider/TooltipProvider.tsx?raw';
const Code_TooltipContextActions = getSourceCode(TooltipServiceSnippets, 'TooltipContextActions', 'interface');

import TooltipSnippets from '@lib-rc/Common/Utilities/Tooltip/Tooltip.tsx?raw';
const Code_TooltipService = getSourceCode(TooltipSnippets, 'TooltipContentProps', 'type');


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
  'multiSelect': () => 
    <div className='param-item-desc-text'>
      Whether the user is allowed to select multiple values.
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

  'dropdownOptions' : () =>
    <div className='param-item-desc-text'>
      Optional parameters to adjust the select component's dropdown functionality.
    </div>,
  'closeDropdownOnLeave' : () =>
    <div className='param-item-desc-text'>
      Should the dropdown close when the user's mouse moves outside of the dropdown? 
    </div>,
  'keepDropdownOpenOnSelect' : () =>
    <div className='param-item-desc-text'>
      Whether the dropdown should stay open when they select a value. Keeping this undefined allows the default behavior for select and multi-select versions to take precedence.
    </div>,
  'preventOpenOnTabFocus' : () =>
    <div className='param-item-desc-text'>
      By default, when the user tabs to the select, the dropdown will open. If you don't want this behavior, set this value to true.
    </div>,
};
