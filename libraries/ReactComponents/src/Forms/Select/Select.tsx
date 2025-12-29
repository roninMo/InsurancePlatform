import { ElSelect, ElSelectedcontent, ElOptions, ElOption } from '@tailwindplus/elements/react';
import styles from './Select.module.scss';
import styled from '@emotion/styled';
import { Icon, IconTypes } from '../../Common/Icons/Icon';
import { ChangeEvent, useState } from 'react';
import { EventHandlers } from '../../Common/Utilities/Utils';

export interface SelectItemProps {
  value: string;
  label: string;
  icon?: IconTypes;
}

export interface SelectProps {
  name: string;
  label: string;
  description?: string;
  value: SelectItemProps;
  values: SelectItemProps[];
  id: string;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;

  autoComplete?: string;
  aria?: string | null;
}

const selectItems: SelectItemProps[] = [
  { value: 'light', label: "Light", icon: "LightTheme" },
  { value: 'dark', label: "Dark", icon: "DarkTheme" },
  { value: 'system', label: "System", icon: "System" }
];

export const Select = ({
  name, label, description, value, values, id,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  error = false, errorMessage, disabled = false, required = false,
  autoComplete, aria
}: SelectProps & EventHandlers) => {


/*
  Label

  Select(ed) Item
  Overflow dropdown of items

  Details:
  - icon(s) and various elements preceding dropdown item text
  - dropdown item name
  - subsequent icons at the end of the element
  - ui scrollbar for navigation

  - input interactivity
  - select element settings for configuration
  - error handling
  - array of select item objects to pass via props
  
*/
  

  return (
    <Container>
      <SelectElement className={`${containerStyles} ${selectStyles} ${transitionStyles} ${visibilityStyles}`}>
        <CurrentlySelected className={`${currentlySelectedStyles} ${transitionStyles} ${borderStyles}`}>
          <span>
            Currently Selected Item
          </span>
          <Icon variant='DropdownArrow' styles='rotate-90 group-focus:rotate-0 size-5 justify-center self-center' />
        </CurrentlySelected>


        <DropdownItems className={`${dropdownStyles} ${borderStyles}`}>
          {selectItems.map((item: SelectItemProps) => 
            <SelectOption 
              value={item.value} 
              onChange={e => onChange && onChange(e)}
              onBlur={e => onBlur && onBlur(e)}
              onFocus={e => onFocus && onFocus(e)}
              onClick={e => onClick && onClick(e)}
              onMouseEnter={e => onMouseEnter && onMouseEnter(e)}
              onMouseLeave={e => onMouseLeave && onMouseLeave(e)}
              className={`${selectItemStyles} ${transitionStyles}`}
            >
              { item?.icon && <Icon variant={item.icon} /> }
              <p>{ item.label }</p>
            </SelectOption>
          )}
        </DropdownItems>
      </SelectElement>
    </Container>
  );
}



// #region Styling
const Container = styled.div``;
const SelectElement = styled.button``;
const CurrentlySelected = styled.div``;
const DropdownItems = styled.div``;
const SelectOption = styled.option``;
const PrecedingSelectItemElements = styled.div``;
const SubsequentSelectItemElements = styled.div``;


const getSelectStyles = (error: boolean) => {
  let classes = ``;

  if (error) null;
  else null;

  return classes;
}

// component styles
  const containerStyles = `relative group overflow-visible focus:overflow-visible`;
  const selectStyles = `text-sm bg-white dark:bg-slate-800 *:bg-white *:dark:bg-slate-800`;
  const currentlySelectedStyles = `currentlySelected flex flex-row items-center gap-2 w-max h-max p-2`;
  const dropdownStyles = `
    absolute left-0 mt-1 w-full flex flex-grow flex-col 
    bg-white dark:bg-slate-700
  `;
  const selectItemStyles = `
    flex flex-row gap-2 items-center p-2 rounded-none 
    [&_p]:hover:text-slate-200 dark:[&_p]:hover:text-slate-200
    hover:bg-indigo-500 [&_svg]:hover:text-slate-200
  `;
  
  const transitionStyles = `transition-all duration-200 ease-in *:transition-all *:duration-200 *:ease-in`;
  const hideStyles = `*:opacity-0 *:focus:opacity-0 [&_.currentlySelected]:opacity-100`;
  const showStyles = `*:opacity-100 *:focus:opacity-100`;
  const visibilityStyles = `
    *:opacity-0 *:focus:opacity-100 [&_.currentlySelected]:opacity-100
    
  `;

  const borderStyles = `
    border shadow-lg rounded-md
    border-gray-300 dark:border-white/10 
    focus:border-indigo-600 dark:focus:border-indigo-500 
  `;

// #endregion




// <svg className="rotate-90 group-focus:rotate-180" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
//   viewBox="0 0 24 24">
//   <path fill="currentColor"
//     d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z" />
// </svg>