import styled from '@emotion/styled';

import styles from './RadioGroup.module.scss';
import { RadioGroupItem } from './RadioItem/RadioItem';
import { EventHandlers } from '@Project/ReactComponents';


export type RadioVariant = 'default' | 'column' | 'columnInline' | 'list' | 'table' | 'tableInline' | 'boxes';
export interface RadioGroupProps {
  variant?: RadioVariant;
  id: string;
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

  aria?: string;
}

export interface RadioItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}


export const RadioGroup = ({
  variant = 'default', id, name, label, description,
  radioItems, currentValue, onSelect, 
  error = false, errorMessage, disabled = false, required = false, aria,
  onBlur, onFocus, onClick, onMouseEnter, onMouseLeave
}: EventHandlers & RadioGroupProps) => {
  
  const radioItemSelected = (item: RadioItem, index: number) => {
    // console.log(`\nA radio item was selected: `, {item, index});
    onSelect(item, index, currentValue);
  }

  return (
    <Container className={`w-full colStart justify-start gap-2 ${getErrorThemes(error, disabled)}`} aria-describedby={aria}>

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
      <div className={rowStyleVariants.includes(variant) ? rowLayout : columnLayout}>
        { radioItems.map((item: RadioItem, index: number) =>
          <RadioGroupItem
            checked={currentValue.value == item.value}
            onSelect={(item: RadioItem, index: number) => radioItemSelected(item, index)}
            value={item}
            
            inputName={name}
            id={`radioGroupItem-${id}-${item.value}`}
            variant={variant}
            key={`radioGroupItem-${id}-${item.value}`}
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
const columnLayout = `colStart gap-2`;
const rowLayout = `rowStart gap-2`;

// has-checked: <> <radio> </>
// checked:
