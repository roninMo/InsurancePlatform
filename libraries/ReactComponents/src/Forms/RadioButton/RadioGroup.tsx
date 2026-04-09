import { useId } from 'react';
import { UniversalEventHandlers } from '@Project/ReactComponents';
import { RadioGroupItem } from './RadioItem/RadioItem';

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
  onSelect: (item: RadioItem, index: number, currentValue: RadioItem) => void;

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
  const id = useId();

  const radioItemSelected = (item: RadioItem, index: number) => {
    onSelect(item, index, currentValue);
  }

  return (
    <Container className={`radio-group ${disabled ? 'radio-group-disabled' : error ? 'radio-group-error' : ''} `}>
      { (label || description) && 
        <div className={`colStart gap-1 mb-4`}>
          { label && <Label>{ label }</Label> }
          { description && <Description>{ description }</Description> }
        </div>
      }

      <RadioItems className={rowStyleVariants.includes(variant) ? 'rowStart gap-1' : 'colStart *:pb-4'}>
        { radioItems.map((item: RadioItem, index: number) =>
          <RadioGroupItem
            checked={currentValue.value == item.value}
            onSelect={(item: RadioItem, index: number) => radioItemSelected(item, index)}
            value={item}
            
            inputName={name}
            variant={variant}
            key={`rgi-${name}-${item.value}-${index}-${id}`}
            index={index}
            
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

      { (error && !disabled) && 
        <ErrorText className={`pt-2 error-text`}>
          { errorMessage }
        </ErrorText>
      }
    </Container>
  );
}


// Styles
const Container = styled.div``;
const Description = styled.p``;
const Label = styled.label``;
const RadioItems = styled.div``;
const ErrorText = styled.div``;

// Radio items layout
const rowStyleVariants = ['default'];
