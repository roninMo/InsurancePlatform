import { ChangeEvent, FocusEvent, MouseEvent, useEffect, useReducer, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
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
  const selectOrder = useRef<Record<number, string>>({ 0: '' });
  
  // Input binding logic
  const isRhfMode = !disableHookForms;
  const { field } = useController({name}) || {};
  const { getValues } = useFormContext() || {};
  
  
  /** 
   * Retrieves the selected values with proper typing based on whether it's a single or multi select input.  
   * 
   * ---
   * This function uses getValues instead of field.value for state that's in sync. If you're using custom state
   * instead of Rhf, it retrieves it's selected values from the values array.  
   * 
   * ### Example
   * ```ts
   * 
   * // Default Select  
   * const currentlySelected: string | undefined = getSelectedValues(); 
   * 
   * // MultiSelect variant
   * const selectedValues: string[] | undefined = getSelectedValues<true>();
   * 
   * ```
   * ---
   * @template {boolean} [MultiSelect=false] - Whether to return an array of values.
   * @returns the form value or values (string | string[]) based on whether it's a multiSelect
  */
  const getSelectedVals = <MultiSelect extends boolean = false>(): 
    MultiSelect extends true 
      ? string[] | undefined 
      : string   | undefined => 
  {
    const mSl = (multiSelect as MultiSelect) || false;
    let formValues: any = undefined;
    
    // React hook forms / Custom State override 
    if (isRhfMode) {
      // formValues = field.value; // Stale reference
      formValues = Array.isArray(getValues(name)) ? [...getValues(name)] : getValues(name);
    } else {
      const selected = values.filter(i => i.selected).map(i => i.value);
      formValues = mSl ? selected : selected?.[0];
    }
    
    return formValues as MultiSelect extends true ? string[] | undefined : string | undefined;
  }
  
  /** Used for rerendering SelectItem via @see getValues() */
  const isSelected = (item: SelectItem): boolean => {
    if (multiSelect) return !!getSelectedVals<true>()?.includes(item.value);
    return getSelectedVals() == item.value;
  }
  
  
  // Render and state
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  // console.log(`\n\nRerendered ${name}: isRhfMode(${isRhfMode}), \n data: `, 
  //   isRhfMode ? multiSelect ? Array.isArray(getSelectedVals<true>()) 
  //     ? getSelectedVals<true>()?.sort() : getSelectedVals<true>()
  //     : getSelectedVals() 
  //   : values.filter(item => item.selected),
  //   `\n selected from : `, { vals: values.map(i => i.value) }
  // );
  
  /** Handles changeEvents, open/close dropdown logic, and state synchronization for display purposes. */
  const handleOnChange = (selected: SelectItem) => {
    // By default, this component should handle it's own rerenders
    // And onSelect / onChange shouldn't inherently cause hierarchical rerenders
    if (!multiSelect) for (let index in values) values[index].selected = false;
    selected.selected = !selected.selected;  // native-like !nonRender ref update
    
    const selVal = { ...selected }; // new reference
    const wasSelected = selVal.selected;
    // console.log(`handleOnChange(${selected.value}) ${wasSelected ? 'selected' : 'unselected'}`, selVal,
    //   `\nselectedValues on start: `, getSelectedVals(),
    //   `\nfieldValues on start: `, field.value
    // );
    
    // react hook forms event
    if (isRhfMode && field) {
      // MultiSelect - Add/Remove to the currently selected items
      if (multiSelect) {
        let currVals = getSelectedVals<true>() || [];
        let newVals: string | string[] | undefined; 
        
        // Add or remove the value from the array
        if (wasSelected) {
          newVals = [...currVals, selVal.value];
        } else {
          newVals = currVals.filter(val => val != selVal.value);
          // console.log(`removing ${selVal.value}: `, newVals);
        }
        
        field.onChange(newVals);
        // console.log(
        //   `${selVal.value} ${selVal.selected ? 'selected' : 'unselected'}, newValues: `, newVals,
        //   `\nfieldValues/getSelectedVals(): `, getSelectedVals<true>(),
        //   `\nCurrent SelectOrder: `, selectOrder.current
        // );
      }
      
      // Single Select logic (overwrite)
      else {
        field.onChange(wasSelected ? selVal.value : undefined);
        // console.log(`Single Select:: ${selVal.value} ${wasSelected ? 'selected' : 'unselected'}, data: `, selVal);
      }
    }
    
    // This component should handle rerenders internally. If the dropdown is kept open, we must rerender for state changes
    if ((!isRhfMode && field)) {
      if (  keepDropdownOpenOnSelect 
        || (multiSelect && keepDropdownOpenOnSelect)
        || (multiSelect && keepDropdownOpenOnSelect === undefined)
      ) { 
          // console.log('forcing a rerender');
          forceUpdate();
      }
    }
    
    // additional event hooks and custom state override
    const targetData: any = { target: { value: selVal.value }};
    if (onSelect) onSelect(selVal); // actual logic & optional custom state handling
    if (onChange) onChange(targetData); // optional union prop events // TODO: Finish plugging UniversalEventHandlers into the rest of the components
    
    // open / close logic
    handleDropdownToggle();
    
    // persistent state for displayed selected items
    updateSelectionOrder(selVal);
  }
  
  /** React hook forms and additional onBlur event binding */
  const handleOnBlur = (e: FocusEvent<HTMLButtonElement>) => {
    if (isRhfMode && field) field.onBlur();
    if (onBlur) onBlur(e);
  }
  
  /** Keeps track of the order of selected items for proper display with multiSelects */
  const updateSelectionOrder = (selVal: SelectItem) => {
    const wasSelected = selVal.selected;
    
    /* 
      * setCurrentlySelected() - keep track of the last selected item: increment fifo
      ?   - add a new item to the stack
      ?   - removes the item, and decrements every number after it
    */
    if (multiSelect) {
      let newOrder: Record<number, string> = { ...selectOrder.current };
      const nextInList = Object.values(selectOrder.current).filter(v => !!v).length; 
      let decrementStartingPoint = -1;
      // console.log(`-------------------------`,
      //   `\nselectOrder logic - nextInList(${nextInList}), currentOrder: `, selectOrder.current
      // );
      
      // increment add to last of array
      if (wasSelected) {
        newOrder[nextInList] = selVal.value;
        // console.log(`adding ${selVal.value} to index ${nextInList}, updatedList: `, newOrder);
      } else { // Decrement - find the starting point, decrement all values from then 
        for (let i = 0; i < values.length; i++) {
          const value = newOrder[i];
          if (decrementStartingPoint == -1 && value == selVal.value) {
            decrementStartingPoint = i;
            newOrder[i] = '';
            // console.log(`decrement starting index: ${i}`);
          }
          
          // decrement everything else 
          if (i >= decrementStartingPoint && decrementStartingPoint != -1) {
            newOrder[i] = newOrder?.[i + 1] || '';
            // console.log(`updating ${i} to ${newOrder?.[i + 1] || ''}`);
          }
        }
      }
      
      // update the hash table
      selectOrder.current = newOrder;
      // console.log(`Selection order finished: `,
      //   `\nprevious: `, selectOrder.current,
      //   `\ncurrent: `, newOrder,
      // );
    }
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
      const element = e.target as HTMLElement;
      if (!element) {
        setDropdownOpen(false);
        return;
      }
      
      // Direct ref checks are dramatically faster than DOM string scanning (.closest)
      const isInsideSelect = selectElementRef.current?.contains(element);
      const isInsideDropdown = dropdownElementRef.current?.contains(element);
      if (!isInsideSelect && !isInsideDropdown) {
        setDropdownOpen(false);
      if (isRhfMode && field) field.onBlur();
      }
    };
    
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen, isRhfMode, field]);
  
  
  // for closeDropdownOnLeave: Closes the dropdown when hovers outside of it 
  useEffect(() => {
    // If the dropdown is closed or this option isn't enabled don't add the event
    if (!dropdownOpen || !closeDropdownOnLeave) {
      return;
    }
    
    // Calculate the bounding box once @see HeightTransWrapper()'s animation is finished
    let isAnimationComplete = false;
    let cachedMinLeft = 0;
    let cachedMaxRight = 0;
    let cachedMinTop = 0;
    let cachedMaxBottom = 0;
    
    // Lock the layout dimensions after your animation duration finishes (e.g., 300ms)
    const animationTimer = setTimeout(() => {
      const select = selectElementRef.current;
      const dropdown = dropdownElementRef.current;
      
      // check if the mouse is inbetween the select and the dropdown (margin edge case)
      if (select && dropdown) {
        const selectRect = select.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        
        cachedMinLeft = Math.min(selectRect.left, dropdownRect.left);
        cachedMaxRight = Math.max(selectRect.right, dropdownRect.right);
        cachedMinTop = Math.min(selectRect.top, dropdownRect.top);
        cachedMaxBottom = Math.max(selectRect.bottom, dropdownRect.bottom);
        isAnimationComplete = true;
      }
    }, 300);
    
    
    // Handle closing the dropdown when leaving the select
    const handleMouseOver = (e: globalThis.MouseEvent) => {
      const select = selectElementRef.current;
      const dropdown = dropdownElementRef.current;
      if (!select || !dropdown) { // error prevention
        return;
      }
      
      // Check if we're hovering the element
      const element = e.target as HTMLElement;
      if (!element) return; // validity
      if (select.contains(element) || dropdown.contains(element)) return; // pointer verification
      // else console.log(`${name}: mouse hovering select(${select.contains(element)}, dropdown(${dropdown.contains(element)}))`);
      
      // Calculate the animated bounding box or used the cached values
      let minLeft, maxRight, minTop, maxBottom;
      if (isAnimationComplete) { // TODO: should we event try to close while it's opening?
        minLeft = cachedMinLeft;
        maxRight = cachedMaxRight;
        minTop = cachedMinTop;
        maxBottom = cachedMaxBottom;
      } else {
        // check if the mouse is inbetween the select and the dropdown (margin edge case)
        const selectRect = select.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        
        minLeft = Math.min(selectRect.left, dropdownRect.left);
        maxRight = Math.max(selectRect.right, dropdownRect.right);
        minTop = Math.min(selectRect.top, dropdownRect.top);
        maxBottom = Math.max(selectRect.bottom, dropdownRect.bottom);
      }
      
      // Create a virtual "bounding box" that spans from the top of the select 
      // to the bottom of the dropdown and covers their width.
      const isInsideVirtualBox = 
        e.clientX >= minLeft && 
        e.clientX <= maxRight && 
        e.clientY >= minTop && 
        e.clientY <= maxBottom;
        
      // console.log(`${name}: mouse isInsideBounds(${isInsideVirtualBox})`);
      if (!isInsideVirtualBox) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mouseover', handleMouseOver);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      clearTimeout(animationTimer);
    }
  }, [dropdownOpen, closeDropdownOnLeave]);
  
  
  // Open the dropdown when the user tabs to it
  useEffect(() => {
    const selectElement = selectElementRef.current;
    if (preventOpenOnTabFocus || !selectElement) return;
    
    // tabbed / keyboard nav to focus the element
    const checkIfTabbed = (event: globalThis.FocusEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;
      
      // Wait for the browser to finish applying pseudo classes
      requestAnimationFrame(() => target.matches(':focus-visible') && setDropdownOpen(true))
    }
    
    selectElement.addEventListener('focus', checkIfTabbed);
    return () => selectElement.removeEventListener('focus', checkIfTabbed);
    // TODO: add arrow keys after tabbing to allow them to focus and then select an item from this.
  }, [preventOpenOnTabFocus]);
  // #endregion
  
  // Return a list of the selected items, or the currently selected
  const getSelectDisplay = () => {
    if (multiSelect) {
      const selectionOrder = Object.values(selectOrder.current).filter(i => !!i);
      return selectionOrder && selectionOrder.length !== 0 ? selectionOrder.join(', ') : placeholder;
    }
    
    // find the currently selected
    const val = getSelectedVals();
    if (Array.isArray(val)) placeholder; // Error scenario, just return placeholder
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
