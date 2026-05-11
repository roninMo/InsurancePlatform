import { ChangeEvent, Dispatch, RefObject, SetStateAction, useRef, useState } from 'react';
import { InputMask, useMask } from '@react-input/mask';
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';
import { TooltipContextActions } from '../../Common/Utilities/Tooltip/TooltipProvider/TooltipProvider';
import { TooltipContentProps } from '../../Common/Utilities/Tooltip/Tooltip';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';
import { Icon } from '../../Common/Icons/Icon';
import { Button } from '../Button/Button';

import styled from '@emotion/styled';
import styles from './Input.module.scss';


export type TextInputTypes = 'text' | 'number' | 'email' | 'password' | 'search' 
                          |  'policyNumber' | 'phone' | 'creditCard' | 'currency';

export type TextInputAutoCompleteTypes = 
  | "name" | "given-name" | "family-name" | "email" | "password" | "tel" 
  | "street-address" | "address-level2"| "address-level1" | "postal-code" | "country-name";

export type InputProps = ConditionalVariantProps & {
  /** The variant of input we're using. Each has different functionality for each input type. */
  type?: TextInputTypes
  name: string;
  
  label: string;
  description?: string;
  placeholder?: string;
  value: string;

  error?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;

  tooltipContext?: TooltipContextActions;
  tooltipContent?: TooltipContentProps;
  autocomplete?: TextInputAutoCompleteTypes;

  /* Variant Specific - ConditionalVariantProps */
  // hideIncrementButtons?: boolean;
  // hideEmailIcon?: boolean;
  // hideVisibilityIcon?: boolean;
  // sortButton?: boolean;
  // sortType?: SortType;
  // hidePolicyNumberIcon?: boolean;
  // policyNumberMask?: RefObject<any>;
  // hidePhoneIcon?: boolean;
  // phoneNumberMask?: RefObject<any>;
  // hideCreditCardIcon?: boolean;
  // creditCardMask?: RefObject<any>;
  // hideMoneySign?: boolean;
  // hideCurrencyType?: boolean;
}

// #region conditional variant props 
type NumberVariantProps = 
| { 
    /** An input that's oriented for using number specific values. */
    type?: 'number';
    /** Whether to disable the number input's incremental buttons.  */
    hideIncrementButtons?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'number'>; 
    /** @deprecated CANNOT use 'hideIncrementButtons' when 'type' isn't number. */
    hideIncrementButtons?: never; 
  };

type EmailVariantProps = 
| { 
    /** The variant specific for handling emails. Visually for emails; however, we opted to using rhf's validation for handling email. */
    type?: 'email';
    /** Whether to hide this variant's email icon.  */
    hideEmailIcon?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'email'>; 
    /** @deprecated CANNOT use 'hideEmailIcon' when 'type' isn't email. */
    hideEmailIcon?: never; 
  };

type PasswordVariantProps = 
| { 
    /** The password variant. Hides the input value, and adds an icon to show/hide the input value */
    type?: 'password';
    /** Whether to hide this variant's visibility icon.  */
    hideVisibilityIcon?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'password'>; 
    /** @deprecated CANNOT use 'hideVisibilityIcon' when 'type' isn't     type?: Exclude<TextInputTypes, 'password'>; 
. */
    hideVisibilityIcon?: never; 
  };

type SearchVariantProps = 
| { 
    /** The search variant. Adds a dropdown for search results, and optional sorting. */
    type?: 'search';
    /** Whether to add a sort button for the rendered search results.  */
    sortButton?: boolean;
    /** The sorting type for the search results.  */
    sortType?: SearchSortType;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'search'>; 
    /** @deprecated CANNOT use 'sortButton' when 'type' isn't search. */
    sortButton?: never; 
    /** @deprecated CANNOT use 'sortType' when 'type' isn't search. */
    sortType?: never;
  };

