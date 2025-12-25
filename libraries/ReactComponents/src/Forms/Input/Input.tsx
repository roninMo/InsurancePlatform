import { ChangeEvent, FocusEvent, MouseEvent, RefObject, useState } from 'react';
import { InputMask, useMask } from '@react-input/mask';

import styles from './Input.module.scss';
import styled from '@emotion/styled';


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

  autocomplete?: TextInputAutoCompleteTypes;
  aria?: string | null;
}


export const Input = ({
  type = 'text', name, label, description, value, placeholder, id,
  required = false, disabled = false, error = false, errorMessage,
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

  const toolTipHover = (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>, state: 'onEnter' | 'onLeave'): void => {
    console.log('tooltip hover: ', {Event: e, state});

    if (state == 'onLeave') {

    } else if (state == 'onEnter') {

    }

    // https://tailwindcss.com/plus/ui-blocks/application-ui/forms/select-menus
  }

  return (
    <TextInput>
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
        { type == 'email' && 
          <EmailIcon viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4 dark:text-gray-500">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </EmailIcon>
        }

        {/* Elements at the end of the input */}
        { type == 'currency' ? 
          <CurrencyDropdown className="pointer-events-none grid col-start-1 row-start-1 self-center justify-end focus-within:relative">
            <CurrencySelect id="currency" name="currency" aria-label="Currency" className={getDropdownClasses(error)}>
              <option>USD</option>
              <option>CAD</option>
              <option>EUR</option>
            </CurrencySelect>
            <DropdownArrowIcon viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400">
              <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
            </DropdownArrowIcon>
          </CurrencyDropdown>

        : type == 'search' ? 
          <SortSearchResults className="pointer-events-none grid col-start-1 row-start-1 self-center justify-end focus-within:relative">
            <button type="button" className="flex shrink-0 items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/10 dark:text-white dark:outline-gray-700 dark:hover:bg-white/20 dark:focus:outline-indigo-500">
              <SearchListIcon viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" className="-ml-0.5 size-4 text-gray-400">
                <path d="M2 2.75A.75.75 0 0 1 2.75 2h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2 2.75ZM2 6.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 2 6.25Zm0 3.5A.75.75 0 0 1 2.75 9h3.5a.75.75 0 0 1 0 1.5h-3.5A.75.75 0 0 1 2 9.75ZM9.22 9.53a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1-1.06 1.06l-.97-.97v5.69a.75.75 0 0 1-1.5 0V8.56l-.97.97a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" fillRule="evenodd" />
              </SearchListIcon>
              Sort
            </button>
          </SortSearchResults>

        : error &&
          <TooltipContainer className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end ">
            <ErrorIcon viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" className="text-red-500 sm:size-4 dark:text-red-400">
              <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" fillRule="evenodd" />
            </ErrorIcon>

          {/* : tooltip && 
            <TooltipIcon viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" className="text-gray-400 sm:size-4 dark:text-gray-500">
              <path d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z" clipRule="evenodd" fillRule="evenodd" />
            </TooltipIcon> */}
          </TooltipContainer>
        }
      </div>

      {/* Error / Description messages */}
      { error && errorMessage ? 
        <p id={`${id}-error-message`} className="mt-2 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      : description && 
        <p id={`${id}-email-description`} className="mt-2 text-sm">
          {description}
        </p>
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
