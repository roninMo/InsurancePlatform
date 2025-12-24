import { ChangeEvent, FocusEvent, MouseEvent, useState } from 'react';
import styles from './Input.module.scss';
import styled from '@emotion/styled';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'phone' | 'currency' | 'policyNumber' | 'search';
  
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  id: string;

  required?: boolean;
  disabled?: boolean;

  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onClick?: (e: MouseEvent<HTMLInputElement, Element>) => void;

  autocomplete?: "email"  | "name"  | "password"  | "family-name" | "given-name" | "country-name" | "postal-code" | "street-address" | "address-level1" | "address-level2";
  aria?: string | null;
}

export const Input = ({
  type = 'text', name, label, value, placeholder, id,
  required = false, disabled = false,
  onChange, onBlur, onFocus, onClick,
  autocomplete, aria
}: InputProps) => {
  const [displayText, setDisplayText] = useState<string>(label);




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

  return (
    <TextInput>
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Email</label>
      <div className="mt-2">
        <input 
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          id={id} 
          
          required={required}
          disabled={disabled}

          autoComplete={autocomplete}
          aria-describedby={aria || ''}

          onChange={(e) => onChange ? onChange(e) : null}
          onBlur={(e) => onBlur ? onBlur(e) : null}
          onFocus={(e) => onFocus ? onFocus : null}
          onClick={(e) => onClick ? onClick : null}
          // onMouseEnter={() => {}}
          // onMouseLeave={() => {}}




      
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500" />
      </div>
      <p id="email-description" className="mt-2 text-sm text-gray-500 dark:text-gray-400">We'll only use this for spam.</p>
    </TextInput>
  );
}

const TextInput = styled.div``;
const EmailInput = styled.div``;
const PasswordInput = styled.div``;
const PhoneInput = styled.div``;
const CurrencyInput = styled.div``;
const PolicyNumberInput = styled.div``;
const SearchInput = styled.div``;


/*
    <div>
      <label htmlFor={type} className="block text-sm font-medium leading-6 text-white">{label}</label>
      <div className="mt-2">
        <input 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChanged(e.currentTarget.value)}
          id={id} 
          name={name}
          type={type}
          autoComplete={autocomplete}
          required={required}
          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-2" 
        />
      </div>
    </div>
  );
*/