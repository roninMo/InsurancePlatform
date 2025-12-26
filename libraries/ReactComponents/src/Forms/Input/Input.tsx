import { ChangeEvent, FocusEvent, MouseEvent, RefObject, useState } from 'react';
import { InputMask, useMask } from '@react-input/mask';

import styles from './Input.module.scss';
import styled from '@emotion/styled';
import { Icon } from '../../Common/Icons/Icon';


export type TextInputTypes = 'text' | 'email' | 'password' | 'phone' | 'creditCard' | 'currency' | 'policyNumber' | 'search';
export type TextInputAutoCompleteTypes = "email"  | "name"  | "password"  | "family-name" | "given-name" | "country-name" | "postal-code" | "street-address" | "address-level1" | "address-level2";

interface InputProps {
  type?: TextInputTypes
  
  name: string;
  label: string;
  description?: string;
  value: string;
  placeholder?: string;
  id: string;
  
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onClick?: (e: MouseEvent<HTMLInputElement, Element>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => void;

  error?: boolean;
  errorMessage?: string | null;
  required?: boolean;
  disabled?: boolean;
  tooltip?: boolean;

  autocomplete?: TextInputAutoCompleteTypes;
  aria?: string | null;
}


export const Input = ({
  type = 'text', name, label, description, value, placeholder, id,
  error = false, errorMessage, required = false, disabled = false, tooltip = false, 
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  autocomplete, aria
}: InputProps) => {
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
  const toolTipHover = (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>, state: 'onEnter' | 'onLeave'): void => {
    console.log('tooltip hover: ', {Event: e, state});

    if (state == 'onLeave') {

    } else if (state == 'onEnter') {

    }

  }

  return (
    <TextInput className='input'>
      <label htmlFor={type} className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">{label}</label>
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

          className={getInputClasses(error, type)}
        />

        {/* Elements preceding the input */}
        { type == 'email' && <Icon variant='Envelope' styles='pointer-events-none col-start-1 row-start-1 ml-3 size-4 justify-center self-center' /> }
        { type == 'policyNumber' && <Icon variant='Profile' styles='pointer-events-none col-start-1 row-start-1 ml-3 size-4 justify-center self-center' /> }
        {/* TODO: custom icons preceding input */}


        {/* Elements at the end of the input */}
        { error || tooltip && 
          <div className="pointer-events-none grid col-start-1 row-start-1 self-center justify-end focus-within:relative">
            { error ? <Icon variant='Error' styles='pointer-events-none col-start-1 row-start-1 mr-3 size-4 text-red-500 dark:text-red-400' /> 
              :       <Icon variant='InfoBox' styles='pointer-events-none col-start-1 row-start-1 mr-3 size-4 justify-end' /> }
          </div>
        }

        { type == 'currency' ? 
          <CurrencyDropdown className="pointer-events-none grid col-start-1 row-start-1 self-center justify-end focus-within:relative">
            <CurrencySelect id="currency" name="currency" aria-label="Currency" className={getDropdownClasses(error)}>
              <option>USD</option> <option>CAD</option> <option>EUR</option>
            </CurrencySelect>
            <Icon variant='DropdownArrow' />
          </CurrencyDropdown>

          : type == 'search' ? 
            <SortSearchResults className="pointer-events-none grid col-start-1 row-start-1 self-center justify-end focus-within:relative">
              <button type="button" className="flex shrink-0 items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/10 dark:text-white dark:outline-gray-700 dark:hover:bg-white/20 dark:focus:outline-indigo-500">
                <Icon variant='Sort' />
                Sort
              </button>
            </SortSearchResults>
          : <></>
        }
      </div>

      {/* Error / Description messages */}
      { error && errorMessage ? 
        <p id={`${id}-error-message`} className="mt-2 text-sm text-red-600 dark:text-red-400"> { errorMessage } </p>
      : description && 
        <p id={`${id}-email-description`} className="mt-2 text-sm"> { description } </p>
      }
    </TextInput>
  );
}


const getInputClasses = (error: boolean, type: string): string => {
  let classes = `col-start-1 row-start-1 block w-full 
    rounded-md sm:text-sm/6 px-3 py-1.5 text-base 
    outline outline-1 -outline-offset-1 
    focus:outline-2 focus:-outline-offset-2 
    bg-white dark:bg-white/5 
  `;

  // Icon spacing
  if (type == 'email') classes += ` pl-9`; 

  // Static themes for default/error display
  if (error) {
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

const getErrorThemes = (): string => {
  return ` 
    text-red-900 dark:text-red-400 
    placeholder:text-red-300 dark:placeholder:text-red-400/70
    
    outline-red-300 dark:outline-red-500/50 
    focus:outline-red-600 dark:focus:outline-red-400 
  `;
}


const TextInput = styled.div``;
const EmailInput = styled.div``;
const PasswordInput = styled.div``;
const PhoneInput = styled.div``;
const CurrencyInput = styled.div``;
const PolicyNumberInput = styled.div``;
const SearchInput = styled.div``;

const SortSearchResults = styled.div``;
const TooltipContainer = styled.div``;
const CurrencyDropdown = styled.div``;
const CurrencySelect = styled.select`pointer-events: all;`;

const ErrorIcon = styled.svg``;
const SearchListIcon = styled.svg``;
const TooltipIcon = styled.svg``;
const EmailIcon = styled.svg``;
const DropdownArrowIcon = styled.svg``;
