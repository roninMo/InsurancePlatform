import { MouseEvent, RefObject, useId, useRef, useState } from 'react';
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
  
  // #region Input Masking
  // const rawMaskValue = value.replace(/\D/g, ''); // To retrieve raw mask values
  // let phoneMaskRef: RefObject<HTMLInputElement> = useMask({
  //   mask: '(___) ___-____', // '+0 (___) ___-____'
  //   replacement: { _: /\d/ },
  // });
  
  // let creditCardMaskRef: RefObject<HTMLInputElement> = useMask({
  //   mask: '____ ____ ____ ____',
  //   replacement: { _: /\d/ },
  // });
  
  // let policyNumberMaskRef: RefObject<HTMLInputElement> = useMask({
  //   mask: '_________',
  //   replacement: { _: /\d/ },
  // });

  const getMaskRef = (type: TextInputTypes): RefObject<HTMLInputElement> | undefined => {
    // TODO: prevent errors when maskRef tries to validate other masks if the input type was changed during runtime
    // if (type == 'phone') return phoneMaskRef;
    // if (type == 'creditCard') return creditCardMaskRef;
    // if (type == 'policyNumber') return policyNumberMaskRef;
    return undefined
  }
  // #endregion


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

  else if (type == 'search') {
    // TODO: Add search results, and possibly another component to avoid overhead problems with the input component
  }


  // Error handling
  const getError = (): boolean => (error && !disabled);

  // Password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggleShowPassword = (visible: boolean) => setShowPassword(visible);

  const getType = (): TextInputTypes => {
    if (type == 'password') return showPassword ? 'text' : 'password';
    return type;
  }

  // Tooltip logic
  const [tooltipActive, setTooltipActive] = useState<boolean>(false);
  const tooltipCoordinates = useRef<{ x: number, y: number}>({ x: 0, y: 0 });
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
    tooltipCoordinates.current = coordinates;
    // console.log(`mouseCoordinates: `, tooltipCoordinates.current); //  {x: coordinates.x, y: coordinates.y });
  }


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
          ref={getMaskRef(type)}
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

          className={`${getInputClasses(error, type, disabled)} peer`}
          { ...props }
        />

        {/* Elements preceding the input */}
        <PrecedingInputElements className="input-preceding-el-align">
          <div className='input-preceding-el'>
            { type == 'email' &&        <Icon variant='Envelope' styles='input-icon-def' /> }
            { type == 'policyNumber' && <Icon variant='Profile' styles='input-icon-def' /> }
            { type == 'phone' &&        <Icon variant='Phone' styles='input-icon-def' /> }
            { type == 'creditCard' &&   <Icon variant='CreditCard' styles='input-icon-def' /> }
            { type == 'password' && 
              <div onClick={() => toggleShowPassword(!showPassword)} className='input-password-vis'>
                { showPassword  &&  <Icon variant='EyeSlash' styles='input-icon-def' /> }
                { !showPassword &&  <Icon variant='Eye' styles='input-icon-def' /> }
              </div>
            }
          </div>
        </PrecedingInputElements>


        {/* Elements after the input */}
        <SubsequentInputElements className={`input-subsequent-el`}>
          <div className={`row flex-grow justify-items-end items-center`}>
            { getError() ?
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

            {/* Currency and Search */}
            { type == 'currency' ? 
              <CurrencySelectContainer className='row relative'>
                <CurrencySelect id="currency" name="currency" className={`input-curr ${getError() ? 'input-curr-error' : ''}`}>
                  <option>USD</option> <option>CAD</option> <option>EUR</option>
                </CurrencySelect>
                <Icon variant='DropdownArrow' styles='size-5 absolute top-[7px] right-[6px]' />
              </CurrencySelectContainer>

            : type == 'search' ? 
              <SortSearchButton type="button" className={`input-sort-btn ${getError() ? 'input-sort-error' : ''}`}>
                <Icon variant='Sort' styles='size-5 text-slate-100 dark:text-slate-400' />
                Sort
              </SortSearchButton>
            : <></>
            }
          </div>
        </SubsequentInputElements>
        
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




// #region Component Styles
// Elements 
const TextInput = styled.div``;
const InputContainer = styled.div``;

const PrecedingInputElements = styled.div``;
const SubsequentInputElements = styled.div``;
const Label = styled.label``;
const ErrorAndDescription = styled.div``;

const LoadingBar = styled.div``;
const SortSearchButton = styled.button``;
const CurrencySelectContainer = styled.div``;
const CurrencySelect = styled.select`pointer-events: all;`;
const TooltipIcon = styled.div`pointer-events: all;`;


// Input themes and error styles
const getDisabledThemes = (): string => ` input-disabled`;
const getErrorThemes = (): string => ` input-error`;
const getInputClasses = (error: boolean, type: string, disabled?: boolean): string => {
  let classes = `input-base`; 
  if (!(type == 'search' || type == 'text' || type == 'currency')) classes += ` input-icon-spacing`; 
  if (disabled)  classes += getDisabledThemes();
  else if (error)  classes += getErrorThemes();
  return classes;
}


// Tooltip Styling TODO: this needs to be fixed positioning to handle proper placement with scroll
const Tooltip = styled.div``;
// #endregion 


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
  tooltip: true,
  tooltipText: 'The email used to create your account.',
  autocomplete: 'email',
}

export const InputProps_Password: InputPropsPartial = {
  type: 'password',
  name: 'password',
  label: 'Password',
  description: 'Create your password.',
  tooltip: true,
  tooltipText: 'The used for your account.',
  autocomplete: 'password',
}

export const InputProps_Phone: InputPropsPartial = {
  type: 'phone',
  name: 'phone',
  label: 'Phone',
  description: 'What is your phone number?',
  tooltip: true,
  tooltipText: 'Your phone number, including the area code. ex: (000)-000-0000',
  autocomplete: 'tel',
}
// #endregion