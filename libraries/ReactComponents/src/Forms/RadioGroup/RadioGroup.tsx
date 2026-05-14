import { ChangeEvent, useCallback, useRef } from 'react';
import { RadioGroupItem } from './RadioItem/RadioItem';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';

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
		
	/** Only used if you want custom state handling in favor of using react hook forms. */
  currentValue: RadioItem;
		
	/** An optional event function you can use alongside Rhf. If you're handling your own state, handle it here. */
  onSelect: (item: RadioItem, currentValue: RadioItem, e: ChangeEvent<HTMLInputElement>) => void;

	// Form validation	
	/** The error message, if there is one. */
  error?: boolean;
		
	/** Whether this input is disabled. */
  disabled?: boolean;
		
	/** Whether this input is required. */
  required?: boolean;
}
	
/** Data associated with a radio item. handles both it's value and display. */
export interface RadioItem {	
	/** The value for this specific radio input. */
  value: string;
		
	/** The RadioItem's individual label. */
  label: string;
		
	/** The RadioItem's individual optional description. */
  description?: string;
		
	/** Whether you want this specific RadioItem to be disabled in certain scenarios. */
  disabled?: boolean;
}


export const RadioGroup = ({
  variant = 'default', name, label, description,
  radioItems, currentValue, onSelect, 
  error = false, errorMessage, disabled = false, required = false,
  onBlur, onFocus, onClick, onMouseEnter, onMouseLeave
}: UniversalEventHandlers & RadioGroupProps) => {
  const currentValRef = useRef(currentValue); // Prevent rerenders on memoized child
  currentValRef.current = currentValue; 
  
  const radioItemSelected = useCallback((item: RadioItem, e: ChangeEvent<HTMLInputElement>) => {
    onSelect(item, currentValRef.current, e);
  }, [onSelect]);

  // Get functions
  const getError = (): boolean => !!error && !disabled;

  return (
    <Container className={`radio-group 
      ${disabled ? 'radio-group-disabled' : ''}
      ${getError() ? 'radio-group-error' : ''} 
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
          <RadioGroupItem
            variant={variant}
            inputName={name}
            key={`rgi-${name}-${item.value}`}
            
            value={item}
            checked={currentValue.value == item.value}
            onSelect={radioItemSelected}
            
            disabled={disabled ? true : item.disabled}
            error={error}

            onBlur={onBlur}
            onFocus={onFocus}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      </RadioItems>

      <ErrorText show={getError()} styles='pt-2' cStyles='error-text'>
        { errorMessage ? errorMessage : '' } &nbsp;
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
