import { ChangeEvent, useCallback, useRef } from 'react';
import { RadioGroupItem } from './RadioItem/RadioItem';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';

import styled from '@emotion/styled';
import styles from './RadioGroup.module.scss';


export type RadioVariant = 'default' | 'column' | 'columnInline' | 'list';
export interface RadioGroupProps {
  variant?: RadioVariant;
  name: string;
  label?: string;
  description?: string;

  radioItems: RadioItem[];
  currentValue: RadioItem;
  onSelect: (item: RadioItem, currentValue: RadioItem, e: ChangeEvent<HTMLInputElement>) => void;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface RadioItem {
  value: string;
  label: string;
  description?: string;
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
