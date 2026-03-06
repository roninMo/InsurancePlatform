import { ChangeEvent, FocusEvent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import { InputMask, useMask } from '@react-input/mask';

import styles from './Input.module.scss';
import styled from '@emotion/styled';
import { Icon } from '../../Common/Icons/Icon';
import { EventHandlers } from '../../Common/Utilities/Utils';


export type TextInputTypes = 'text' | 'email' | 'password' | 'phone' | 'creditCard' | 'currency' | 'policyNumber' | 'search';
export type TextInputAutoCompleteTypes = "email"  | "tel" | "name"  | "password"  | "family-name" | "given-name" | "country-name" | "postal-code" | "street-address" | "address-level1" | "address-level2";

interface InputProps {
  type?: TextInputTypes
  
  name: string;
  label: string;
  description?: string;
  value: string;
  placeholder?: string;
  id: string;

  error?: boolean;
  errorMessage?: string | null;
  required?: boolean;
  disabled?: boolean;
  tooltip?: boolean;
  tooltipText?: string;

  autocomplete?: TextInputAutoCompleteTypes;
  aria?: string | null;
}


export const Input = ({
  type = 'text', name, label, description, value, placeholder, id,
  error = false, errorMessage, required = false, disabled = false, tooltip = false, tooltipText,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  autocomplete, aria, ...props
}: InputProps & EventHandlers) => {
  const emailRegexValidation = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`;
  
  // TODO: Removed for variation, implement react-hook-forms
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


  // placholder logic
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
  const shouldDisplayError = (): boolean => error && !disabled;


  // Tooltip logic
  const [tooltipActive, setTooltipActive] = useState<boolean>(false);
  const tooltipCoordinates = useRef<{ x: number, y: number}>({ x: 0, y: 0 });
  const tooltipMouseEnter = (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => {
    // console.log('mouse enter tooltip', {Event: e});
    setTooltipActive(true);
  }
  
  const tooltipMouseLeave = (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => {
    // console.log('mouse leave tooltip', {Event: e});
    setTooltipActive(false);
  }

  const toolTipHover = (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>): void => {
    const coordinates = { x: e.clientX, y: e.clientY };
    tooltipCoordinates.current = coordinates;
    // console.log(`mouseCoordinates: `, tooltipCoordinates.current); //  {x: coordinates.x, y: coordinates.y });
  }


  return (
    <TextInput className='input'>
      <label htmlFor={type} className=""> { label } </label>
      <div className="mt-2 grid grid-cols-1">
        <input 
          type={type}
          name={name}
          value={!disabled ? value : placeholder}
          ref={getMaskRef(type)}
          placeholder={placeholder}
          id={id}

          onChange={(e) => onChange ? onChange(e) : null}
          onBlur={(e) => onBlur ? onBlur(e) : null}
          onFocus={(e) => onFocus ? onFocus(e) : null}
          onClick={(e) => onClick ? onClick(e) : null}
          onMouseEnter={(e) => onMouseEnter ? onMouseEnter(e) : null}
          onMouseLeave={(e) => onMouseLeave ? onMouseLeave(e) : null}

          required={required}
          disabled={disabled}

          autoComplete={autocomplete}
          aria-describedby={aria || autocomplete || ''}
          aria-invalid={error ? "true" : "false"}

          className={`${getInputClasses(error, type, disabled)} peer`}
          { ...props }
        />

        {/* Elements preceding the input */}
        <PrecedingInputElements className={`pointer-events-none col-start-1 row-start-1 justify-center self-center`}>
          { type == 'email' && <Icon variant='Envelope' styles='size-4 ml-3' /> }
          { type == 'policyNumber' && <Icon variant='Profile' styles='size-4 ml-3' /> }
          {/* TODO: custom icons preceding input */}
        </PrecedingInputElements>


        {/* Elements after the input */}
        <SubsequentInputElements className={`${iconContainerStyles} ${borderSelectStyles(error)} peer-focus:[&_button]:border-l-2`}>
          <div className={`flex flex-row flex-grow justify-items-end items-center`}>
            { shouldDisplayError() ?
              <Icon variant='Error' styles='mr-3 size-4 error' /> 
            : 
              <TooltipIcon 
                onMouseEnter={e => tooltip && tooltipMouseEnter(e)} 
                onMouseOver={e => tooltip && toolTipHover(e)} 
                onMouseLeave={e => tooltip && tooltipMouseLeave(e)} 
                className={`cursor-pointer`}
              >
                <Icon variant='InfoBox' styles='mr-3 size-4' /> 
              </TooltipIcon>
            }

            {/* Currency and Search */}
            { type == 'currency' ? 
              <CurrencySelectContainer className='flex flex-row relative'>
                <CurrencySelect id="currency" name="currency" aria-label="Currency" className={getDropdownClasses(error)}>
                  <option>USD</option> <option>CAD</option> <option>EUR</option>
                </CurrencySelect>
                <Icon variant='DropdownArrow' styles='size-5 absolute top-[7px] right-[6px]' />
              </CurrencySelectContainer>

            : type == 'search' ? 
              <SortSearchResults>
                <button type="button" className={`flex items-center gap-x-1.5 shrink-0 ${sortButtonStyles} ${sortBorderStyles}`}>
                  <Icon variant='Sort' />
                  Sort
                </button>
              </SortSearchResults>
            : <></>
            }
          </div>
        </SubsequentInputElements>
      </div>

      {/* Error / Description messages */}
      { shouldDisplayError() && errorMessage ? 
        <p id={`${id}-error-message`} className="mt-2 ml-1 error"> { errorMessage } </p>
      : description && 
        <p id={`${id}-email-description`} className="mt-2 ml-1"> { description } </p>
      }

      {/* Tooltip Text */}
      {tooltip && 
        <Tooltip 
          style={{ transform: `translate(${tooltipCoordinates.current.x + 8}px, ${tooltipCoordinates.current.y + 12}px)`}}
          className={`${tooltipTheme_Styles} ${tooltipHoverStyles} ${tooltipCoordinates} ${tooltipActive ? tooltipVisible : tooltipHidden}`}
        >
          {tooltipText}
        </Tooltip>
      }

    </TextInput>
  );
}




// #region Component Styles
// Elements 
const TextInput = styled.div``;
const EmailInput = styled.div``;
const PasswordInput = styled.div``;
const PhoneInput = styled.div``;
const CurrencyInput = styled.div``;
const PolicyNumberInput = styled.div``;
const SearchInput = styled.div``;

const PrecedingInputElements = styled.div``;
const SubsequentInputElements = styled.div``;
const SortSearchResults = styled.div``;
const CurrencySelectContainer = styled.div``;
const CurrencySelect = styled.select`pointer-events: all;`;
const TooltipIcon = styled.div`pointer-events: all;`;
const iconContainerStyles = `pointer-events-none grid col-start-1 row-start-1 self-center justify-end focus-within:relative`;

const sortButtonStyles = `rounded-r-md px-3 py-2 font-semibold bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white`;
const sortBorderStyles = `border-l border-default`;
const borderSelectStyles = (error: boolean): string => error ?
  `peer-focus:[&_button]:border-red-400 dark:peer-focus:[&_button]:border-red-500` :
  `peer-focus:[&_button]:border-indigo-600 dark:peer-focus:[&_button]:border-indigo-500`
;


// Input themes and error styles
// TODO: Default theme styles for input element text and border/outline colors
const getInputClasses = (error: boolean, type: string, disabled?: boolean): string => {
  let classes = `col-start-1 row-start-1 block w-full`; // Keep layout styling specific to components

  // Icon spacing
  if (type == 'email' || type == 'policyNumber') classes += ` pl-9`; 

  // Static themes for default/error display
  if (disabled)  classes += getDisabledThemes();
  else if (error)  classes += getErrorThemes();
  return classes;
}

const getDisabledThemes = (): string => ` disabled`;
const getErrorThemes = (): string => ` error error-outline`;


// for the currency selection button
const getDropdownClasses = (error: boolean): string => {
  let classes = `col-start-1 row-start-1 w-full appearance-none outline-css pl-3 py-2 pr-7`;
  
  // Static themes for default/error display
  if (error) classes += getErrorThemes();
  else       classes += ` outline-styles`;
  return classes;
}


// Tooltip Styling TODO: this needs to be fixed positioning to handle proper placement with scroll
const Tooltip = styled.div``;
const tooltipTheme_Styles = ` 
  text-xs italic shadow-lg p-2 pr-4 max-w-64
  bg-default border rounded-md border-styles
  pointer-events-none transition-all
`;

const tooltipHoverStyles = `absolute top-0 left-0 z-10 duration-200 ease-in`;
const tooltipHidden = `opacity-0 *:opacity-0 transition-all`;
const tooltipVisible = `opacity-100 *:opacity-100 transition-opacity`;
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