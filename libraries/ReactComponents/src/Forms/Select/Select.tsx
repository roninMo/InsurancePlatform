import { ChangeEvent, FocusEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';
import { SelectItemComponent, SelectItem } from './SelectItem/SelectItem';
import { TooltipContentProps, TooltipContextActions } from "../../Common";
import { Icon, IconTypes } from '../../Common/Icons/Icon';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './Select.module.scss';


export interface SelectProps {
  /** The label of the select. */
  label: string;

  /** The description of the select. */
  description?: string;

  /** The form name of the select. Used with Rhf's register or useController in this case. */
  name: string;

  /** If you're overriding Rhf with useState, explicitly set the value. You can use the onSelect to handle update events. */
  value?: SelectItem;
  /** Additional logic to run when the user selects a value. If you're not using Rhf, this is how you update the value. */
  onSelect?: (selected: SelectItem) => void;

  /** @note must be memoized. Updates to this overrides the current tracking of selected values when using Rhf. */
  values: SelectItem[];

  /** Whether this is a multiselect component. */
  multiSelect?: boolean;

  /** The placeholder text for the select. */
  placeholder?: string;


  // Error / Validation
  /** The error message, if there's an error. */
  error?: string;

  /** Whether the select component is disabled. */
  disabled?: boolean;

  /** Whether the select component is required. */
  required?: boolean;


  // Tooltip props
  /** The Tooltip Context stable function ref */ 
  tooltipContext?: TooltipContextActions;
  // The content props for the tooltip component
  tooltipContent?: TooltipContentProps; 


  // Select Dropdown Options
  /** when they hover outside of the element, close the dropdown. */ 
  closeDropdownOnLeave?: boolean;
  
  /** for both normal or multiselect. undefined is ignored. */ 
  keepDropdownOpenOnSelect?: boolean;
  
  /** by default, we open the dropdown if the user tabs to it. */ 
  preventOpenOnTabFocus?: boolean;
}


// Custom select component for themes and advanced functionality
export const Select = ({
  name, label, description, value, values, multiSelect, onSelect, placeholder,
  onBlur, onChange, onFocus, onClick, onMouseEnter, onMouseLeave,
  closeDropdownOnLeave, keepDropdownOpenOnSelect, preventOpenOnTabFocus, 
  error, disabled = false, required = false, tooltipContext, tooltipContent, 
}: SelectProps & UniversalEventHandlers) => {
  const { show, hide } = tooltipContext || {};  
  
  // Open / Close dropdown
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownId = `${name}-slct-dropdown`;
  const selectId = `${name}-slct`;

  // Input binding logic
  const isRHFMode = value === undefined;
  const [internalVal, setInternalVal] = useState<SelectItem>({ label: '', value: '', ...value });
  const { field, fieldState } = useController({name}) || {};
  // console.log(`isRhfMode: ${isRHFMode}, data: `, { value, field, fieldState, onSelect });

  // Internal selected values tracking. Overridden when the values prop is updated - CAUTION when using with Rhf
  const internalValues = useRef<SelectItem[]>([ ...values ]);
  useEffect(() => { 
    if (!isRHFMode) return;
    internalValues.current = [ ...values ]; 
  }, [values]);

  // Intercept changes cleanly
  const handleOnChange = (selected: SelectItem) => {
    const updatedVal = { ...selected, selected: !selected.selected };

    // react hook forms event
    if (isRHFMode && field) {
      
      // internal state tracking synced from this event
      internalValues.current = internalValues.current.map(item => {
        if ( item.value == updatedVal.value 
          && item.label == updatedVal.label) return updatedVal;
        return item;
      });
      
      // rerenders on selectItems happen using the currently selected item (value) as reference
      setInternalVal(updatedVal);

      // Rhf's update event
      if (multiSelect) field.onChange(internalValues.current
          .filter(item => item.selected)
          .map(item => item.value)
      );
      else field.onChange(updatedVal.value);
    }
    
    // additional event hooks
    const targetData: any = { target: { value: updatedVal.value }};
    if (onSelect) onSelect(updatedVal); // actual logic
    if (onChange) onChange(targetData); // optional union prop events // TODO: Finish plugging UniversalEventHandlers into the rest of the components
    
    handleDropdownToggle();
    // console.log(`${updatedVal.label} selected: ${updatedVal.selected}, data: `, {updatedVal, values: getValues() });
  }

  const handleOnBlur = (e: FocusEvent<HTMLButtonElement>) => {
    if (isRHFMode && field) field.onBlur();
    if (onBlur) onBlur(e);
  }

  // Get functions
  const getValue = (): SelectItem | undefined => isRHFMode ? internalVal : value;
  const getValues = (): SelectItem[] => isRHFMode ? internalValues.current : values;
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
  
  const handleDropdownToggle = () => {
    const keepDropdownOpen = keepDropdownOpenOnSelect;

    // Default behavior
    if (keepDropdownOpen === undefined) {
      if (!multiSelect && dropdownOpen) setDropdownOpen(false);
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
    const defaultValue = getValue()?.selected ? getValue()?.label || placeholder : placeholder;
    if (multiSelect) {
      if (getValues()?.filter((item: SelectItem) => item.selected).length == 1) return defaultValue;
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
        value={getValue()?.value} type="button" 
        
        ref={selectElementRef}
        onFocus={(e) => onFocus && onFocus(e)}
        onClick={(e) => onClickSelect(e)} // Open/Close Dropdown
        onBlur={handleOnBlur}
        disabled={disabled}
        className={`select-base group
          ${!disabled && dropdownOpen ? 'select-focus' : ''}
          ${getError() ? 'select-error' : ''}
        `}
      >
        <CurrentlySelected className={`currently-selected`}>
          <span className={`text-sm ${getValue()?.value ? 'text-colors' : 'placeholder-text'}`}> 
            { getSelectDisplay() } 
          </span>

          <TooltipIcons
            onMouseEnter={() => tooltipContent && show?.(tooltipContent)}
            onMouseLeave={() => hide?.()} 
            className={`row gap-1 items-center justify-end`
          }>
            {getError() ? <Icon variant='OutlineWarning' styles='input-sub-icon i-err-color' />
                        : <Icon variant='OutlineInfo' styles='input-sub-icon i-default-color' /> }
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
        <DropdownAnim show={dropdownOpen}>
          {getValues().map((item: SelectItem) => 
            <SelectItemComponent 
              item={item} name={name}
              handleItemSelected={handleOnChange} 
              currentValue={getValue()} // primarily handles memoized select rerenders
              multiSelect={multiSelect}
              dropdownOpen={dropdownOpen}
              key={`${name}-${item.value}`}
            />
          )}
        </DropdownAnim>
      </Dropdown>

      <ErrorAndDescription show={!!description || getError()} styles="pl-1 mt-2" cStyles={`text-sm ${getError() ? 'error-text' : 'text-colors'}`}>
        { getError() ? error : description } &nbsp;
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
const DropdownAnim = styled(Ht)``;
const TooltipIcons = styled.div``;
const ErrorAndDescription = styled(Ht)``;
