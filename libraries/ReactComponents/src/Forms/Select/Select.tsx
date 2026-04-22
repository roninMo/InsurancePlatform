import { MouseEvent, useEffect, useId, useRef, useState } from "react";
import { SelectItemComponent, SelectItem } from './SelectItem/SelectItem';
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';
import { Icon, IconTypes } from '../../Common/Icons/Icon';

import styles from './Select.module.scss';
import styled from '@emotion/styled';
import { TooltipContentProps, TooltipContextActions } from "../../Common";


export interface SelectProps {
  name: string;
  label: string;
  description?: string;

  value: SelectItem;
  values: SelectItem[];
  multiSelect?: boolean;
  onSelect?: (selected: SelectItem, index: number) => void;
  placeholder?: string;

  // Error / Validation // TODO: change the error state to a single value OR the error obj (if stable ref from RHF)
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  
  /* Tooltip */
  // The Tooltip Context stable function ref
  tooltipContext?: TooltipContextActions;
  // The content props for the tooltip component
  tooltipContent?: TooltipContentProps; 

  /* Select Dropdown Options */
  // when they hover outside of the element, close the dropdown.
  closeDropdownOnLeave?: boolean;
  
  // for both normal or multiselect. undefined is ignored
  keepDropdownOpenOnSelect?: boolean;
  
  // by default, we open the dropdown if the user tabs to it
  preventOpenOnTabFocus?: boolean;
}



