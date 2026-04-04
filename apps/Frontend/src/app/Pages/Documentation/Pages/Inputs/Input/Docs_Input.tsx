import { JSX, useDeferredValue, useState } from 'react';
import styled from '@emotion/styled';
import { SubPageLinkProps } from '../../../../../Components/Sidebar/Sidebar';
import { ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ParamItem, ParamTable, ParamTableItem } from '../../../Components/ParamTable/ParamTable';
import { ParamType } from '../../../Components/ParamType/ParamType';
import { getComponentSourceCode } from '../../../../../Components/Utils/GetComponentSourceCode';

import InputCodeSnippets from './Docs_InputJsxComponents?raw';
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
import { ShowcaseExample_StateRef } from '../../../Components/ShowcaseExampleStateRef/ShowcaseExampleStateRef';
import { TextInputTypes } from '@Project/ReactComponents';
import { Dropdown } from '../../../../../Components/Content/Dropdown/Dropdown';


export const Docs_Input = () => {
  //--------------------------------//
  // Tab Functionality              //
  //--------------------------------//
  const [currentTab, setCurrentTab] = useState<TextInputTypes>('text');
  const deferredTab = useDeferredValue(currentTab);
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
  // just render it once instead of 3 on updates - they're static mappings or boolean checks on update
  // const [params, setParams] = useState<string[]>(defaultParams); 
  // const [paramContext, setParamContext] = useState<ParamContext[]>([]);
  const baseParamList: string[] = defaultParams || [];
  const variantParams: string[] = variantParamsList[currentTab] || [];
  const contextParams = paramContextsList[currentTab]; 
  
  // TODO: If this is still causing hiccups, use useDeferredValue
  // const tableParams = [...defaultParams, ...(variantParamsList[deferredTab] || [])];

  // This uses NO extra memory and doesn't trigger secondary renders.
  // const currentVariantParams = variantParamsList[currentTab] || [];
  // const currentContextParams = paramContextsList[currentTab] || [];
  // const allTableParams = [...defaultParams, ...currentVariantParams];

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

  return (
    <Container className='spacing'>
      <h3 className="span-12 p-2">
        Input Component
      </h3>

      <div className='span-12'>
        <p className='p-2 showcase-text'>
          The input component is a custom input component with loads of functionality and customization 
          to fit your needs for the varying form types. It comes with tooltips, 
          loading bars for server side autosaving, event hooks, error handling, and input masking. 
          Each type has varying icons and functionality so you know whether the input is for 
          text, email, phone, policy number, credit, currency, or search.
        </p>
      </div>

      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container'>
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
          <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_CurrencyInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={currencyError} setError={setCurrencyError}
              disabled={currencyDisabled} setDisabled={setCurrencyDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_CurrencyInput error={currencyError} disabled={currencyDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }

        {/* Credit Card */}
        { currentTab == 'creditCard' && 
          <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_CreditCardInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={creditError} setError={setCreditError}
              disabled={creditDisabled} setDisabled={setCreditDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_CreditCardInput error={creditError} disabled={creditDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Phone Number */}
        { currentTab == 'phone' && 
          <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_PhoneInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={phoneError} setError={setPhoneError}
              disabled={phoneDisabled} setDisabled={setPhoneDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_PhoneInput error={phoneError} disabled={phoneDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Policy Number */}
        { currentTab == 'policyNumber' && 
          <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_PolicyNumberInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={policyError} setError={setPolicyError}
              disabled={policyDisabled} setDisabled={setPolicyDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_PolicyNumberInput error={policyError} disabled={policyDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }

        {/* Search */}
        { currentTab == 'search' && 
          <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_SearchInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={searchError} setError={setSearchError}
              disabled={searchDisabled} setDisabled={setSearchDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_SearchInput error={searchError} disabled={searchDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Password */}
        { currentTab == 'password' && 
          <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_PasswordInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={passwordError} setError={setPasswordError}
              disabled={passwordDisabled} setDisabled={setPasswordDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_PasswordInput error={passwordError} disabled={passwordDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Email */}
        { currentTab == 'email' && 
          <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_EmailInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={emailError} setError={setEmailError}
              disabled={emailDisabled} setDisabled={setEmailDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_EmailInput error={emailError} disabled={emailDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Number */}
        { currentTab == 'number' && 
          <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_NumberInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={numberError} setError={setNumberError}
              disabled={numberDisabled} setDisabled={setNumberDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_NumberInput error={numberError} disabled={numberDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
        
        {/* Text Input */}
        { currentTab == 'text' && 
          <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_TextInput")} styles="spacing gap-0 opacity-0 animate-fade-in">
            <ShowcaseExample_StateRef 
              error={textError} setError={setTextError}
              disabled={textDisabled} setDisabled={setTextDisabled}
              elementStateTypes={[]} { ...showCaseElementStyleProps } 
            >
              <Example_TextInput error={textError} disabled={textDisabled} />
            </ShowcaseExample_StateRef>
          </ShowcaseElement>
        }
      </Variants>
      

      {/* <div className='span-12 py-2 pt-10'>
      <Dropdown label='Input Parameters' openByDefault>
        <ParamTable params={ParamTableArgs_Input} additionalStyles='mt-4' />
      </Dropdown>
      </div>


      <div className='span-12 py-2 pt-4'>
      <Dropdown label='Options Parameter Values' openByDefault>
        <p className='p-2 pl-1 showcase-text'>
          The options param has multiple values that are specific to each variant you're using, 
          and focus on customizing the styles, and adding additional contextual functionality for each input type
        </p>
        <ParamTable params={ParamTableArgs_Input} additionalStyles='mt-4' />
      </Dropdown>
      </div> */}
    </Container>
  );
}


// Styled Components
const Container = styled.div``;
const Tabs = styled.div``;
const Variants = styled.div``;

const showCaseElementStyleProps = {
  styles: "p-4 pt-6 pb-2 span-12 lg:span-8",
  stateStyles: "p-4 span-12 lg:span-8 rowStart gap-2"
};

//----------------------------------------------//
// HashLinks                                    //
//----------------------------------------------//
export const DocsPageHashLinks_Input: SubPageLinkProps[] = [

];


//----------------------------------------------//
// Input components param table logic           //
//----------------------------------------------//
interface ParamContext {
  name?: string;
  contextParam?: boolean;
  variantOption?: boolean;
	overwrite?: boolean;
}

// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'type', 'name', 'label', 'description', 'value', 'placeholder', 'id', 
  'spacing', 'error', 'errorMessage', 'disabled', 'required', 
  'spacing', 'tooltip', 'tooltipText', 'autocomplete', 'opts',
];

const variantParamsList: Record<TextInputTypes, string[]> = {
  'text': [],
  'number':       ['incrementButtons'],
  'email':        ['showEmailIcon'],
  'password':     ['passwordVisibility'],
  'search':       ['sortButton', 'sortType'],
  'policyNumber': ['showPolicyNumberIcon', 'policyNumberMask'],
  'phone':        ['showPhoneIcon', 'phoneNumberMask'],
  'creditCard':   ['showCreditCardIcon', 'creditCarkMask'],
  'currency':     ['showMoneySign', 'currencyTypeDropdown'],
}


const paramContextsList: Record<TextInputTypes, ParamContext[]> = {
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
  "email": [
    { name: 'type="email"', 
      contextParam: true,
      variantOption: false,
			overwrite: 'type'
    },
    { name: 'showEmailIcon', 
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
    { name: 'passwordVisibility', 
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
    { name: 'showPolicyNumberIcon', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'policyNumberMask', 
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
    { name: 'showPhoneIcon', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'phoneNumberMask', 
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
    { name: 'showCreditCardIcon', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'creditCarkMask', 
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
    { name: 'showMoneySign', 
      contextParam: false,
      variantOption: true,
    },
    { name: 'currencyTypeDropdown', 
      contextParam: false,
      variantOption: true,
    },
  ],
};


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// If we need types, we could do this for conditional rendering
// const paramDescriptionElements: Record<string, React.FC<DescriptionProps>> = {
//   'type': ({ highlighted }) => (
//     <div className={highlighted ? 'active' : ''}>...</div>
//   ),
// };

const paramTypeElements: Record<string, React.FC> = {
  // Default params
  'type': () => <ParamType type='TextInputTypes' />,
  'name': () => <ParamType type='string' />,
  'label': () => <ParamType type='string' />,
  'description': () => <ParamType type='string' />,
  'value': () => <ParamType type='string' />,
  'placeholder': () => <ParamType type='string' />,
  'id': () => <ParamType type='string' />,
  'error': () => <ParamType type='boolean' />,
  'errorMessage': () => <ParamType type='string' />,
  'disabled': () => <ParamType type='boolean' />,
  'required': () => <ParamType type='boolean' />,
  'tooltip': () => <ParamType type='boolean' />,
  'tooltipText': () => <ParamType type='string' />,
  'autocomplete': () => <ParamType type='TextInputAutoCompleteTypes' />,
  'opts': () => <ParamType type='any' />,

  // Variant params
  'incrementButtons': () => <ParamType type='boolean' />,
  'showEmailIcon': () => <ParamType type='boolean' />,
  'passwordVisibility': () => <ParamType type='boolean' />,

  'sortButton': () => <ParamType type='boolean' />,
  'sortType': () => <ParamType type='InputSortType' />,
  
  'showPolicyNumberIcon': () => <ParamType type='boolean' />,
  'policyNumberMask': () => <ParamType type='RefObject' />,

  'showPhoneIcon': () => <ParamType type='boolean' />,
  'phoneNumberMask': () => <ParamType type='RefObject' />,
  
  'showCreditCardIcon': () => <ParamType type='boolean' />,
  'creditCarkMask': () => <ParamType type='RefObject' />,

  'showMoneySign': () => <ParamType type='boolean' />,
  'currencyTypeDropdown': () => <ParamType type='boolean' />,
};

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

  'value' : () =>
    <div className='param-item-desc-text'>
      The value of the input. Use your own state management for handling editing this value.
    </div>,

  'placeholder' : () =>
    <div className='param-item-desc-text'>
      The input element's placeholder text. Rendered when the input is empty.
    </div>,

  'id' : () =>
    <div className='param-item-desc-text'>
      The id of the native input element. 
    </div>,

  'error' : () =>
    <div className='param-item-desc-text'>
      Whether there's validation errors for this input.
    </div>,

  'errorMessage' : () =>
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

  'tooltip' : () =>
    <div className='param-item-desc-text'>
      Should this component have a tooltip?
    </div>,

  'tooltipText' : () =>
    <div className='param-item-desc-text'>
      The tooltip text.
    </div>,

  'autocomplete' : () =>
    <div className='param-item-desc-text'>
      The autocomplete text for this input.
    </div>,

  'opts' : () =>
    <div className='param-item-desc-text'>
      An object containing variant specific customization and functions.
    </div>,

  // Variant params
  'incrementButtons' : () => 
  <div className='param-item-desc-text'>
    Whether to enable the increment and decrement buttons for the number input
  </div>,

  'showEmailIcon' : () => 
  <div className='param-item-desc-text'>
    Do you want an email icon on the left hand side of the input?
  </div>,

  'passwordVisibility' : () => 
  <div className='param-item-desc-text'>
    Whether to add the toggle password visibility icon to the input element.
  </div>,

  'sortButton' : () => 
  <div className='param-item-desc-text'>
    Adds sorting functionality to the search results that come from this input
  </div>,

  'sortType' : () => 
  <div className='param-item-desc-text'>
    What kind of sorting functionality do you want?
  </div>,

  'showPolicyNumberIcon' : () => 
  <div className='param-item-desc-text'>
    Do you want the policy number icon on the left hand side of the input?
  </div>,

  'policyNumberMask' : () => 
  <div className='param-item-desc-text'>
    Adds an input mask for your policy number input.
  </div>,

  'showPhoneIcon' : () => 
  <div className='param-item-desc-text'>
    Do you want a phone icon on the left hand side of the input?
  </div>,

  'phoneNumberMask' : () => 
  <div className='param-item-desc-text'>
    Adds an input mask for your phone number.
  </div>,

  'showCreditCardIcon' : () => 
  <div className='param-item-desc-text'>
    Do you want a credit card icon on the left hand side of the input?
  </div>,

  'creditCarkMask' : () => 
  <div className='param-item-desc-text'>
    Adds an input mask for your credit card.
  </div>,

  'showMoneySign' : () => 
  <div className='param-item-desc-text'>
    Do you want a money sign on the left hand side of the input?
  </div>,

  'currencyTypeDropdown' : () => 
  <div className='param-item-desc-text'>
    Adds a currency type select to the input, changing the money sign for this element.
  </div>,
};



// Note, this only works because these values are NOT using state params, preventing unnecessary overhead with state
const ParamTableArgs_Input: (ParamItem | 'spacing')[] = [
  { name: 'type', 
    type: <ParamType type='TextInputTypes' />,
    description:  
    <div className='param-item-desc-text'>
      The variant of the input component you're using. The types are text, number, email, password, search, policyNumber, phone, creditCard, and currency.
    </div>
  },
  { name: 'name', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The name of the input. Acts as a key for form data during submissions.
    </div>
  },
  { name: 'label', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The label of the input. 
    </div>
  },
  { name: 'description', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The description for this input element.
    </div>
  },
  { name: 'value', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The value of the input. Use your own state management for handling editing this value.
    </div>
  },
  { name: 'placeholder', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The input element's placeholder text. Rendered when the input is empty.
    </div>
  },
  { name: 'id', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The id of the native input element. 
    </div>
  },
  'spacing',
  
  { name: 'error', 
    type: <ParamType type='boolean' />,
    description:  
    <div className='param-item-desc-text'>
      Whether there's validation errors for this input.
    </div>
  },
  { name: 'errorMessage', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The validation error message for this input.
    </div>
  },
  { name: 'disabled', 
    type: <ParamType type='boolean' />,
    description:  
    <div className='param-item-desc-text'>
      Whether the input is disabled.
    </div>
  },
  { name: 'required', 
    type: <ParamType type='boolean' />,
    description:  
    <div className='param-item-desc-text'>
      Is this input required during submission?
    </div>
  },
  'spacing',
  
  { name: 'tooltip', 
    type: <ParamType type='boolean' />,
    description:  
    <div className='param-item-desc-text'>
      Should this component have a tooltip?
    </div>
  },
  { name: 'tooltipText', 
    type: <ParamType type='string' />,
    description:  
    <div className='param-item-desc-text'>
      The tooltip text.
    </div>
  },
  
  { name: 'autocomplete', 
    type: <ParamType type='TextInputAutoCompleteTypes' />,
    description:  
    <div className='param-item-desc-text'>
      The autocomplete text for this input.
    </div>
  },
];
