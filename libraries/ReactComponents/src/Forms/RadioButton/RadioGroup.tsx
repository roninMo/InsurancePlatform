import styled from '@emotion/styled';

import styles from './RadioGroup.module.scss';
import { RadioGroupItem } from './RadioItem/RadioItem';
import { InputEventHandlers } from '@Project/ReactComponents';
import { useId } from 'react';


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
}: InputEventHandlers & RadioGroupProps) => {
  const id = useId();

  const radioItemSelected = (item: RadioItem, index: number) => {
    // console.log(`\nA radio item was selected: `, {item, index});
    onSelect(item, index, currentValue);
  }

  return (
    <Container className={`w-full colStart justify-start gap-2 ${getErrorThemes(error, disabled)}`}>

      {/* Radio Button Label w/description */}
      { (label || description) && 
        <TextContainer className={`colStart gap-1 mb-4`}>
          { label && 
            <Label>{ label }</Label>
          }
          
          { description && 
            <Description>{ description }</Description>
          }
        </TextContainer>
      }

      {/* Radio Items */}
      <div className={rowStyleVariants.includes(variant) ? 'rowStart gap-1' : 'colStart *:pb-4'}>
        { radioItems.map((item: RadioItem, index: number) =>
          <RadioGroupItem
            checked={currentValue.value == item.value}
            // TODO: this click event should encompass the whole radio item, at least including the label
            onSelect={(item: RadioItem, index: number) => radioItemSelected(item, index)}
            value={item}
            
            inputName={name}
            id={`radioGroupItem-${id}-${item.value}`}
            variant={variant}
            key={`radioGroupItem-${id}-${item.value}`}
            index={index}
            
            disabled={disabled ? true : item.disabled}
            error={error}
            // TODO: We need better visuals for when there's error

            onBlur={onBlur}
            onFocus={onFocus}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      </div>

      {/* Error message */}
      { error && 
        <Description className={`pt-2`}>
          { errorMessage }
        </Description>
      }
    </Container>
  );
}


// Styles
const Container = styled.div``;
const TextContainer = styled.div``;
const Description = styled.p``;
const Label = styled.label``;

// TODO: use style css directives for handling error text themes globally
const errorStyles = `[&>label]:error-text [&>p]:error-text`;
const disabledStyles = `[&>label]:disabled-text [&>p]:disabled-text`;

const getErrorThemes = (error: boolean, disabled: boolean): string => {
  let classes = ``;
  
  if (error) classes += errorStyles;
  else if (disabled) classes += disabledStyles;
  return classes;
}


// Radio items layout
const rowStyleVariants = ['default'];
