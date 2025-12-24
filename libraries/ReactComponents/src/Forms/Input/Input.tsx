import { ChangeEvent, FocusEvent, MouseEvent, SyntheticEvent, useEffect, useState } from 'react';
import styles from './Input.module.scss';
import styled from '@emotion/styled';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'phone' | 'currency' | 'policyNumber' | 'search';
  
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

  autocomplete?: "email"  | "name"  | "password"  | "family-name" | "given-name" | "country-name" | "postal-code" | "street-address" | "address-level1" | "address-level2";
  aria?: string | null;
}

export const Input = ({
  type = 'text', name, label, description, value, placeholder, id,
  required = false, disabled = false, error = false, errorMessage,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  autocomplete, aria
}: InputProps) => {
  const [displayText, setDisplayText] = useState<string>(label);


  // #region Input Types
  if (type == 'email') {

  }

  if (type == 'password') {

  }

  if (type == 'phone') {

  }

  if (type == 'currency') {

  }

  if (type == 'policyNumber') {

  }

  if (type == 'search') {

  }
  // #endregion

  return (
    <TextInput>
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Email</label>
      <div className="mt-2 grid grid-cols-1">
        <input 
          type={type}
          name={name}
          value={value}
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


          className={`col-start-1 row-start-1 block w-full 
            rounded-md sm:text-sm/6 px-3 py-1.5 text-base 
            outline outline-1 -outline-offset-1 
            focus:outline-2 focus:-outline-offset-2 
            
            text-slate-900 dark:text-white 
            placeholder:text-slate-400  dark:placeholder:text-slate-500 
            
            bg-white dark:bg-white/5 
            outline-gray-300 dark:outline-white/10 
            focus:outline-indigo-600 dark:focus:outline-indigo-500
          ` + (error ? + ErrorTextStyles + ErrorOutlineStyles : "")}
        />

        {error && 
          <ErrorIcon viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4 dark:text-red-400">
            <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" fillRule="evenodd" />
          </ErrorIcon>
        }
      </div>

      {error && errorMessage ? 
        <p id={`${id}-error-message`} className="mt-2 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      : description && 
        <p id={`${id}-email-description`} className="mt-2 text-sm">
          {description}
        </p>
      }
      
      {/* <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400">Not a valid email address.</p> */}


    </TextInput>
  );
}

const ErrorTextStyles = ` 
  text-red-900 dark:text-red-400 
  placeholder:text-red-300 dark:placeholder:text-red-400/70
`;

const ErrorOutlineStyles = ` 
  outline-red-300 dark:outline-red-500/50 
  focus:outline-red-600 dark:focus:outline-red-400 
`;

const TextInput = styled.div``;
const EmailInput = styled.div``;
const PasswordInput = styled.div``;
const PhoneInput = styled.div``;
const CurrencyInput = styled.div``;
const PolicyNumberInput = styled.div``;
const SearchInput = styled.div``;

const ErrorIcon = styled.svg``;
