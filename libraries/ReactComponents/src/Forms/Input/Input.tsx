import { useState } from 'react';
import styles from './Input.module.scss';
import styled from '@emotion/styled';

interface InputProps {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  autocomplete?: "email"  | "name"  | "password"  | "family-name" | "given-name" | "country-name" | "postal-code" | "street-address" | "address-level1" | "address-level2";
  type?: 'text' | 'email' | 'password' | 'phone' | 'currency' | 'policyNumber' | 'search';
  required?: boolean;
  value: string;
  onValueChanged: (newValue: string) => void;
}


export const Input = ({
  label,
  id,
  name,
  placeholder = '',
  autocomplete,
  type = 'text',
  required = false,
  value,
  onValueChanged,
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
        <input id="email" type="email" name="email" placeholder="you@example.com" aria-describedby="email-description" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500" />
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