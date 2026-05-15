import { ChangeEvent, FocusEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';
import { SelectItemComponent, SelectItem } from './SelectItem/SelectItem';
import { mapRecord, TooltipContentProps, TooltipContextActions } from "../../Common";
import { Icon, IconTypes } from '../../Common/Icons/Icon';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './Select.module.scss';


export interface SelectProps {
  /** The form name of the select. Used with Rhf's register or useController in this case. */
  name: string;

  /** Whether this is a multiselect component. */
  multiSelect?: boolean;

  /** The label of the select. */
  label: string;

  /** The description of the select. */
  description?: string;

  /** The placeholder text for the select. */
  placeholder?: string;


  // Input handling
  /** @note must be memoized. Updates to this overrides the current tracking of selected values when using Rhf. */
  values: SelectItem[];

  /** Additional logic to run when the user selects a value. If you're not using Rhf, this is how you update the value. */
  onSelect?: (selected: SelectItem) => void;

  /** Whether we should use custom state handling instead of React hook forms. */
  disableHookForms?: boolean;


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
  name, multiSelect, label, description, placeholder,
  values, onSelect, disableHookForms, error, disabled, required, 
  onBlur, onChange, onFocus, onClick, onMouseEnter, onMouseLeave,
  tooltipContext, tooltipContent, 
  closeDropdownOnLeave, keepDropdownOpenOnSelect, preventOpenOnTabFocus, 
}: SelectProps & UniversalEventHandlers) => {
  const { show, hide } = tooltipContext || {};  

  // Input binding logic
  const isRhfMode = !disableHookForms;
  const { field, fieldState } = useController({name}) || {};

  // Values are stored as a string by default, or an array of strings for multiSelects
  const getSelectedVals = <MultiSelect extends boolean = false>(): 
    MultiSelect extends true 
      ? string[] | undefined 
      : string   | undefined => 
  {
    const mSl = (multiSelect as MultiSelect) || false;
    let formValues: any = undefined;

    // React hook forms / Custom State override 
    if (isRhfMode) formValues = field.value;
    else {
      const selected = values.filter(i => i.selected).map(i => i.value);
      formValues = mSl ? selected : selected?.[0];
    }

    return formValues as MultiSelect extends true ? string[] | undefined : string | undefined;
  }

  const isSelected = (item: SelectItem): boolean => {
    if (multiSelect) return !!getSelectedVals<true>()?.includes(item.value);
    return getSelectedVals() == item.value;
  }

  // we need last selected item, and since the updates are batched alongside the watch, we're adding a state variable
  const [currentlySelected, setCurrentlySelected] = useState<SelectItem>();
  const selectOrder = useRef<Record<number, string>>({ 0: '' });
  console.log(`\n\nisRhfMode: ${isRhfMode}, data: `, { currentlySelected, selectedVals: getSelectedVals(), values }, field);

  // Intercept changes cleanly
  const handleOnChange = (selected: SelectItem) => {
    const updatedVal = { ...selected, selected: !isSelected(selected) };
    const wasSelected = updatedVal.selected;

    // react hook forms event
    if (isRhfMode && field) {
      // Add/Remove to the currently selected items
      if (multiSelect) {
        let newVals = getSelectedVals<true>() || [];
        const includesClickedVal = newVals.includes(updatedVal.value);
        console.log(`\nMultiSelect(): update field value `, { includesClickedVal, wasSelected, currentVals: newVals });

        if (wasSelected && !includesClickedVal) newVals.push(updatedVal.value);
        else if (includesClickedVal && !wasSelected) {
          newVals = newVals.filter(val => val != updatedVal.value);
          console.log(`removing ${updatedVal.value}: `, newVals.filter(val => val != updatedVal.value));
        }

        console.log(`${selected.value} ${updatedVal.selected ? 'selected' : 'unselected'}, new field values: `, newVals);
        field.onChange(newVals);
      }

      // Single Select logic
      else {
        console.log(`\nHandleOnChange(): `, wasSelected, updatedVal);
        field.onChange(wasSelected ? updatedVal.value : undefined);
      }
    }
    
    // additional event hooks and custom state override
    const targetData: any = { target: { value: updatedVal.value }};
    if (onSelect) onSelect(updatedVal); // actual logic
    if (onChange) onChange(targetData); // optional union prop events // TODO: Finish plugging UniversalEventHandlers into the rest of the components
    
    handleDropdownToggle();
    // console.log(`${updatedVal.label} selected: ${updatedVal.selected}, data: `, {updatedVal, values: getItems() });


    /* 
      * setCurrentlySelected() - keep track of the last selected item: increment fifo
      ?   - add a new item to the stack
      ?   - removes the item, and decrements every number after it
    */
    if (multiSelect) {
      // Increment / Decrement logic
      let newOrder: Record<number, string> = { ...selectOrder.current };
      const nextInList = (getSelectedVals<true>()?.length || 0);
      let decrementStartingPoint = 0;

      if (wasSelected) newOrder[nextInList] = updatedVal.value;
      else {
        // Decrement - find the starting point 
        for (let i = 0; i < values.length; i++) {
          const value = newOrder[i];
          if (decrementStartingPoint == 0 && value == updatedVal.value) {
            decrementStartingPoint = i;
            // console.log('decrement starting point')
          }
          
          // decrement everything else 
          if (i >= decrementStartingPoint) {
            newOrder[i] = newOrder?.[i + 1] || '';
          }
        }
      }

      // update the hash table
      selectOrder.current = newOrder;
    }

    // This is the most recently selected value - used this to check if the value was updated / removed
    setCurrentlySelected(updatedVal);
    // if (multiSelect) setCurrentlySelected(values.filter(item => item.value == selectOrder.current[0])[0])
    // else setCurrentlySelected(wasSelected ? updatedVal : undefined);
    console.log(`new selection order`, selectOrder.current);
  }

  const handleOnBlur = (e: FocusEvent<HTMLButtonElement>) => {
    if (isRhfMode && field) field.onBlur();
    if (onBlur) onBlur(e);
  }

  // Get functions
  const getError = (): boolean => !!error && !disabled;


  //------------------------------------//
  // Open / Close Dropdown Logic        //
  //------------------------------------//
  // #region Open / Close Dropdown
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownId = `${name}-slct-dropdown`;
  const selectId = `${name}-slct`;
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
  }, []);
  // #endregion

  // Return a list of the selected items, or the currently selected
  const getSelectDisplay = () => {
    if (multiSelect) {
      const vals = getSelectedVals<true>();
      return vals && vals.length !== 0 ? vals.join(', ') : placeholder;
    }

    // find the currently selected
    const val = getSelectedVals();
    return val ? val : placeholder;
  }


  return (
    <Container className="select-container">
      <Label className="select-label">
        { label }
      </Label>

      <StyledSelect 
        name={name} id={selectId} 
        type="button" ref={selectElementRef}
        onBlur={handleOnBlur} // useController event
        onClick={onClickSelect} // Open/Close Dropdown
        onFocus={onFocus} disabled={disabled}
        className={`select-base group
          ${!disabled && dropdownOpen ? 'select-focus' : ''}
          ${getError() ? 'select-error' : ''}
        `}
      >
        <CurrentlySelected className={`currently-selected`}>
          <span className={`text-sm ${getSelectedVals() != undefined ? 'text-colors' : 'placeholder-text'}`}> 
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
          {values.map((item: SelectItem) => 
            <SelectItemComponent 
              item={item} name={name}
              handleItemSelected={handleOnChange} 
              isSelected={isSelected(item)} // primarily handles memoized select rerenders
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


/*
  * Suggested fixes for performance reasons

{
    // ==========================================
    // Open / Close Dropdown Logic (Optimized)
    // ==========================================

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const dropdownId = `${name}-slct-dropdown`;
    const selectId = `${name}-slct`;
    const selectElementRef = useRef<HTMLButtonElement>(null);
    const dropdownElementRef = useRef<HTMLDivElement>(null);

    // Open the dropdown if they have clicked the select element
    const onClickSelect = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      if (onClick) onClick(e);
      if (!dropdownOpen) setDropdownOpen(true);
    };

    const handleDropdownToggle = () => {
      const keepDropdownOpen = keepDropdownOpenOnSelect;
      
      // Default behavior
      if (keepDropdownOpen === undefined) {
        if (!multiSelect && dropdownOpen) setDropdownOpen(false);
      } else {
        // If the user wants the dropdown to stay open on select, do so
        if (keepDropdownOpen === true) return;
        if (dropdownOpen) setDropdownOpen(false);
      }
    };

    // Fix 1 & 3: Optimized click outside listener
    useEffect(() => {
      if (!dropdownOpen) return;

      const handleOutsideClick = (e: globalThis.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target) {
          setDropdownOpen(false);
          return;
        }

        // Direct ref checks are dramatically faster than DOM string scanning (.closest)
        const isInsideSelect = selectElementRef.current?.contains(target);
        const isInsideDropdown = dropdownElementRef.current?.contains(target);

        if (!isInsideSelect && !isInsideDropdown) {
          setDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [dropdownOpen]); // Only runs when open state flips

    // Fix 2: Optimized hover outside listener
    useEffect(() => {
      if (!dropdownOpen || !closeDropdownOnLeave) return;

      const handleMouseOver = (e: globalThis.MouseEvent) => {
        const select = selectElementRef.current;
        const dropdown = dropdownElementRef.current;
        if (!select || !dropdown) return;

        const element = e.target as HTMLElement;
        
        // Direct node validation
        const isWithinSelect = select.contains(element);
        const isWithinDropdown = dropdown.contains(element);
        if (isWithinSelect || isWithinDropdown) return;

        // Virtual bounding box calculations
        const selectRect = select.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        const compBounds = (
          e.clientX >= Math.min(selectRect.left, dropdownRect.left) &&
          e.clientX <= Math.max(selectRect.right, dropdownRect.right) &&
          e.clientY >= Math.min(selectRect.top, dropdownRect.top) &&
          e.clientY <= Math.max(selectRect.bottom, dropdownRect.bottom)
        );

        if (!compBounds) {
          setDropdownOpen(false);
        }
      };

      document.addEventListener('mouseover', handleMouseOver);
      return () => document.removeEventListener('mouseover', handleMouseOver);
    }, [dropdownOpen, closeDropdownOnLeave]);

    // Fix 4: Solved infinite event registration bug
    useEffect(() => {
      const selectElement = selectElementRef.current;
      if (preventOpenOnTabFocus || !selectElement) return;

      const checkIfTabbed = (event: globalThis.FocusEvent) => {
        const target = event.target as HTMLElement;
        if (target.matches(':focus-visible')) {
          setDropdownOpen(true);
        }
      };

      selectElement.addEventListener('focus', checkIfTabbed);
      
      // ✅ Cleanup now safely locks execution down to mount cycles
      return () => selectElement.removeEventListener('focus', checkIfTabbed);
    }, [preventOpenOnTabFocus]); // Added dependency array to stop rendering loops
}

*/