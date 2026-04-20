import { useState, useMemo, useContext } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { TooltipService } from "../../../../../Components/Utils/Tooltip/TooltipProvider/TooltipProvider";

import { ParamItem, getParamsTableItems, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';

import { Kw } from "../../../Components/Keyword/Keyword";
import { DocLink } from "../../../Components/DocLink/DocLink";
import styled from '@emotion/styled';

import RadioCodeSnippets from './Docs_RadioJsxComponents?raw';
import RadioTableSnippets from '../RadioTable/Docs_RadioTableJsxComponents?raw';
import { getSourceCode } from '../../../../../Components/Utils/GetSourceCode';
import { 
  Example_ColumnInlineRadioGroup, 
  Example_ColumnRadioGroup, 
  Example_DefaultRadioGroup, 
  Example_ListRadioGroup 
} from './Docs_RadioJsxComponents';


export const Docs_Radio = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<string>('default');
  const tabs: string[] = ['default', 'column', 'columnInline', 'list'];
  const tabLabels: string[] = ['Default', 'Column', 'Column Inline', 'List'];


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
  const [defaultError, setDefaultError] = useState<string>('');
  const [defaultDisabled, setDefaultDisabled] = useState<boolean>(false);
  
  const [columnError, setColumnError] = useState<string>('');
  const [columnDisabled, setColumnDisabled] = useState<boolean>(false);
  
  const [columnInlineError, setColumnInlineError] = useState<string>('');
  const [columnInlineDisabled, setColumnInlineDisabled] = useState<boolean>(false);
  
  const [listError, setListError] = useState<string>('');
  const [listDisabled, setListDisabled] = useState<boolean>(false);


  return (
    <Container className='spacing'>

      <h3 className="span-12 p-2">
        Radio Group Component
      </h3>

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
          If you prefer more of a box / list style layout with smoother transitions and better visual indications
          for selections, the other version of the radio group is&nbsp;
          <span 
            onClick={hide} onMouseLeave={hide}
            onMouseEnter={() => show({ 
              code: getSourceCode(RadioTableSnippets, "Example_BlockRadioTable"), 
              type: "component" 
            })} 
          >
            <DocLink label='RadioTable' url='/Documentation/Forms/RadioTable' />
          </span>.
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
          <ShowcaseElement jsx={getSourceCode(RadioCodeSnippets, "Example_DefaultRadioGroup")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={defaultError} setError={setDefaultError}
              disabled={defaultDisabled} setDisabled={setDefaultDisabled}
              elementStateTypes={[]} 
            >
              <Example_DefaultRadioGroup error={defaultError} disabled={defaultDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }

        { currentTab == 'column' && 
          <ShowcaseElement jsx={getSourceCode(RadioCodeSnippets, "Example_ColumnRadioGroup")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={columnError} setError={setColumnError}
              disabled={columnDisabled} setDisabled={setColumnDisabled}
              elementStateTypes={[]} 
            >
              <Example_ColumnRadioGroup error={columnError} disabled={columnDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }

        { currentTab == 'columnInline' && 
          <ShowcaseElement jsx={getSourceCode(RadioCodeSnippets, "Example_ColumnInlineRadioGroup")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={columnInlineError} setError={setColumnInlineError}
              disabled={columnInlineDisabled} setDisabled={setColumnInlineDisabled}
              elementStateTypes={[]} 
            >
              <Example_ColumnInlineRadioGroup error={columnInlineError} disabled={columnInlineDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        { currentTab == 'list' && 
          <ShowcaseElement jsx={getSourceCode(RadioCodeSnippets, "Example_ListRadioGroup")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={listError} setError={setListError}
              disabled={listDisabled} setDisabled={setListDisabled}
              elementStateTypes={[]} 
            >
              <Example_ListRadioGroup error={listError} disabled={listDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
      </Variants>

      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Radio Group Parameters' openByDefault>
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
  'spacing', 'radioItems', 'currentValue', 'onSelect',
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
  'label': () => <ParamType type="string" tooltip={{ code: dParArg('label', 'Radio Group Label') }} />,
  'description': () => <ParamType type="string" tooltip={{ code: dParArg('description', 'The description of the radio group.') }} />,

  'radioItems': () => <ParamType type="RadioItem" isArray tooltip={{ code: Code_RadioItem, type: 'interface' }} />,
  'currentValue': () => <ParamType type="RadioItem" tooltip={{ code: Code_RadioItem, type: 'interface' }} />,
  'onSelect': () => <ParamType type="function" tooltip={{ code: Code_onSelect, type: 'type' }} />,

  'error': () => <ParamType type="boolean" tooltip={{ code: dParArg('error', 'error', 'var') }} />,
  'errorMessage': () => <ParamType type="string" tooltip={{ code: dParArg('errorMessage', 'errorMessage', 'var') }} />,
  'disabled': () => <ParamType type="boolean" tooltip={{ code: dParArg('disabled', 'disabled', 'var') }} />,
  'required': () => <ParamType type="boolean" tooltip={{ code: dParArg('required', 'required', 'var') }} />,
};


// TODO: when imported to the library, use actual refs
interface RadioItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
type RadioVariant = 'default' | 'column' | 'columnInline' | 'list';
import SourceRadioSnippets from './Docs_Radio?raw';
const Code_onSelect = 'onSelect: (item: RadioItem, currentValue: RadioItem, e: ChangeEvent<HTMLInputElement>) => void;';
const Code_RadioVariant = getSourceCode(SourceRadioSnippets, 'RadioVariant', 'type');
const Code_RadioItem = getSourceCode(SourceRadioSnippets, 'RadioItem', 'interface');


const paramDescriptionElements: Record<string, React.FC> = {
  'variant': () => 
    <div className='param-item-desc-text'>
      The style of radio group you want. The options are default, inline, and list.
    </div>,
  'name': () => 
    <div className='param-item-desc-text'>
      The internal id used for capturing values during submit and with form libraries like @see react-hook-forms.
    </div>,
  'label': () => 
    <div className='param-item-desc-text'>
      The label of the radio group.
    </div>,
  'description': () => 
    <div className='param-item-desc-text'>
      The description of the radio group.
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

  'error': () =>
    <div className='param-item-desc-text'>
      Whether there's an error for the radio component.
    </div>,
  'errorMessage': () =>
    <div className='param-item-desc-text'>
      The error message for the radio component.
    </div>,
  'disabled': () =>
    <div className='param-item-desc-text'>
      Whether the radio component is disabled.
    </div>,
  'required': () =>
    <div className='param-item-desc-text'>
      Whether the radio component is required.
    </div>,
};
