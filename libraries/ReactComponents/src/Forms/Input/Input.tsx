import { ChangeEvent, FocusEvent, MouseEvent, RefObject, useRef, useState } from 'react';
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
  let maskRef: RefObject<HTMLInputElement> | null = null;
  // const rawValue = value.replace(/\D/g, ''); // To retrieve raw mask values

  // #region Masking for different input types
  if (type == 'text') {

  } else if (type == 'email') {
    const regexValidation = `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`;
  }

  else if (type == 'phone') {
    if (placeholder == '') placeholder = '(000)-00-0000';
    maskRef = useMask({
      mask: '(___) ___-____', // '+0 (___) ___-____'
      replacement: { _: /\d/ },
    });
  }

  else if (type ==  'creditCard') {
    if (placeholder == '') placeholder = '0000 0000 0000 0000';
    maskRef = useMask({
      mask: '____ ____ ____ ____',
      replacement: { _: /\d/ },
    });
  }

  else if (type == 'currency') {
    const currencyType = '$';
    if (placeholder == '') placeholder = `${currencyType} 0.00`;
  }

  else if (type == 'policyNumber') {
    if (placeholder == '') {
      // if (isAutoPolicy) placeholder = '000000000';
      // if (isHomePolicy) placeholder = 'A000A000A000A';
      placeholder = '000000000';
      
      maskRef = useMask({
        mask: '_________',
        replacement: { _: /\d/ },
      });
    }
  }

  else if (type == 'search') {
    // TODO: Add search results, and possibly another component to avoid overhead problems with the input component
  }
  // #endregion

  // TODO: just add the tooltip here
  const [tooltipActive, setTooltipActive] = useState<boolean>(false);
  const tooltipCoordinates = useRef<{ x: number, y: number}>({ x: 0, y: 0 });
  const tooltipMouseEnter = (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => {
    console.log('mouse enter tooltip', {Event: e});
    setTooltipActive(true);
  }
  
  const tooltipMouseLeave = (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => {
    console.log('mouse leave tooltip', {Event: e});
    setTooltipActive(false);
  }

  const toolTipHover = (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>): void => {
    const coordinates = { x: e.clientX, y: e.clientY };
    tooltipCoordinates.current = coordinates;
    // console.log(`mouseCoordinates: `, tooltipCoordinates.current); //  {x: coordinates.x, y: coordinates.y });
  }

  return (
    <TextInput className='input'>
      <label htmlFor={type} className="text-sm font-medium leading-6 block"> { label } </label>
      <div className="mt-2 grid grid-cols-1">
        <input 
          type={type}
          name={name}
          value={value}
          ref={type == 'creditCard' || 'policyNumber' || 'currency' || 'phone' ? maskRef : null}
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

          className={getInputClasses(error, type, disabled)}
        />

        {/* Elements preceding the input */}
        <PrecedingInputElements className={`pointer-events-none col-start-1 row-start-1 justify-center self-center`}>
          { type == 'email' && <Icon variant='Envelope' styles='size-4 ml-3' /> }
          { type == 'policyNumber' && <Icon variant='Profile' styles='size-4 ml-3' /> }
          {/* TODO: custom icons preceding input */}
        </PrecedingInputElements>


        {/* Elements after the input */}
        <SubsequentInputElements className={`${iconContainerStyles}`}>
          <div className={`flex flex-row flex-grow justify-items-end items-center`}>
            { error ?
              <Icon variant='Error' styles='mr-3 size-4 text-red-500 dark:text-red-400' /> 
            : 
              <InteractiveIcon onMouseEnter={e => tooltip && tooltipMouseEnter(e)} onMouseOver={e => tooltip && toolTipHover(e)} onMouseLeave={e => tooltip && tooltipMouseLeave(e)} className={`cursor-pointer`}>
                <Icon variant='InfoBox' styles='mr-3 size-4' /> 
              </InteractiveIcon>
            }

            { type == 'currency' ? 
              <CurrencyDropdown>
                <CurrencySelect id="currency" name="currency" aria-label="Currency" className={getDropdownClasses(error)}>
                  <option>USD</option> <option>CAD</option> <option>EUR</option>
                </CurrencySelect>
                <Icon variant='DropdownArrow' />
              </CurrencyDropdown>

            : type == 'search' ? 
              <SortSearchResults>
                <button type="button" className="flex shrink-0 items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/10 dark:text-white dark:outline-gray-700 dark:hover:bg-white/20 dark:focus:outline-indigo-500">
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
      { error && errorMessage ? 
        <p id={`${id}-error-message`} className="mt-2 text-xs text-red-600 dark:text-red-400"> { errorMessage } </p>
      : description && 
        <p id={`${id}-email-description`} className="mt-2 text-xs"> { description } </p>
      }


      {/* Tooltip Text */}
      {tooltip && 
        <Tooltip 
          style={{ transform: `translate(${tooltipCoordinates.current.x + 8}px, ${tooltipCoordinates.current.y + 12}px)`}}
          className={`${tooltipHoverStyles} ${tooltipTheme_Styles} ${tooltipCoordinates} pointer-events-none transition-all ${tooltipActive ? tooltipVisible : tooltipHidden}`}
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
const CurrencyDropdown = styled.div``;
const CurrencySelect = styled.select`pointer-events: all;`;
const InteractiveIcon = styled.div`pointer-events: all;`;
const iconContainerStyles = `pointer-events-none grid col-start-1 row-start-1 self-center justify-end focus-within:relative`;


// Input themes and error styles
// TODO: Default theme styles for input element text and border/outline colors
const getInputClasses = (error: boolean, type: string, disabled?: boolean): string => {
  let classes = `col-start-1 row-start-1 block w-full 
    rounded-md sm:text-sm/6 px-3 py-1.5 text-base 
    outline outline-1 -outline-offset-1 
    focus:outline-2 focus:-outline-offset-2 
    bg-white dark:bg-white/5 
  `;

  // Icon spacing
  if (type == 'email' || type == 'policyNumber') classes += ` pl-9`; 

  // Static themes for default/error display
  if (disabled) {
    classes += getDisabledThemes();
  } else if (error) {
    classes += getErrorThemes();
  } else {
    classes += ` 
      text-slate-900 dark:text-white 
      placeholder:text-slate-400  dark:placeholder:text-slate-500 

      outline-gray-300 dark:outline-white/10 
      focus:outline-indigo-600 dark:focus:outline-indigo-500 
    `;
  }

  return classes;
}

const getDropdownClasses = (error: boolean): string => {
  let classes = ` 
    col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 
    text-base sm:text-sm/6 
    outline outline-1 -outline-offset-1 
    focus:outline-2 focus:-outline-offset-2 
    dark:bg-gray-800 dark:*:bg-gray-800 
  `;
  
  // Static themes for default/error display
  if (error) {
    classes += getErrorThemes();
  } else {
    classes += ` 
      text-gray-500 dark:text-gray-400 
      placeholder:text-slate-400 dark:placeholder:text-slate-500 

      outline-gray-300 dark:outline-white/10 
      focus:outline-indigo-600 dark:focus:outline-indigo-500 
    `;
  }

  return classes;
}

const getDisabledThemes = (): string => {
  return `
    dark:bg-gray-600 dark:*:bg-gray-600
    placeholder:text-slate-500 dark:placeholder:text-slate-400 
    text-gray-500 dark:text-gray-400 
    outline-gray-400 dark:outline-white/10 
  `;
}

const getErrorThemes = (): string => {
  return ` 
    text-red-900 dark:text-red-400 
    placeholder:text-red-300 dark:placeholder:text-red-400/70
    
    outline-red-300 dark:outline-red-500/50 
    focus:outline-red-600 dark:focus:outline-red-400 
  `;
}


// Tooltip Styling
const Tooltip = styled.div``;

const tooltipHoverStyles = `
  absolute top-0 left-0 z-10 duration-200 ease-in
`;
const tooltipTheme_Styles = ` 
  text-xs italic shadow-lg border rounded-md p-2 pr-4 max-w-64
  bg-white dark:bg-slate-800 
  border-gray-300 dark:border-white/10 
  focus:border-indigo-600 dark:focus:border-indigo-500 
`;

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