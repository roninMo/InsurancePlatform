// Old input component!

import { Dispatch, MouseEvent, RefObject, SetStateAction, useId, useRef, useState } from 'react';
import { InputMask, useMask } from '@react-input/mask';

import styles from './Input.module.scss';
import styled from '@emotion/styled';
import { Icon } from '../../Common/Icons/Icon';
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';


export type TextInputTypes = 'text' | 'number' | 'email' | 'password' | 'search' | 'policyNumber' | 'phone' | 'creditCard' | 'currency';
export type TextInputAutoCompleteTypes = "email"  | "tel" | "name"  | "password"  | "family-name" | "given-name" | "country-name" | "postal-code" | "street-address" | "address-level1" | "address-level2";

interface InputProps {
  type?: TextInputTypes
  
  name: string;
  label: string;
  description?: string;
  value: string;
  placeholder?: string;

  error?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;
  tooltip?: boolean;
  tooltipText?: string;

  autocomplete?: TextInputAutoCompleteTypes;

  // variant specific configurations
  opts?: {

  };
}


export const Input = ({
  type = 'text', name, label, description, value, placeholder,
  error = false, errorMessage, required = false, disabled = false, tooltip = false, tooltipText,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  autocomplete, opts, ...props
}: InputProps & UniversalEventHandlers) => {
  const id = useId();
  const emailRegexValidation = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`; // TODO: Removed for variation, implement react-hook-forms
  const loadBarRandDelay = Math.floor(Math.random() * (100 - 25 + 1)) + 25; // TODO: visual test, not necessary. This might mess with seeing loading with actual load times

  const getMaskRef = (type: TextInputTypes): RefObject<HTMLInputElement> | undefined => {
    // if (type == 'phone') return phoneMaskRef;
    // if (type == 'creditCard') return creditCardMaskRef;
    // if (type == 'policyNumber') return policyNumberMaskRef;
    return undefined
  }

  // Password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Tooltip logic
  const [tooltipActive, setTooltipActive] = useState<boolean>(false);
  const tooltipCoordinates = useRef<{ x: number, y: number}>({ x: 0, y: 0 });

  const getType = (): TextInputTypes => {
    if (type == 'number') return type;
    if (type == 'password') return showPassword ? 'text' : 'password';
    return 'text';
  }

  // Error handling
  const getError = (): boolean => (error && !disabled);


  return (
    <TextInput className='input'>
      <Label htmlFor={type} className="input-label"> 
        { label } 
      </Label>

      <InputContainer className="input-container group">
        <input 
          type={getType()}
          name={name}
          value={value}
          // ref={getMaskRef(type)} // TODO: add optional input masking
          placeholder={placeholder}
          autoComplete={autocomplete}
          id={id}

          onChange={(e) => onChange ? onChange(e) : null}
          onBlur={(e) => onBlur ? onBlur(e) : null}
          onFocus={(e) => onFocus ? onFocus(e) : null}
          onClick={(e) => onClick ? onClick(e) : null}
          onMouseEnter={(e) => onMouseEnter ? onMouseEnter(e) : null}
          onMouseLeave={(e) => onMouseLeave ? onMouseLeave(e) : null}

          required={required}
          disabled={disabled}

          className={`input-base peer
            ${!(type == 'search' || type == 'text' || type == 'currency') ? 'input-icon-spacing' : ''}
            ${error && !disabled ? 'input-error' : ''}
          `}
          { ...props }
        />

        <PrecedingElements 
          type={type}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <SubsequentElements
          type={type} name={name}
          error={getError()} disabled={disabled}
          tooltip={tooltip} tooltipCoords={tooltipCoordinates}
          tooltipActive={tooltipActive} setTooltipActive={setTooltipActive}
        />
        
        <LoadingBar className='input-loading-bar-cont'>
          <div 
            className={`input-loading-bar ${false ? 'animate-loading-bar opacity-75' : 'opacity-0'} `}
            style={{ animationDelay: `${loadBarRandDelay}ms` }}
          />
        </LoadingBar>
      </InputContainer>

      {/* Error / Description messages */}
      <ErrorAndDescription className='mt-2 ml-1'>
        { getError() && errorMessage ? 
        <p className="error-text">  { errorMessage } </p> : description && 
        <p className="">            { description } </p> }
      </ErrorAndDescription>

      {/* Tooltip Text */}
      <Tooltip 
        style={{ transform: `translate(${tooltipCoordinates.current.x + 8}px, ${tooltipCoordinates.current.y + 12}px)`}}
        className={`input-tooltip ${tooltipCoordinates} ${tooltipActive ? 'input-tooltip-v' : 'input-tooltip-h'}`}
      >
        {tooltipText ? tooltipText : 'Tooltip text...'}
      </Tooltip>

    </TextInput>
  );
}


// Variant elements
interface PrecedingElProps {
  type: TextInputTypes;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
}
export const PrecedingElements: React.FC<PrecedingElProps> = ({ type, showPassword, setShowPassword }) => {
  const toggleShowPassword = (visible: boolean) => setShowPassword(visible);
  const VariantIcon: React.FC | undefined = PrecedingIcons[type] || undefined;
  
  return (
    <div className="input-preceding-el-c">
      <div className='input-preceding-el'>
        {VariantIcon && <VariantIcon />}

        { type == 'password' && 
          <div onClick={() => toggleShowPassword(!showPassword)} className='input-password-vis'>
            { showPassword  &&  <Icon variant='EyeSlash' styles='input-icon-def' /> }
            { !showPassword &&  <Icon variant='Eye' styles='input-icon-def' /> }
          </div>
        }
      </div>
    </div>
  );
}

const PrecedingIcons: Partial<Record<TextInputTypes, React.FC>> = {
  'email':          () => <Icon variant='Envelope'    styles='input-icon-def' />,
  'policyNumber':   () => <Icon variant='Profile'     styles='input-icon-def' />,
  'phone':          () => <Icon variant='Phone'       styles='input-icon-def' />,
  'creditCard':     () => <Icon variant='CreditCard'  styles='input-icon-def' />,
};


interface SubsequentElProps {
  name: string;
  type: TextInputTypes;
  disabled: boolean;
  error: boolean;

  tooltip?: boolean;
  tooltipCoords: RefObject<{ x: number, y: number }>;
  tooltipActive: boolean;
  setTooltipActive: Dispatch<SetStateAction<boolean>>;
}
export const SubsequentElements: React.FC<SubsequentElProps> = ({
  name, type, disabled, error, 
  tooltip, tooltipCoords, setTooltipActive 
}) => {  
  const tooltipMouseEnter = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    // console.log('mouse enter tooltip', {Event: e});
    setTooltipActive(true);
  }
  
  const tooltipMouseLeave = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    // console.log('mouse leave tooltip', {Event: e});
    setTooltipActive(false);
  }

  const toolTipHover = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>): void => {
    const coordinates = { x: e.clientX, y: e.clientY };
    tooltipCoords.current = coordinates;
    // console.log(`mouseCoordinates: `, tooltipCoordinates.current); //  {x: coordinates.x, y: coordinates.y });
  }
  
  return (
    <SubsequentInputElements className={`input-subsequent-el-c`}>
      <div className={`row flex-grow justify-items-end items-center`}>
        {/* Error / Tooltip icon */}
        { error ?
          <Icon variant='Error' styles='mr-3 size-4 error-text' /> 
        : 
          <TooltipIcon 
            onMouseEnter={e => tooltip && tooltipMouseEnter(e)} 
            onMouseOver={e =>  tooltip && toolTipHover(e)} 
            onMouseLeave={e => tooltip && tooltipMouseLeave(e)} 
            className={`cursor-pointer`}
          >
            <Icon variant='InfoBox' styles='mr-3 size-4' /> 
          </TooltipIcon>
        }

        {/* Currency Dropdown */}
        { type == 'currency' && 
          <CurrencySelectContainer className='row relative'>
            <Icon variant='DropdownArrow' styles='size-5 absolute top-[7px] right-[6px]' />
            <CurrencySelect 
              name={`${name}-currencyType`} disabled={disabled}
              className={`input-curr ${error ? 'input-curr-error' : ''}`}
            >
              <option>USD</option> 
              <option>CAD</option> 
              <option>EUR</option>
            </CurrencySelect>
          </CurrencySelectContainer>
        }

        {/* Search Sort Button */}
        { type == 'search' &&
          <SortSearchButton 
            type="button" disabled={disabled} 
            className={`input-sort-btn ${error ? 'input-sort-error' : ''}`}
          >
            <Icon variant='Sort' styles='size-5 text-slate-100 dark:text-slate-400' />
            Sort
          </SortSearchButton>
        }

      </div>
    </SubsequentInputElements>
  );
}

// Component Styles
const TextInput = styled.div``;
const InputContainer = styled.div``;

const SubsequentInputElements = styled.div``;
const Label = styled.label``;
const ErrorAndDescription = styled.div``;

const LoadingBar = styled.div``;
const SortSearchButton = styled.button``;
const CurrencySelectContainer = styled.div``;
const CurrencySelect = styled.select`pointer-events: all;`;

// TODO: this needs to be fixed positioning to handle proper placement with scroll
const Tooltip = styled.div``;
const TooltipIcon = styled.div`pointer-events: all;`;


// #region Input Type Props
type InputPropsPartial = Partial<InputProps> & { type: TextInputTypes } & any;
export const InputProps_Text: InputPropsPartial = {
  type: 'text',
  label: 'Text Input',
}

export const InputProps_Email: InputPropsPartial = {
  type: 'email',
  label: 'Email Input',
  description: 'What is your email address?',
  placeholder: 'yourname@email.com',
  tooltipContent: 'The email used to create your account.',
  autocomplete: 'email',
}

export const InputProps_Password: InputPropsPartial = {
  type: 'password',
  label: 'Password',
  description: 'Create your password.',
  tooltipContent: 'The used for your account.',
  autocomplete: 'password',
}

export const InputProps_Phone: InputPropsPartial = {
  type: 'phone',
  label: 'Phone Input',
  description: 'What is your phone number?',
  tooltipContent: 'Your phone number, including the area code. ex: (000)-000-0000',
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