// Custom select component for themes and advanced functionality
export const Select = ({
  name, label, description, value, values, multiSelect, onSelect, placeholder,
  onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  closeDropdownOnLeave, keepDropdownOpenOnSelect, preventOpenOnTabFocus, 
  error = false, errorMessage, disabled = false, required = false, tooltipContext, tooltipContent, 
}: SelectProps & UniversalEventHandlers) => {
  const { show, hide } = tooltipContext || {};  
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  // const selectedValues = useRef<Record<string, boolean>>(Object.fromEntries(values.map(item => [value.value, false])));
  const dropdownId = `${name}-slct-dropdown`;
  const selectId = `${name}-slct`;

  // Error Handling
  const getError = (): boolean => !!error && !disabled;


  //------------------------------------//
  // Open / Close Dropdown Logic        //
  //------------------------------------//
  // #region Open / Close Dropdown
  const selectElementRef = useRef<HTMLButtonElement>(null);
  const dropdownElementRef = useRef<HTMLDivElement>(null);

  // Open the dropdown if they have clicked the select element
  const onClickSelect = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (onClick) onClick(e);
    if (!dropdownOpen) setDropdownOpen(true);
  }
  
  // Handles logic when the dropdown is selected
  const onDropdownItemSelected = (selected: SelectItem, index: number) => {
    // capture whether the value has been selected here and toggle it
    // if (multiSelect) {
    //   selectedValues.current[selected.value] = !selectedValues.current[selected.value];
    // }

    if (onSelect) onSelect(selected, index); // actual logic
    handleDropdownToggle();
    // console.log(`item ${index} selected: `, selected);
  }

  const handleDropdownToggle = () => {
    const keepDropdownOpen = keepDropdownOpenOnSelect;

    // Default behavior
    if (keepDropdownOpen === undefined) {
      if (!multiSelect && dropdownOpen) setDropdownOpen(false);
      // otherwise multiSelect variants have it stay left open
    }

    else {
      // If the user wants the dropdown to stay open on select, do so
      if (keepDropdownOpen === true) return;
      else if (dropdownOpen) setDropdownOpen(false); 
    }
  }

  // Default: Checks if clicked outside the dropdown via mousedown event on whether to close the dropdown
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


  // for closeDropdownOnLeave: Closes the dropdown when hovers outside of it 
  useEffect(() => {
    const select = selectElementRef.current;
    const dropdown = dropdownElementRef.current;
    
    // If the dropdown is closed or this option isn't enabled don't add the event
    if (!dropdownOpen || !closeDropdownOnLeave) {
      return;
    }

    // error prevention
    if (!select || !dropdown) {
      return;
    }

    // Handle closing the dropdown when leaving the select
    const handleMouseOver = (e: globalThis.MouseEvent) => {
      // The element is missing or the dropdown could be closed, just let the native behavior handle potential edge cases
      if (!select || !dropdown) {
        document.removeEventListener('mouseover', handleMouseOver);
        return;
      }

      // Check if we're hovering the element
      const element = e.target as HTMLElement;
      const isWithinSelect = element.closest(`#${selectId}`);
      const isWithinDropdown = element.closest(`#${dropdownId}`);
      if (isWithinSelect || isWithinDropdown) return;
      // else console.log(`${name}: mouse hovering select(${isWithinSelect}, dropdown(${isWithinDropdown}))`);

      // check if the mouse is inbetween the select and the dropdown (margin edge case)
      const selectRect = select.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();

      // Create a virtual "bounding box" that spans from the top of the select 
      // to the bottom of the dropdown and covers their width.
      const compBounds = (
        e.clientX >= Math.min(selectRect.left, dropdownRect.left) &&
        e.clientX <= Math.max(selectRect.right, dropdownRect.right) &&
        e.clientY >= Math.min(selectRect.top, dropdownRect.top) &&
        e.clientY <= Math.max(selectRect.bottom, dropdownRect.bottom)
      );

      // console.log(`${name}: mouse isInsideBounds(${compBounds})`);
      if (!compBounds) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [dropdownOpen, closeDropdownOnLeave]);


  // Open the dropdown when the user tabs to it
  useEffect(() => {
    const selectElement = selectElementRef.current;
    if (preventOpenOnTabFocus || !selectElement) return;

    // tabbed / keyboard nav to focus the element
    const checkIfTabbed = (event: globalThis.FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches(':focus-visible')) setDropdownOpen(true);
    }

    selectElement.addEventListener('focus', checkIfTabbed);
    return () => selectElement.removeEventListener('focus', checkIfTabbed);

    // TODO: add arrow keys after tabbing to allow them to focus and then select an item from this!
  });
  // #endregion

  const getSelectDisplay = () => {
    const defaultValue = value?.value ? value.label : placeholder;
    if (multiSelect) {
      if (values?.filter((item: SelectItem) => item.selected).length == 1) return defaultValue;
      return placeholder;
    }

    return defaultValue;
  }

  return (
    <Container className="select-container">
      <Label className="select-label">
        { label }
      </Label>

      <StyledSelect 
        name={name} id={selectId} 
        value={value?.value} type="button" 
        
        ref={selectElementRef}
        onFocus={(e) => onFocus && onFocus(e)}
        onClick={(e) => onClickSelect(e)}
        onBlur={(e) => onBlur && onBlur(e)}
        disabled={disabled}
        className={`select-base group
          ${!disabled && dropdownOpen ? 'select-focus' : ''}
          ${getError() ? 'select-error' : ''}
        `}
      >
        <CurrentlySelected className={`currently-selected`}>
          <span className={`text-sm ${value?.value ? 'text-colors' : 'placeholder-text'}`}> 
            { getSelectDisplay() } 
          </span>

          <TooltipIcons
            onMouseEnter={() => show?.(tooltipContent)}
            onMouseLeave={() => hide?.()} 
            className={`row gap-1 items-center justify-end`
          }>
            { getError() ? <Icon variant='Error' styles='size-4 error-text' />
            :                        <Icon variant='InfoBox' styles='size-4 cursor-pointer' /> }
            <Icon variant='SelectArrow' styles={`select-i-arrow ${getError() ? 'error-text' : ''}`} />
          </TooltipIcons>
        </CurrentlySelected>
      </StyledSelect>

			
      <Dropdown
        onMouseEnter={e => onMouseEnter && onMouseEnter(e)}
        onMouseLeave={e => onMouseLeave && onMouseLeave(e)}
        ref={dropdownElementRef}
        id={dropdownId} className={`select-dropdown
          ${dropdownOpen ? 'select-dd-open' : 'select-dd-closed'}
          ${getError() ? 'select-dd-error' : ''}
          ${!disabled ? 'select-dd-scroll' : 'select-dd-disabled'}
      `}>			
        <DropdownAnim className={`height-trans ${dropdownOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className={`height-trans-content`}>
            {values.map((item: SelectItem, index: number) => 
              <SelectItemComponent 
                item={item}
                index={index}
                onSelect={onDropdownItemSelected} 
                currentSelectValue={value}
                multiSelect={multiSelect}
                name={name}
                dropdownOpen={dropdownOpen}
                key={`${name}-${item.value}`}
              />
            )}
          </div>
        </DropdownAnim>
      </Dropdown>

      <ErrorAndDescription className={`pl-1 mt-2 height-trans ${description || getError() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
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
const TooltipIcons = styled.div``;
const ErrorAndDescription = styled.div``;