type PolicyNumberVariantProps = 
| { 
    /** The policy number variant. Has an input mask for the format, and an optional icon. */
    type?: 'policyNumber';
    /** Whether to hide the policy number icon for the input.  */
    hidePolicyNumberIcon?: boolean;
    /** The policy number format we're using.  */
    policyNumberMask?: RefObject<any>;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'policyNumber'>; 
    /** @deprecated CANNOT use 'hidePolicyNumberIcon' when 'type' isn't policyNumber. */
    hidePolicyNumberIcon?: never; 
    /** @deprecated CANNOT use 'policyNumberMask' when 'type' isn't policyNumber. */
    policyNumberMask?: never;
  };


type PhoneVariantProps = 
| { 
    /** The phone variant. Has an input mask for the format, and an optional phone icon. */
    type?: 'phone';
    /** Whether to hide the phone icon for the input.  */
    hidePhoneIcon?: boolean;
    /** The phone number format we're using.  */
    phoneNumberMask?: RefObject<any>;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'phone'>; 
    /** @deprecated CANNOT use 'hidePhoneIcon' when 'type' isn't phone. */
    hidePhoneIcon?: never; 
    /** @deprecated CANNOT use 'phoneNumberMask' when 'type' isn't phone. */
    phoneNumberMask?: never;
  };

type CreditCardVariantProps = 
| { 
    /** The credit card variant. Has an input mask for the format, and an optional icon. */
    type?: 'creditCard';
    /** Whether to hide the credit card icon for the input.  */
    hideCreditCardIcon?: boolean;
    /** The credit card number's format we're using.  */
    creditCardMask?: RefObject<any>;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'creditCard'>; 
    /** @deprecated CANNOT use 'hideCreditCardIcon' when 'type' isn't creditCard. */
    hideCreditCardIcon?: never; 
    /** @deprecated CANNOT use 'creditCardMask' when 'type' isn't creditCard. */
    creditCardMask?: never;
  };

type CurrencyVariantProps = 
| { 
    /** The credit card variant. Has an input mask for the format, and an optional icon. */
    type?: 'currency';
    /** Whether to hide the money sign before the value.  */
    hideMoneySign?: boolean;
    /** an optional currency type dropdown built into the input.  */
    hideCurrencyType?: boolean;
  } 
| { 
    /** The variant of input we're using. Each has different functionality for each input type. */
    type?: Exclude<TextInputTypes, 'currency'>; 
    /** @deprecated CANNOT use 'hideMoneySign' when 'type' isn't currency. */
    hideMoneySign?: never; 
    /** @deprecated CANNOT use 'hideCurrencyType' when 'type' isn't currency. */
    hideCurrencyType?: never;
  };

/** The conditional props for each of the variants, only valid and shown when the specific variant is select. */
export type ConditionalVariantProps = 
|  NumberVariantProps
|  EmailVariantProps
|  PasswordVariantProps
|  SearchVariantProps
|  PolicyNumberVariantProps
|  PhoneVariantProps
|  CreditCardVariantProps
|  CurrencyVariantProps;


// Retrieve the keys from a conditional map, and then type them to extract from a destructured object
// This flattens the conditions into a single object where every property is optional, regardless of whether it was 'never'.
type AllKeys<T> = T extends any ? keyof T : never;
// type AllVariantProps = Partial<Record<AllKeys<ConditionalVariantProps>, any>>;

/** Look up a key's type across a union, ignoring 'never' */
type PickType<T, K extends PropertyKey> = T extends any 
  ? (K extends keyof T ? (T[K] extends never ? never : T[K]) : never) 
  : never;

/** The final flattened type for internal destructuring */
type AllVariantProps<T> = {
  [K in AllKeys<T>]?: PickType<T, K>;
};
// #endregion



