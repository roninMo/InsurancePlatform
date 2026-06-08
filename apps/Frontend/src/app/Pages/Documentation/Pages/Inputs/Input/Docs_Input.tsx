import { useContext, useMemo, useState } from 'react';
import { ParamContext, ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { Dropdown, getSourceCode, TooltipService } from "@Project/ReactComponents";

import { ParamItem, ParamTable, getParamsTableItems } from '../../../Components/ParamTable/ParamTable';
import { dParArg, ParamType } from '../../../Components/ParamType/ParamType';
import { EventParamTable } from '../../../Components/EventParamTable/EventParamTable';

import { Kw } from '../../../Components/Keyword/Keyword';
import { DocLink } from '../../../Components/DocLink/DocLink';
import { TextInputTypes } from '@Project/ReactComponents';
import styled from '@emotion/styled';

import InputCodeSnippets from './Docs_InputJsxComponents?raw';
import TextareaCodeSnippets from '../Textarea/Docs_TextareaJsxComponents?raw';
import { 
  Example_CreditCardInput,
  Example_CurrencyInput,
  Example_EmailInput,
  Example_NumberInput,
  Example_PasswordInput,
  Example_PhoneInput,
  Example_PolicyNumberInput,
  Example_SearchInput,
  Example_TextInput,
} from './Docs_InputJsxComponents';


export const Docs_Input = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<TextInputTypes>('text');
  const tabs: TextInputTypes[] = ['text', 'number', 'email', 'password', 'search', 'policyNumber', 'phone', 'creditCard', 'currency'];
  const tabLabels: string[] = ['Text', 'Number', 'Email', 'Password', 'Search', 'Policy Number', 'Phone', 'Credit Card', 'Currency'];
  
  const showTabContent = (tab: TextInputTypes) => tab == currentTab ? 'grid-rows-[1fr] order-[-1]' : 'grid-rows-[0fr] opacity-0';
  const tabStyles = (tab: TextInputTypes) => `tab-default text-base ${tab == currentTab ? 'tab-active' : ''}`;
  
  const onClickTab = (tab: TextInputTypes) => {
    setCurrentTab(tab);
    // updateParamContexts(tab);
  }
  
  
  //--------------------------------//
  // Param Table State              //
  //--------------------------------//
  const paramTableItems = useMemo(() => {
    const baseParamList: string[] = defaultParams || [];
    const contextParams: ParamContext[] = []; // paramContextsList[currentTab]; // We're using subtableParams instead
    const subTableParams: Record<string, string[]> =  { ...childParamsList, ...childParamsVarList[currentTab] };
    const params: (ParamItem | 'spacing')[] = getParamsTableItems(baseParamList, contextParams, subTableParams, paramTypeElements, paramDescriptionElements);
    
    // Variant specific params
    const variantParams: string[] = variantParamsList[currentTab] || [];
    const variantContextParams = paramContextsList[currentTab];
    if (variantParams?.length > 0) {
      const spacing: (ParamItem | 'spacing')[] = ['spacing'];
      const variantParamItems: (ParamItem | 'spacing')[] = getParamsTableItems(variantParams, variantContextParams, subTableParams, paramTypeElements, paramDescriptionElements);
      // TODO: call getParamsTableItems once [...base, 'spacing', ...variants]
      params.push(...spacing, ...variantParamItems);
    }
    
    return params;
  }, [currentTab]);
  
  
  //--------------------------------//
  // Input State Management         //
  //--------------------------------//
  // #region States
  const [textError, setTextError] = useState<string>('');
  const [textDisabled, setTextDisabled] = useState<boolean>(false);
  
  const [numberError, setNumberError] = useState<string>('');
  const [numberDisabled, setNumberDisabled] = useState<boolean>(false);
  
  const [emailError, setEmailError] = useState<string>('');
  const [emailDisabled, setEmailDisabled] = useState<boolean>(false);
  
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordDisabled, setPasswordDisabled] = useState<boolean>(false);
  
  const [searchError, setSearchError] = useState<string>('');
  const [searchDisabled, setSearchDisabled] = useState<boolean>(false);
  
  const [phoneError, setPhoneError] = useState<string>('');
  const [phoneDisabled, setPhoneDisabled] = useState<boolean>(false);
  
  const [policyError, setPolicyError] = useState<string>('');
  const [policyDisabled, setPolicyDisabled] = useState<boolean>(false);
  
  const [creditError, setCreditError] = useState<string>('');
  const [creditDisabled, setCreditDisabled] = useState<boolean>(false);
  
  const [currencyError, setCurrencyError] = useState<string>('');
  const [currencyDisabled, setCurrencyDisabled] = useState<boolean>(false);
  // #endregion
  const { show, hide } = useContext(TooltipService);
  
  
  return (
    <Container className='spacing'>
      <h3 className="span-12 p-2 docs-showcase-header">
        Input Component
      </h3>
      
      <div className='span-12'>
        <p className='p-2 showcase-text'>
          The <Kw>Input</Kw> component is designed with functionality and customization 
          to fit your needs for the varying form types. It comes with <Kw>tooltips</Kw>, 
          <Kw>loading bars</Kw> for server side autosaving, event hooks, error handling, and <Kw>input masking</Kw>. 
          Each type has varying icons and functionality so you know whether the input is for 
          
          <Kw>text</Kw>, <Kw>email</Kw>, <Kw>phone</Kw>, <Kw>policy</Kw>, <Kw>number</Kw>, 
          <Kw>credit</Kw>, <Kw>currency</Kw>, or <Kw>search</Kw>.
        </p>
      </div>
      
      <div className='span-12'>
        <p className='p-2 showcase-text'>
          For a more interactive input component with additional buttons and customization, use &nbsp;
          <span 
            onMouseEnter={() => show({ code: getSourceCode(TextareaCodeSnippets, "Example_BoxTextareaInput"), type: "component" })} 
            onClick={hide}
            onMouseLeave={hide}
          >
            <DocLink label='Textarea' url='/Documentation/Forms/Textarea' />
          </span>
          
          . It allows you to add metadata tags with click events to allow you to 
          create specific state from the input for your needs.
          
        </p>
      </div>
      
      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container' id="showcase-variants">
        { tabs.map((tab: TextInputTypes, index: number) => 
          <div onClick={() => onClickTab(tab)} className={tabStyles(tab)} key={`showcase-input-tab-${tab}-${index}`} >
            {/* { tab && tab.charAt(0) ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''} */}
            { tabLabels[index] }
          </div>
        )}
      </Tabs>
      
      {/* Variants */}
      <Variants className='span-12 py-2'>
        {/* Currency */}
        { currentTab == 'currency' && 
          <ShowcaseElement jsx={getSourceCode(InputCodeSnippets, "Example_CurrencyInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={currencyError} setError={setCurrencyError}
              disabled={currencyDisabled} setDisabled={setCurrencyDisabled}
              elementStateTypes={[]} 
            >
              <Example_CurrencyInput error={currencyError} disabled={currencyDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Credit Card */}
        { currentTab == 'creditCard' && 
          <ShowcaseElement jsx={getSourceCode(InputCodeSnippets, "Example_CreditCardInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={creditError} setError={setCreditError}
              disabled={creditDisabled} setDisabled={setCreditDisabled}
              elementStateTypes={[]} 
            >
              <Example_CreditCardInput error={creditError} disabled={creditDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Phone Number */}
        { currentTab == 'phone' && 
          <ShowcaseElement jsx={getSourceCode(InputCodeSnippets, "Example_PhoneInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={phoneError} setError={setPhoneError}
              disabled={phoneDisabled} setDisabled={setPhoneDisabled}
              elementStateTypes={[]} 
            >
              <Example_PhoneInput error={phoneError} disabled={phoneDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Policy Number */}
        { currentTab == 'policyNumber' && 
          <ShowcaseElement jsx={getSourceCode(InputCodeSnippets, "Example_PolicyNumberInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={policyError} setError={setPolicyError}
              disabled={policyDisabled} setDisabled={setPolicyDisabled}
              elementStateTypes={[]} 
            >
              <Example_PolicyNumberInput error={policyError} disabled={policyDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Search */}
        { currentTab == 'search' && 
          <ShowcaseElement jsx={getSourceCode(InputCodeSnippets, "Example_SearchInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={searchError} setError={setSearchError}
              disabled={searchDisabled} setDisabled={setSearchDisabled}
              elementStateTypes={[]} 
            >
              <Example_SearchInput error={searchError} disabled={searchDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Password */}
        { currentTab == 'password' && 
          <ShowcaseElement jsx={getSourceCode(InputCodeSnippets, "Example_PasswordInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={passwordError} setError={setPasswordError}
              disabled={passwordDisabled} setDisabled={setPasswordDisabled}
              elementStateTypes={[]} 
            >
              <Example_PasswordInput error={passwordError} disabled={passwordDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Email */}
        { currentTab == 'email' && 
          <ShowcaseElement jsx={getSourceCode(InputCodeSnippets, "Example_EmailInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={emailError} setError={setEmailError}
              disabled={emailDisabled} setDisabled={setEmailDisabled}
              elementStateTypes={[]} 
            >
              <Example_EmailInput error={emailError} disabled={emailDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Number */}
        { currentTab == 'number' && 
          <ShowcaseElement jsx={getSourceCode(InputCodeSnippets, "Example_NumberInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={numberError} setError={setNumberError}
              disabled={numberDisabled} setDisabled={setNumberDisabled}
              elementStateTypes={[]} 
            >
              <Example_NumberInput error={numberError} disabled={numberDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Text Input */}
        { currentTab == 'text' && 
          <ShowcaseElement jsx={getSourceCode(InputCodeSnippets, "Example_TextInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={textError} setError={setTextError}
              disabled={textDisabled} setDisabled={setTextDisabled}
              elementStateTypes={[]} 
            >
              <Example_TextInput error={textError} disabled={textDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
      </Variants>
      
      
      <div className='span-12 py-2 pt-10' id="param-table">
        <Dropdown label='Input Parameters' openByDefault>
          <ParamTable 
            params={paramTableItems} 
            additionalStyles='mt-4' 
          />
        </Dropdown>
      </div>
      
      <div className='span-12 py-2 pt-4' id="event-handler-table">
        <Dropdown label='Event Handlers' openByDefault>
          <p className='p-2 pl-1 showcase-text'>
            The event handlers you can use with this component. Pass in your own event functions to interact with the element.
          </p>
          <EventParamTable additionalStyles='mt-4' />
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
  'type', 'name', 'label', 'description', 'placeholder', 
  'spacing', 'mask', 'disableHookForms', 'onUpdateValue', 'onTyped',
  'spacing', 'error', 'disabled', 'required', 
  'spacing', 'autocomplete', 'tooltip', 'opts',
];

// ? We switched to creating a nested param table instead of dynamically rendering each variant's props -> childParamList
const variantParamsList: Record<TextInputTypes, string[]> = {
  'text': [],
  'number':       [], // ['hideIncrementButtons'],
  'email':        [], // ['hideEmailIcon'],
  'password':     [], // ['hideVisibilityIcon'],
  'search':       [], // ['sortButton', 'sortType'],
  'policyNumber': [], // ['hidePolicyNumberIcon', 'disablePolicyMask'],
  'phone':        [], // ['hidePhoneIcon', 'disablePhoneMask'],
  'creditCard':   [], // ['hideCreditCardIcon', 'disableCreditCarkMask'],
  'currency':     [], // ['hideMoneySign', 'hideCurrencyTypeOpts'],
}

// The input's doc page uses a subtable to display variant specific parameters dynamically
const childParamsList: Record<string, string[]> = {
  'tooltip': [
    'context', 'content',
  ],
}
const childParamsVarList: Record<TextInputTypes, Record<string, string[]>> = {
  'text':         { "opts": [] },
  'number':       { 'opts': ['hideIncrementButtons'] },
  'email':        { 'opts': ['hideEmailIcon', 'disableEmailFilter'] },
  'password':     { 'opts': ['hideVisibilityIcon'] },
  'search':       { 'opts': ['sortButton', 'sortType'] },
  'policyNumber': { 'opts': ['hidePolicyNumberIcon', 'disablePolicyMask'] },
  'phone':        { 'opts': ['hidePhoneIcon', 'disablePhoneMask'] },
  'creditCard':   { 'opts': ['hideCreditCardIcon', 'disableCreditCarkMask'] },
  'currency':     { 'opts': ['hideMoneySign', 'hideCurrencyTypeOpts'] },
};


const paramContextsList: Record<TextInputTypes, ParamContext[]> = {
  "text": [],
  "number": [
    { name: 'type="number"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'hideIncrementButtons', 
      contextParam: false,
      variantOption: true,
    },
  ],
  "email": [
    { name: 'type="email"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'hideEmailIcon', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'disableEmailFilter', 
      contextParam: false,
      variantOption: true,
    },
  ],
  "password": [
    { name: 'type="password"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'hideVisibilityIcon', 
      contextParam: false,
      variantOption: true,
    },
  ],
  "search": [
    { name: 'type="search"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'sortButton', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'sortType', 
      contextParam: false,
      variantOption: true,
    },
  ],
  "policyNumber": [
    { name: 'type="policyNumber"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'hidePolicyNumberIcon', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'disablePolicyMask', 
      contextParam: false,
      variantOption: true,
    },
  ],
  "phone": [
    { name: 'type="phone"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'hidePhoneIcon', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'disablePhoneMask', 
      contextParam: false,
      variantOption: true,
    },
  ],
  "creditCard": [
    { name: 'type="creditCard"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'hideCreditCardIcon', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'disableCreditCarkMask', 
      contextParam: false,
      variantOption: true,
    },
  ],
  "currency": [
    { name: 'type="currency"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'hideMoneySign', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'hideCurrencyTypeOpts', 
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
  // Default params
  'type': () => <ParamType type='TextInputTypes' tooltip={{ code: Code_TextInputTypes, type: 'type' }} />,
  'name': () => <ParamType type='string' tooltip={{ code: dParArg('name', 'input-form-ref') }} />,
  'label': () => <ParamType type='string' tooltip={{ code: dParArg('label', 'Input Label') }}  />,
  'description': () => <ParamType type='string' tooltip={{ code: dParArg('description', 'The description of the input.') }} />,
  'placeholder': () => <ParamType type='string' tooltip={{ code: dParArg('placeholder', 'placeholder text...') }} />,
  
  'mask': () => <ParamType type='MaskOpts' tooltip={{ code: Code_Mask }} />,
  'disableHookForms': () => <ParamType type='boolean' tooltip={{ code: dParArg('disableHookForms', 'disableHookForms', 'var') }} />,
  'onUpdateValue': () => <ParamType type='FormEvent' tooltip={{ code: Code_OnUpdateValue }} />,
  'onTyped': () => <ParamType type='ChangeEvent' tooltip={{ code: Code_OnTyped }} />,
  
  'error': () => <ParamType type='string' tooltip={{ code: dParArg('error', 'An error occurred.') }} />,
  'disabled': () => <ParamType type='boolean' tooltip={{ code: dParArg('disabled', 'disabled', 'var') }} />,
  'required': () => <ParamType type='boolean' tooltip={{ code: dParArg('required', 'required', 'var') }} />,
  'autocomplete': () => <ParamType type='TextInputAutoCompleteTypes' tooltip={{ code: Code_TextInputAutoCompleteTypes, type: 'type' }} />,
  
  'tooltip': () => <ParamType type="TooltipOptions" />,
  'context': () => <ParamType type="TooltipContextActions" tooltip={{ code: Code_TooltipContextActions, type: 'interface' }} />,
  'content': () => <ParamType type="TooltipContentProps" tooltip={{ code: Code_TooltipService, type: 'interface' }} />,
  
  // variant params placeholder
  'opts': () => <ParamType type='InputVariantOpts' tooltip={{ code: Code_InputVariantOpts, type: 'interface' }} />,
  
  // Variant params
  'hideIncrementButtons': () => <ParamType type='boolean' tooltip={{ code: dParArg('hideIncrementButtons', 'hideIncrementButtons', 'var') }} />,
  
  'hideEmailIcon': () => <ParamType type='boolean' tooltip={{ code: dParArg('hideEmailIcon', 'hideEmailIcon', 'var') }} />,
  'disableEmailFilter': () => <ParamType type='boolean' tooltip={{ code: dParArg('disableEmailFilter', 'disableEmailFilter', 'var') }} />,
  
  'hideVisibilityIcon': () => <ParamType type='boolean' tooltip={{ code: dParArg('hideVisibilityIcon', 'hideVisibilityIcon', 'var') }} />,
  
  'sortButton': () => <ParamType type='boolean' tooltip={{ code: dParArg('sortButton', 'sortButton', 'var') }} />,
  'sortType': () => <ParamType type='SearchSortType' tooltip={{ code: Code_SearchSortType, type: 'type' }} />,
  
  'hidePolicyNumberIcon': () => <ParamType type='boolean' tooltip={{ code: dParArg('hidePolicyNumberIcon', 'hidePolicyNumberIcon', 'var') }} />,
  'disablePolicyMask': () => <ParamType type='boolean' tooltip={{ code: dParArg('disablePolicyMask', 'disablePolicyMask', 'var', 'Default: AB-0123456789') }} />,
  
  'hidePhoneIcon': () => <ParamType type='boolean' tooltip={{ code: dParArg('hidePhoneIcon', 'hidePhoneIcon', 'var') }} />,
  'disablePhoneMask': () => <ParamType type='boolean' tooltip={{ code: dParArg('disablePhoneMask', 'disablePhoneMask', 'var', 'Default: (123)-456-7890') }} />,
  
  'hideCreditCardIcon': () => <ParamType type='boolean' tooltip={{ code: dParArg('hideCreditCardIcon', 'hideCreditCardIcon', 'var') }} />,
  'disableCreditCarkMask': () => <ParamType type='boolean' tooltip={{ code: dParArg('disableCreditCarkMask', 'disableCreditCarkMask', 'var', 'Default: 0000-0000-0000-0000') }} />,
  
  'hideMoneySign': () => <ParamType type='boolean' tooltip={{ code: dParArg('hideMoneySign', 'hideMoneySign', 'var') }} />,
  'hideCurrencyTypeOpts': () => <ParamType type='boolean' tooltip={{ code: dParArg('hideCurrencyTypeOpts', 'hideCurrencyTypeOpts', 'var') }} />,
};

// Code Snippet imports
import SourceInputSnippets from '@lib-rc/Forms/Input/Input?raw';
const Code_TextInputTypes = getSourceCode(SourceInputSnippets, 'TextInputTypes', 'type');
const Code_TextInputAutoCompleteTypes = getSourceCode(SourceInputSnippets, 'TextInputAutoCompleteTypes', 'type');
const Code_InputVariantOpts = getSourceCode(SourceInputSnippets, 'InputVariantOpts', 'interface');
const Code_SearchSortType = getSourceCode(SourceInputSnippets, 'SearchSortType', 'type');

import MaskSnippets from '@lib-rc/Common/Utilities/InputMasks/InputMask?raw';
const Code_Mask = getSourceCode(MaskSnippets, 'MaskOpts', 'type');

const Code_OnUpdateValue = `OnUpdateValue?: (prevValue: string, event: FormEvent<HTMLInputElement>) => void;`;
const Code_OnTyped = `OnTyped?: (e: ChangeEvent<HTMLInputElement>) => void;`;

import TooltipServiceSnippets from '@lib-rc/Common/Utilities/Tooltip/TooltipProvider/TooltipProvider?raw';
const Code_TooltipContextActions = getSourceCode(TooltipServiceSnippets, 'TooltipContextActions', 'interface');

import TooltipSnippets from '@lib-rc/Common/Utilities/Tooltip/Tooltip?raw';
const Code_TooltipService = getSourceCode(TooltipSnippets, 'TooltipContentProps', 'type');


const paramDescriptionElements: Record<string, React.FC> = {
  // Default params
  'type' : () =>
    <div className='param-item-desc-text'>
      The variant of the input component you're using. The types are text, number, email, password, search, policyNumber, phone, creditCard, and currency.
    </div>,
  'name' : () =>
    <div className='param-item-desc-text'>
      The name of the input. Acts as a key for form data during submissions.
    </div>,
  'label' : () =>
    <div className='param-item-desc-text'>
      The label of the input. 
    </div>,
  'description' : () =>
    <div className='param-item-desc-text'>
      The description for this input element.
    </div>,
  'placeholder' : () =>
    <div className='param-item-desc-text'>
      The input element's placeholder text. Rendered when the input is empty.
    </div>,
  
  'mask' : () =>
    <div className='param-item-desc-text'>
      Adds an input mask to the component. Use the InputMask's prebuilt masks, or a custom one. 
    </div>,
  'disableHookForms' : () =>
    <div className='param-item-desc-text'>
      Whether you want to leverage react-hook-forms, or handle the data using custom state.
    </div>, 
  'onUpdateValue' : () =>
    <div className='param-item-desc-text'>
      An event function that's triggered from onBeforeInput. Allows you to edit the input event payload to adjust the value before onChange is called. 
      NOTE: If you're using an input mask, this is ignored
    </div>, 
  'onTyped' : () =>
    <div className='param-item-desc-text'>
      The routed onChange event function called every time the user stops typing briefly.
    </div>,
  
  'error' : () =>
    <div className='param-item-desc-text'>
      The validation error message for this input.
    </div>,
  'disabled' : () =>
    <div className='param-item-desc-text'>
      Whether the input is disabled.
    </div>,
  'required' : () =>
    <div className='param-item-desc-text'>
      Is this input required during submission?
    </div>,
  'autocomplete' : () =>
    <div className='param-item-desc-text'>
      The autocomplete text for this input.
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
  
  
  'opts' : () =>
    <div className='param-item-desc-text'>
      All the input's variant specific params stashed in a subtable. Select a variant, and they'll be displayed below. 
      Each variant only accepts these specific props to declutter the prop list and intellisense when you're coding.
    </div>,
  
  // Variant params
  'hideIncrementButtons' : () => 
  <div className='param-item-desc-text'>
    Whether to hide the increment and decrement buttons for the number input.
  </div>,
  
  'hideEmailIcon' : () => 
  <div className='param-item-desc-text'>
    Whether you want to hide the email icon for this input.
  </div>,
  'disableEmailFilter' : () => 
  <div className='param-item-desc-text'>
    Filters out all non-valid email characters while the user is typing. If you don't want this behavior, then set this prop to true.
  </div>,
  
  'hideVisibilityIcon' : () => 
  <div className='param-item-desc-text'>
    Whether to add the toggle password visibility icon to the input element.
  </div>,
  
  'sortButton' : () => 
  <div className='param-item-desc-text'>
    Adds sorting functionality to the search results that come from this input
  </div>,
  'sortType' : () => 
  <div className='param-item-desc-text'>
    What kind of sorting functionality do you want for the search?
  </div>,
  
  'hidePolicyNumberIcon' : () => 
  <div className='param-item-desc-text'>
    Disable the policy number icon for this input.
  </div>,
  'disablePolicyMask' : () => 
  <div className='param-item-desc-text'>
    The policy mask can be edited using the mask prop; however, if you prefer not using a mask, or want to use a custom one, then disable the current one with this prop.
  </div>,
  
  'hidePhoneIcon' : () => 
  <div className='param-item-desc-text'>
    Whether to hide the phone icon for this input.
  </div>,
  'disablePhoneMask' : () => 
  <div className='param-item-desc-text'>
    You can edit the phone mask's format using the mask prop, or disable this and use your own custom mask.
  </div>,
  
  'hideCreditCardIcon' : () => 
  <div className='param-item-desc-text'>
    Hides the credit card icon for this input.
  </div>,
  'disableCreditCarkMask' : () => 
  <div className='param-item-desc-text'>
    Whether to disable the credit card mask for this input.
  </div>,
  
  'hideMoneySign' : () => 
  <div className='param-item-desc-text'>
    Hides the money sign on the left hand side of the input.
  </div>,
  'hideCurrencyTypeOpts' : () => 
  <div className='param-item-desc-text'>
    Hides the currency type dropdown for the currency input.
  </div>,
};
