import { FocusEvent, MouseEvent, useEffect, useId, useState } from "react";

import { UniversalEventHandlers } from '../../Common/Utilities/Utils';
import { SelectItem, SelectItemValues } from './SelectItem/SelectItem';
import { Icon, IconTypes } from '../../Common/Icons/Icon';

import styles from './Select.module.scss';
import styled from '@emotion/styled';


export interface SelectProps {
  name: string;
  label: string;
  description?: string;
  value: SelectItemValues;
  values: SelectItemValues[];
  multiSelect?: boolean;
  // focusType: mouseLeaveCloses, onSelectCloses
  onSelect?: (selected: SelectItemValues, index: number) => void;
  placeholder?: string;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

// Custom select component for themes and advanced functionality
export const Select = ({
  name, label, description, value, values, multiSelect, onSelect, placeholder,
  onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  error = false, errorMessage, disabled = false, required = false
}: SelectProps & UniversalEventHandlers) => {
  const id = useId();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownId = `select-dropdown-${name}`;
  const selectId = `select-${name}`;

  // Select Events
  const itemSelected = (selected: SelectItemValues, index: number) => {
    if (onSelect) onSelect(selected, index);

    console.log(`item ${index} selected: `, selected);
    if (!multiSelect && dropdownOpen) setDropdownOpen(false);
  }

  // onClick
  const openSelect = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (onClick) onClick(e);
    if (!dropdownOpen) setDropdownOpen(true);
    // TODO: should tabbing through focused events open the dropdown when they tab to it or the select?
  }

  // Handles closing the dropdown
  useEffect(() => {
    const handleOutsideClick = (e: globalThis.MouseEvent) => {
      const element: any = e.target as HTMLElement;
      if (!element) {
        if (dropdownOpen) setDropdownOpen(false);
        return;
      }

      const dropdown = element.closest(`#${dropdownId}`);
      const select = element.closest(`#${selectId}`);
      const isInside = !!dropdown || !!select;
      if (!isInside) {
        setDropdownOpen(false);
      }
    }
    
    // When the dropdown opens
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    // Removed when dropdownOpen is false or the component unmounts
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen]);


  // Error handling
  const getError = (): boolean => !!error && !disabled;


  return (
    <Container className="select-container">
      <Label className="select-label">
        { label }
      </Label>

      <StyledSelect 
        name={name} id={selectId} 
        value={value?.value} type="button" 
        onFocus={(e) => onFocus && onFocus(e)}
        onClick={(e) => openSelect(e)}
        onBlur={(e) => onBlur && onBlur(e)}
        disabled={disabled}
        className={`select-base group
          ${!disabled && dropdownOpen ? 'select-focus' : ''}
          ${getError() ? 'select-error' : ''}
        `}
      >
        <CurrentlySelected className={`currently-selected ${disabled ? 'currently-selected-disabled' : ''}`}>
          <span className={`text-sm ${value?.value ? 'text-colors' : 'placeholder-text'}`}> 
            { value.value ? value.label : placeholder } 
          </span>

          <div className='row gap-1 items-center justify-end'>
            { error && <Icon variant='Error' styles='size-4 error-text' />}
            <Icon variant='SelectArrow' styles={`select-i-arrow ${error && 'error-text'}`} />
          </div>
        </CurrentlySelected>
      </StyledSelect>

			
      <Dropdown
        onMouseEnter={e => onMouseEnter && onMouseEnter(e)}
        onMouseLeave={e => onMouseLeave && onMouseLeave(e)}
        id={dropdownId} className={`select-dropdown
          ${dropdownOpen ? 'select-dd-open' : 'select-dd-closed'}
          ${getError() ? 'select-dd-error' : ''}
          ${!disabled ? 'select-dd-scroll' : 'select-dd-disabled'}
      `}>			
        <DropdownAnim className={`height-trans ${dropdownOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className={`height-trans-content`}>
            {values.map((item: SelectItemValues, index: number) => 
              <SelectItem 
                item={item}
                index={index}
                onSelect={itemSelected} 
                currentSelectValue={value}
                name={name}
                key={`${id}-${index}-${item.value}`}
              />
            )}
          </div>
        </DropdownAnim>
      </Dropdown>

      <ErrorAndDescription className={`pl-1 mt-2 height-trans ${description || (error && !disabled) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <p className={`height-trans-content text-sm ${getError() ? 'error-text' : 'text-colors'}`}>
          { getError() ? errorMessage : description } &nbsp;
        </p>
      </ErrorAndDescription>
    </Container>
  );
}


// Component styles
const Container = styled.div``;
const Label = styled.label``;
const StyledSelect = styled.button``;
const CurrentlySelected = styled.div``;
const Dropdown = styled.div``;
const DropdownAnim = styled.div``;
const ErrorAndDescription = styled.div``;
