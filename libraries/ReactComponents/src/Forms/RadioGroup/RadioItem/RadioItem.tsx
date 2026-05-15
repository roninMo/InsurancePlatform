import { ChangeEvent, FocusEvent, memo } from 'react';
import { RadioItem, RadioVariant } from '../RadioGroup';
import { UniversalEventHandlers } from '../../../Common/Utilities/Utils';

import styled from '@emotion/styled';
import styles from './RadioItem.module.scss';
import { useFormContext } from 'react-hook-form';


export interface RadioItemProps {	
	/** Used for handling proper styling from @see RadioGroup */
  variant: RadioVariant;

	/** The form group name for this input/Rhf register's init. */
  inputName: string;

	// Input handling
	/** The value of the RadioItem. not used when using Rhf. */
  value: RadioItem;

	/** Whether this value is the currently selected value. */
  selected: boolean;

	/** OnChange event. used in combination with Rhf, or for handling state your own way. */
  onSelect?: (e: ChangeEvent<HTMLInputElement>, item: RadioItem) => void;

  /** Whether we're using react hook forms to handle input state. */
  isRhfMode?: boolean;

	// form state	
	/** Whether the input is required. */
  required?: boolean;

	/** Whether the input is disabled. */
  disabled?: boolean;
}

export const RadioGroupItem = memo(({ 
  inputName, variant, 
  value, selected, onSelect, isRhfMode, required, disabled,
  onFocus, onChange, onBlur, onClick, onMouseEnter, onMouseLeave
}: RadioItemProps & UniversalEventHandlers) => {
  // Input bindings
  const { register, getValues } = useFormContext() || {};
  const rhfBindings = isRhfMode ? register(inputName) : null;
  // console.log(`isRhfMode: ${isRhfMode}, data: `, { value, rhfBindings, onChange, register });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isRhfMode && rhfBindings) {
      console.log(`calling hook forms change event: ${e?.target?.value} `, e);
      rhfBindings.onChange(e);
    }
      
    if (onChange) onChange(e); // additional optional event @see UniversalEventHandlers
    if (onSelect) onSelect(e, value); // default logic
  }

  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (isRhfMode && rhfBindings) rhfBindings.onBlur(e);
    if (onBlur) onBlur(e);
  }

  // console.log(`${value.label} rerendered: `, value);

  return (
    <label 
      onMouseEnter={e => onMouseEnter && onMouseEnter(e)}
      onMouseLeave={e => onMouseLeave && onMouseLeave(e)}
      className={`
        ${variant == 'default' ? 'radio-item-c-d' : ''}
        ${variant == 'column' ? 'radio-item-c-c' : ''}
        ${variant == 'columnInline' ? 'radio-item-c-c' : ''}
        ${variant == 'list' ? 'radio-item-c-l' : ''}
      `} 
    >
      <input 
        type="radio" id={`${inputName}-${value.value}`}
        value={value.value} 
        disabled={disabled} required={required}
        
        // Rhf or useState handling
        {...(() => {
          if (isRhfMode && rhfBindings) {
            const { onChange: _, onBlur: __, ...rest } = rhfBindings;
            return rest;
          }

          return { checked: selected }; // default logic
        }) ()}
        onChange={handleOnChange}
        onBlur={handleOnBlur}

        // Optional events
        onFocus={e => onFocus && onFocus(e)}
        onClick={e => onClick && onClick(e)}
        className={`radio-button`} 
      />

      <LabelAndDescription className="radio-text">
        <Label className="min-w-max pr-2 radio-t-label"> { value.label } </Label>
        { value.description && 
          <Description className='radio-t-desc'> { value.description } </Description>
        }
      </LabelAndDescription>
    </label>
  );
});


// Styled Components
const Radio = styled.input``;
const LabelAndDescription = styled.div``;
const Label = styled.span``;
const Description = styled.p``;
