import { ChangeEvent, useReducer, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';
import { RadioGroupItem } from './RadioItem/RadioItem';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './RadioGroup.module.scss';


/** default is like the native, column is a block layout, and list has dividers and a different alignment. */
export type RadioVariant = 'default' | 'column' | 'columnInline' | 'list';


/** The RadioGroup's props */
export interface RadioGroupProps {	
	/** default is like the native, column is a block layout, and list has dividers and a different alignment. */
  variant?: RadioVariant;
  
	/** The form group's name, used in Rhf's register function. */
  name: string;
  
	/** The Radio Group's label. */
  label?: string;
  
	/** The Radio Group's description. */
  description?: string;
  
	// Information and handling	
	/** Each contain's it's value, label, description, and optionally whether it's disabled */
  radioItems: RadioItem[];
  
	/** An optional event function you can use alongside Rhf. If you're handling your own state, handle it here. */
  onSelect?: (e: ChangeEvent<HTMLInputElement>, selected: RadioItem) => void;
  
  /** Whether we should use custom state handling instead of React hook forms. */
  disableHookForms?: boolean;
  
	// Form validation	
	/** The error message, if there is one. */
  error?: string;
  
	/** Whether this input is disabled. */
  disabled?: boolean;
  
	/** Whether this input is required. */
  required?: boolean;
}


/** Data associated with a radio item. handles both it's value and display. */
export interface RadioItem {	
	/** The value for this specific radio input. */
  value: string;
  
  /** Whether this value is currently selected. */
  selected?: boolean;
  
	/** The RadioItem's individual label. */
  label: string;
  
	/** The RadioItem's individual optional description. */
  description?: string;
  
	/** Whether you want this specific RadioItem to be disabled in certain scenarios. */
  disabled?: boolean;
}


export const RadioGroup = ({
  variant = 'default', name, label, description,
  radioItems, onSelect, disableHookForms, 
  error, disabled = false, required = false, 
  onBlur, onFocus, onClick, onMouseEnter, onMouseLeave
}: UniversalEventHandlers & RadioGroupProps) => {
  const { getValues, watch } = useFormContext() || {};
  const formValues = getValues(name); // watch && watch(name);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  /** Handle even updates from user interaction */
  const handleOnSelected = (e: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
    // By default, this component should handle it's own rerenders
    // And onSelect / onChange shouldn't inherently cause hierarchical rerenders
    radioItems.forEach(item => { item.selected = false; });
    selected.selected = true; // native-like event update
    const newVal = { ...selected }; // new reference
    
    // console.log(`groupHandleOnChange: ${!disableHookForms ? 'forceUpdate() - ' : ''} Just selected ${newVal.value}`, selected);
    if (disableHookForms) forceUpdate(); // update the display
    if (onSelect) onSelect(e, newVal); // optional event logic
  }
  
  /** Uses rhf's capture values, or the reference passed in for determining whether the radio item's been selected. */
  const isSelected = (item: RadioItem): boolean => {
    if (!disableHookForms) {
      const currentlySelected = formValues;
      if (currentlySelected == item.value) return true;
    }
    
    // default behavior
    // else return currentlySelected == item.value;
    else {
      const index = radioItems.findIndex(val => val.value == item.value);
      if (index != -1) return !!radioItems[index].selected;
    }
    return false;
  }
  
  // console.log(`\n\nRerendered ${name}: isRhfMode(${!disableHookForms}), \n data: `, 
  //   !disableHookForms ? formValues : radioItems.filter(item => item.selected)?.[0] || [],
  //   `\n selected from : `, radioItems,
  // );
  
  
  return (
    <Container className={`radio-group 
      ${disabled ? 'radio-group-disabled' : ''}
      ${(!!error && !disabled) ? 'radio-group-error' : ''} 
    `}>
      {/* Label and Description */}
      { (label || description) && 
        <div className={`colStart gap-1 mb-4`}>
          { label && <Label>{ label }</Label> }
          { description && <Description>{ description }</Description> }
        </div>
      }
      
      <RadioItems className={rowStyleVariants.includes(variant) ? 'rowStart gap-1 flex-wrap' : 'colStart *:pb-4'}>
        { radioItems.map((item: RadioItem) =>
          <RadioGroupItem key={`rgi-${name}-${item.value}`}
            inputName={name} variant={variant}
            value={item} onSelect={handleOnSelected}
            selected={isSelected(item)}
            
            required={required}
            disabled={disabled ? true : item.disabled}
            isRhfMode={!disableHookForms}
            
            // Optional Events
            onFocus={onFocus} onClick={onClick} onBlur={onBlur}
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
          />
        )}
      </RadioItems>
      
      <ErrorText show={(!!error && !disabled)} styles='pt-2' cStyles='error-text'>
        { error ? error : '' } &nbsp;
      </ErrorText>
    </Container>
  );
}


// Styles
const Container = styled.div``;
const Description = styled.p``;
const Label = styled.label``;
const RadioItems = styled.div``;
const ErrorText = styled(Ht)``;

// Radio items layout
const rowStyleVariants = ['default'];
