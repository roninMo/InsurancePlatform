import { Dispatch, ReactNode, SetStateAction, useId, useState } from 'react';
import styled from '@emotion/styled';
import { SubPageLinkProps } from '../../../../../Components/Sidebar/Sidebar';
import { ShowcaseElement } from '../../../Components/ShowcaseElement/ShowcaseElement';
import { ParamItem, ParamTable } from '../../../Components/ParamTable/ParamTable';
import { ElementState, ElementStateTypes } from '../../../Components/ShowcaseElement/ElementStates/ElementState';
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


export const Docs_Input = () => {
  const [currentTab, setCurrentTab] = useState<TextInputTypes>('text');
  const tabs: TextInputTypes[] = ['text', 'number', 'email', 'password', 'search', 'policyNumber', 'phone', 'creditCard', 'currency'];
  const tabLabels: string[] = ['Text', 'Number', 'Email', 'Password', 'Search', 'Policy Number', 'Phone', 'Credit Card', 'Currency'];

  const showTabContent = (tab: TextInputTypes) => tab == currentTab ? 'grid-rows-[1fr] order-[-1]' : 'grid-rows-[0fr] opacity-0';
  const tabStyles = (tab: TextInputTypes) => `tab-default text-base ${tab == currentTab ? 'tab-active' : ''}`;
  
  const onClickTab = (tab: TextInputTypes) => {
    setCurrentTab(tab);
  }

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

  const universalProps = {
    styles: "p-4 pt-6 pb-2 span-12 lg:span-8",
    stateStyles: "p-4 span-12 lg:span-8 rowStart gap-2"
  };

  return (
    <Container className='spacing'>
      <h3 className="span-12 py-2">
        Input Component
      </h3>

      <div className='span-12'>
        <p className='py-2 showcase-text'>The input component is a custom input component with loads of functionality and customization 
          to fit your needs for the varying form types. It comes with tooltips, 
          loading bars for server side autosaving, event hooks, error handling, and input masking. 
          Each type has varying icons and functionality so you know whether the input is for 
          text, email, phone, policy number, credit, currency, or search.
        </p>
      </div>

      {/* Showcase Input Element Variants */}
      <Tabs className='span-12 px-4 tab-container'>
        { tabs.map((tab: TextInputTypes, index: number) => 
          <div onClick={() => onClickTab(tab)} className={tabStyles(tab)} >
            {/* { tab && tab.charAt(0) ? tab.charAt(0).toUpperCase() + tab.slice(1) : ''} */}
            { tabLabels[index] }
          </div>
        )}
      </Tabs>
      
      {/* Variants */}
      <Variants className='span-12 py-2'>
        {/* Currency */}
        <div className={`height-trans ${showTabContent('currency')}`}>
          <div className={`height-trans-content`}>
            <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_CurrencyInput")} styles="spacing gap-0">
              <ShowcaseExample_StateRef 
                error={currencyError} setError={setCurrencyError}
                disabled={currencyDisabled} setDisabled={setCurrencyDisabled}
                elementStateTypes={[]} { ...universalProps } 
              >
                <Example_CurrencyInput error={currencyError} disabled={currencyDisabled} />
              </ShowcaseExample_StateRef>
            </ShowcaseElement>
          </div>
        </div>

        {/* Credit Card */}
        <div className={`height-trans ${showTabContent('creditCard')}`}>
          <div className={`height-trans-content`}>
            <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_CreditCardInput")} styles="spacing gap-0">
              <ShowcaseExample_StateRef 
                error={creditError} setError={setCreditError}
                disabled={creditDisabled} setDisabled={setCreditDisabled}
                elementStateTypes={[]} { ...universalProps } 
              >
                <Example_CreditCardInput error={creditError} disabled={creditDisabled} />
              </ShowcaseExample_StateRef>
            </ShowcaseElement>
          </div>
        </div>
        
        {/* Phone Number */}
        <div className={`height-trans ${showTabContent('phone')}`}>
          <div className={`height-trans-content`}>
            <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_PhoneInput")} styles="spacing gap-0">
              <ShowcaseExample_StateRef 
                error={phoneError} setError={setPhoneError}
                disabled={phoneDisabled} setDisabled={setPhoneDisabled}
                elementStateTypes={[]} { ...universalProps } 
              >
                <Example_PhoneInput error={phoneError} disabled={phoneDisabled} />
              </ShowcaseExample_StateRef>
            </ShowcaseElement>
          </div>
        </div>
        
        {/* Policy Number */}
        <div className={`height-trans ${showTabContent('policyNumber')}`}>
          <div className={`height-trans-content`}>
            <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_PolicyNumberInput")} styles="spacing gap-0">
              <ShowcaseExample_StateRef 
                error={policyError} setError={setPolicyError}
                disabled={policyDisabled} setDisabled={setPolicyDisabled}
                elementStateTypes={[]} { ...universalProps } 
              >
                <Example_PolicyNumberInput error={policyError} disabled={policyDisabled} />
              </ShowcaseExample_StateRef>
            </ShowcaseElement>
          </div>
        </div>

        {/* Search */}
        <div className={`height-trans ${showTabContent('search')}`}>
          <div className={`height-trans-content`}>
            <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_SearchInput")} styles="spacing gap-0">
              <ShowcaseExample_StateRef 
                error={searchError} setError={setSearchError}
                disabled={searchDisabled} setDisabled={setSearchDisabled}
                elementStateTypes={[]} { ...universalProps } 
              >
                <Example_SearchInput error={searchError} disabled={searchDisabled} />
              </ShowcaseExample_StateRef>
            </ShowcaseElement>
          </div>
        </div>
        
        {/* Password */}
        <div className={`height-trans ${showTabContent('password')}`}>
          <div className={`height-trans-content`}>
            <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_PasswordInput")} styles="spacing gap-0">
              <ShowcaseExample_StateRef 
                error={passwordError} setError={setPasswordError}
                disabled={passwordDisabled} setDisabled={setPasswordDisabled}
                elementStateTypes={[]} { ...universalProps } 
              >
                <Example_PasswordInput error={passwordError} disabled={passwordDisabled} />
              </ShowcaseExample_StateRef>
            </ShowcaseElement>
          </div>
        </div>
        
        {/* Email */}
        <div className={`height-trans ${showTabContent('email')}`}>
          <div className={`height-trans-content`}>
            <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_EmailInput")} styles="spacing gap-0">
              <ShowcaseExample_StateRef 
                error={emailError} setError={setEmailError}
                disabled={emailDisabled} setDisabled={setEmailDisabled}
                elementStateTypes={[]} { ...universalProps } 
              >
                <Example_EmailInput error={emailError} disabled={emailDisabled} />
              </ShowcaseExample_StateRef>
            </ShowcaseElement>
          </div>
        </div>
        
        {/* Number */}
        <div className={`height-trans ${showTabContent('number')}`}>
          <div className={`height-trans-content`}>
            <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_NumberInput")} styles="spacing gap-0">
              <ShowcaseExample_StateRef 
                error={numberError} setError={setNumberError}
                disabled={numberDisabled} setDisabled={setNumberDisabled}
                elementStateTypes={[]} { ...universalProps } 
              >
                <Example_NumberInput error={numberError} disabled={numberDisabled} />
              </ShowcaseExample_StateRef>
            </ShowcaseElement>
          </div>
        </div>
        
        {/* Text Input */}
        <div className={`height-trans ${showTabContent('text')}`}>
          <div className={`height-trans-content`}>
            <ShowcaseElement jsx={getComponentSourceCode(InputCodeSnippets, "Example_TextInput")} styles="spacing gap-0">
              <ShowcaseExample_StateRef 
                error={textError} setError={setTextError}
                disabled={textDisabled} setDisabled={setTextDisabled}
                elementStateTypes={[]} { ...universalProps } 
              >
                <Example_TextInput error={textError} disabled={textDisabled} />
              </ShowcaseExample_StateRef>
            </ShowcaseElement>
          </div>
        </div>
      </Variants>
      
      <h3 className="span-12 py-2 pt-8">
        Input Parameters
      </h3>
      <div className='span-12 py-2'>
        <ParamTable params={ParamTableArgs_Input} />
      </div>
    </Container>
  );
}


// Styled Components
const Container = styled.div``;
const Tabs = styled.div``;
const Variants = styled.div``;


//----------------------------------------------//
// HashLinks                                    //
//----------------------------------------------//
export const DocsPageHashLinks_Input: SubPageLinkProps[] = [

];


//----------------------------------------------//
// Input components param table rendered props  //
//----------------------------------------------//
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

const ParamTableArgs_EmailInputContext: (Partial<ParamItem>)[] = [
  { name: 'type', 
    contextParam: true,
    variantOption: false,
  },
  { name: 'options.showEmailIcon', 
    contextParam: false,
    variantOption: true,
  },
  // Email - show EmailIcon
  // Password - show password visibility icon
  // Search - enable sortButton, sortType
  // PolicyNumber - showPolicyNumberIcon, "policyNumberMask"
  // Phone - show PhoneIcon, "phoneNumberMask"
  // CreditCard - showCreditCardIcon, "creditCardMask"
  // Currency - ShowMoneySign, enable CurrencyType button
];