export const Input = (props: InputProps & UniversalEventHandlers) => {
  // Base Props
  const  {
    type = 'text', name, 
    label, description, placeholder, value, 
    
    error, errorMessage, 
    disabled = false, required = false, 
    
    tooltipContext, tooltipContent,
    autocomplete, 
    
    onChange, 
    onBlur, onFocus, onClick, 
    onMouseEnter, onMouseLeave
  } = props;

  // Variant Specific conditionally rendered props
  const {
    hideIncrementButtons, 
    hideEmailIcon, 
    hideVisibilityIcon, 
    sortButton, sortType, 
    hidePolicyNumberIcon, policyNumberMask, 
    hidePhoneIcon, phoneNumberMask, 
    hideCreditCardIcon, creditCardMask, 
    hideMoneySign, hideCurrencyType
  } = props as AllVariantProps<ConditionalVariantProps>;

  // Other
  const emailRegexValidation = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`; // TODO: Removed for variation, implement react-hook-forms
  const loadBarRandDelay = Math.floor(Math.random() * (100 - 25 + 1)) + 25; // TODO: visual test, not necessary. This could mess with seeing loading with actual load times

  // TODO: when we use rhf, find a mask that works well with controlled components, or create our own
  const getMaskRef = (type: TextInputTypes): RefObject<HTMLInputElement> | undefined => {
    // if (type == 'phone') return phoneMaskRef;
    return undefined;
  }

  // Password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const getType = (): TextInputTypes => {
    if (type == 'number' || type == 'currency') return 'number';
    if (type == 'password') return showPassword ? 'text' : 'password';
    return 'text';
  }


  // State handling
  const currentValue = useRef<number | undefined>(undefined);
  const updateValue = (e: ChangeEvent<HTMLInputElement>) => {
    // handled by user
    if (onChange) onChange(e);
    
    // increment button value ref (capture the current value for the increment click events)
    if (type == 'number') {
      const newValue = e?.target?.value;
      const num = Number(newValue);
      const isNumber = newValue.trim() !== '' && Number.isFinite(num);
      if (isNumber) currentValue.current = num;
      else currentValue.current = undefined;
    }
  }

  // Error handling
  const getError = (): boolean => (!!error && !disabled);


  return (
    <TextInput className='input'>
      <Label htmlFor={type} className="input-label"> 
        { label } 
      </Label>

      <InputContainer className="input-container group">
        <input 
          // { ...props }
          type={getType()}
          name={name} id={`${name}-${type}`}
          // ref={getMaskRef(type)} // TODO: add optional input masking
          
          placeholder={placeholder}
          value={value}
          autoComplete={autocomplete}
          required={required} 
          disabled={disabled}

          onChange={updateValue}
          onFocus={ (e) => onFocus && onFocus(e)}
          onBlur={  (e) => onBlur && onBlur(e)}
          onClick={ (e) => onClick && onClick(e)}
          onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
          onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}

          className={`input-base peer
            ${!inputTypesWithoutIcons.includes(type) ? 'input-icon-spacing' : ''}
            ${getError() ? 'input-error' : ''}
          `}
        />

        {/* Variant specific elements before and after the input element */}
        <PrecedingElements 
          type={type}
          showPassword={showPassword} setShowPassword={setShowPassword}
          hideEmailIcon={hideEmailIcon} hideVisibilityIcon={hideVisibilityIcon} hidePolicyNumberIcon={hidePolicyNumberIcon}
          hidePhoneIcon={hidePhoneIcon} hideCreditCardIcon={hideCreditCardIcon} hideMoneySign={hideMoneySign}
        />

        <SubsequentElements
          type={type} name={name}
          disabled={disabled} error={getError()} 

          tooltipContent={tooltipContent} tooltipContext={tooltipContext}
          
          hideIncrementButtons={hideIncrementButtons}
          incrementValue={updateValue} currentValRef={currentValue}
          
          sortButton={sortButton} sortType={sortType}
          hideCurrencyType={hideCurrencyType}
        />
        
        <LoadingBar className='input-loading-bar-cont'>
          <div 
            className={`input-loading-bar ${false ? 'animate-loading-bar opacity-75' : 'opacity-0'} `}
            style={{ animationDelay: `${loadBarRandDelay}ms` }}
          />
        </LoadingBar>
      </InputContainer>

      {/* Error / Description messages */}
      <ErrorAndDesc show={!!description || getError()} styles='mt-2 ml-1' cStyles={(getError() && errorMessage) ? 'error-text' : 'text-colors'}>
        { (getError() && errorMessage) ? errorMessage : description } &nbsp;
      </ErrorAndDesc>
    </TextInput>
  );
}




//------------------------------------------//
// Preceding Variant Elements               //
//------------------------------------------//
interface PrecedingElProps {
  type: TextInputTypes;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  
  /* Variant Specific */
  hideEmailIcon?: boolean;
  hideVisibilityIcon?: boolean;
  hidePolicyNumberIcon?: boolean;
  hidePhoneIcon?: boolean;
  hideCreditCardIcon?: boolean;
  hideMoneySign?: boolean;
}
export const PrecedingElements: React.FC<PrecedingElProps> = ({ 
  type, showPassword, setShowPassword, 
  hideEmailIcon, hideVisibilityIcon, hidePolicyNumberIcon, 
  hidePhoneIcon, hideCreditCardIcon, hideMoneySign
}) => {
  const toggleShowPassword = (visible: boolean) => setShowPassword(visible);
  const showVariantIcon = !hideEmailIcon || !hideVisibilityIcon || // TODO: Do we want to simplify the prop passed here?
    !hidePolicyNumberIcon || !hidePhoneIcon || !hideCreditCardIcon || !hideMoneySign;
  const VariantIcon: React.FC | undefined = showVariantIcon ? PrecedingIcons[type] || undefined : undefined;
  
  return (
    <VariantIcons className="input-preceding-el-c">
      <div className='input-preceding-el'>
        {VariantIcon && <VariantIcon />}

        { (type == 'password' && !hideVisibilityIcon) && 
          <div onClick={() => toggleShowPassword(!showPassword)} className='input-password-vis'>
            { showPassword  &&  <Icon variant='EyeSlash' styles='input-icon-def' /> }
            { !showPassword &&  <Icon variant='Eye' styles='input-icon-def' /> }
          </div>
        }
      </div>
    </VariantIcons>
  );
}

const inputTypesWithoutIcons = ['search', 'text', 'currency', 'number'];
const PrecedingIcons: Partial<Record<TextInputTypes, React.FC>> = {
  'email': () => <Icon variant='Envelope'         styles='input-icon-def' />,
  'policyNumber': () => <Icon variant='Profile'   styles='input-icon-def' />,
  'phone': () => <Icon variant='Phone'            styles='input-icon-def' />,
  'creditCard': () => <Icon variant='CreditCard'  styles='input-icon-def' />,
};




//------------------------------------------//
// Subsequent Variant Elements              //
//------------------------------------------//
interface SubsequentElProps {
  name: string;
  type: TextInputTypes;
  
  disabled: boolean;
  error: boolean;

  tooltipContent?: TooltipContentProps;
  tooltipContext?: TooltipContextActions;
  
  // Variant specific
  hideIncrementButtons?: boolean;
  incrementValue: (e: ChangeEvent<HTMLInputElement>) => void;
  currentValRef: RefObject<number | undefined>;

  sortButton?: boolean;
  sortType?: SearchSortType;
  hideCurrencyType?: boolean;
}
export const SubsequentElements: React.FC<SubsequentElProps> = ({
  name, type, disabled, error, 
  tooltipContext, tooltipContent, 
  hideIncrementButtons, incrementValue, currentValRef,
  sortButton, sortType,
  hideCurrencyType
}) => {
  const { show, hide } = tooltipContext || {};

  const onPressIncrementButtons = (add: boolean) => {
    if (currentValRef.current === undefined) return;

    const currentValue = currentValRef.current + (add ? 1 : -1);
    incrementValue({ target: { value: `${currentValue}`} } as any);
  }
  
  return (
    <div className="input-subsequent-el-c">
      <div className="input-subsequent-el">

        {/* Error / Tooltip icon */}
        <ErrorAndTooltipIcon className="input-tooltip-icon"
          onMouseEnter={() => tooltipContent && show?.(tooltipContent)} 
          onMouseLeave={() => hide?.()} 
        >
          { error ? <Icon variant='OutlineWarning' styles='mr-2.5 input-sub-icon i-err-color' /> 
          :         <Icon variant='OutlineInfo' styles='mr-2.5 input-sub-icon' /> }
        </ErrorAndTooltipIcon>

        {/* Increment buttons - type="number" */}
        { (type == 'number' && !hideIncrementButtons) && 
          <div className={`increment-btns ${!disabled && !error ? 'increment-btns-states' : error ? 'input-btns-error' : ''}`}>
            <Button 
              onClick={() => onPressIncrementButtons(true)}
              icon='ChevronUp' iconStyles='input-inc-i' disabled={disabled} 
              color='gray' additionalStyles='inc-btn-base input-inc-btn-t' 
            />
            <Button 
              onClick={() => onPressIncrementButtons(false)}
              icon='ChevronDown' iconStyles='input-inc-i' disabled={disabled} 
              color='gray' additionalStyles='inc-btn-base input-inc-btn-b' 
            />
          </div>
        }

        {/* Currency Dropdown - type="currency" */}
        { (type == 'currency' && !hideCurrencyType) && 
          <CurrencySelectContainer className='row relative'>
            <Icon variant='DropdownArrow' styles='input-curr-i' />
            <CurrencySelect 
              name={`${name}-currencyType`} disabled={disabled}
              className={`input-curr ${error ? 'input-curr-error' : ''}`}
            >
              <option value="USD">USD</option> 
              <option value="CAD">CAD</option> 
              <option value="EUR">EUR</option>
              <option value="YEN">YEN</option>
            </CurrencySelect>
          </CurrencySelectContainer>
        }

        {/* Search Sort Button - type="search" */}
        { type == 'search' &&
          <SortSearchButton 
            type="button" disabled={disabled} 
            className={`input-sort-btn ${error ? 'input-sort-error' : ''}`}
          >
            <Icon variant='Sort' styles='input-sort-i' />
            Sort
          </SortSearchButton>
        }

      </div>
    </div>
  );
}


// Component Styles
const Label = styled.label``;
const TextInput = styled.div``;
const InputContainer = styled.div``;
const ErrorAndDesc = styled(Ht)``;

const VariantIcons = styled.div``;
const ErrorAndTooltipIcon = styled.div``;
const LoadingBar = styled.div``;
const SortSearchButton = styled.button``;
const CurrencySelectContainer = styled.div``;
const CurrencySelect = styled.select``;


export type SearchSortType = 'alphabetical' | 'numerical' | ((a: any, b: any) => void);


// #region Input Type Props
type InputPropsPartial = Partial<InputProps> & { type: TextInputTypes } & any;
export const InputProps_Text: InputPropsPartial = {
  type: 'text',
  name: 'text',
}

export const InputProps_Email: InputPropsPartial = {
  type: 'email',
  name: 'email',
  label: 'Email',
  description: 'What is your email address?',
  placeholder: 'yourname@email.com',
  tooltipContent: { text: 'The email used to create your account.' },
  autocomplete: 'email',
}

export const InputProps_Password: InputPropsPartial = {
  type: 'password',
  name: 'password',
  label: 'Password',
  description: 'Create your password.',
  tooltipContent: { text: 'The used for your account.' },
  autocomplete: 'password',
}

export const InputProps_Phone: InputPropsPartial = {
  type: 'phone',
  name: 'phone',
  label: 'Phone',
  description: 'What is your phone number?',
  tooltipContent: { text: 'Your phone number, including the area code. ex: (000)-000-0000' },
  autocomplete: 'tel',
}
// #endregion

/* Input masks
  const rawMaskValue = value.replace(/\D/g, ''); // To retrieve raw mask values
  let phoneMaskRef: RefObject<HTMLInputElement> = useMask({
    mask: '(___) ___-____', // '+0 (___) ___-____'
    replacement: { _: /\d/ },
  });

  let creditCardMaskRef: RefObject<HTMLInputElement> = useMask({
    mask: '____ ____ ____ ____',
    replacement: { _: /\d/ },
  });

  let policyNumberMaskRef: RefObject<HTMLInputElement> = useMask({
    mask: '_________',
    replacement: { _: /\d/ },
  });
*/

/* Placeholder ideas
  // placeholder logic
  if (type == 'currency') {
    const currencyType = '$';
    if (placeholder == '') placeholder = `${currencyType} 0.00`;
  }

  else if (type == 'policyNumber') {
    if (placeholder == '') {
      // if (isAutoPolicy) placeholder = '000000000';
      // if (isHomePolicy) placeholder = 'B000A000A000A';
      placeholder = '000000000';
    }
  } 
*/
