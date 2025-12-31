import styled from '@emotion/styled';

import styles from './RadioGroup.module.scss';
import { RadioItem } from './RadioItem/RadioItem';
import { EventHandlers } from '@Project/ReactComponents';


export type RadioVariant = 'default' | 'column' | 'columnInline' | 'list' | 'table' | 'tableInline' | 'boxes';
export interface RadioButtonProps {
  variant?: RadioVariant;
  id: string;
  name: string;
  label?: string;
  description?: string;

  radioItems: RadioItem[];
  value: RadioItem;
  onSelect: (item: RadioItem, index: number, currentValue: RadioItem) => void;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;

  aria?: string;
}

export const RadioGroup = ({
  variant = 'default', id, name, label, description,
  radioItems, value, onSelect, 
  error = false, errorMessage, disabled = false, required = false, aria,
  onBlur, onFocus, onClick, onMouseEnter, onMouseLeave
}: EventHandlers & RadioButtonProps) => {
  
  const radioItemSelected = (item: RadioItem, index: number) => {
    console.log(`\nA radio item was selected: `, {item, index});
    onSelect(item, index, value);
  }

  return (
    <Container className={`w-full flex flex-col justify-start items-start gap-2 ${getErrorThemes(error, disabled)}`} aria-describedby={aria}>
      {/* Radio Button Label w/description */}
      {label || description && 
        <TextContainer className={`flex flex-col gap-1 mb-4 text-sm`}>
          { label && 
            <Label className={`font-medium leading-6 text-slate-800 dark:text-slate-200`}>
              { label }
            </Label>
          }
          
          { description && 
            <Description>
              { description }
            </Description>
          }
        </TextContainer>
      }

      {/* Radio Items */}
      <div className={rowStyleVariants.includes(variant) ? rowLayout : columnLayout}>
        { radioItems.map((item: RadioItem, index: number) =>
          <RadioItem
            checked={value.value == item.value}
            onSelect={(item: RadioItem, index: number) => radioItemSelected(item, index)}
            value={item}
            
            inputName={name}
            id={`${id}-${item.value}`}
            variant={variant}
            key={`${id}-${item.value}`}
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
        <Description className={`text-sm pt-2`}>
          { errorMessage }
        </Description>
      }
    </Container>
  );
}


// Styles
const Container = styled.div``;
const TextContainer = styled.div``;
const Label = styled.label``;
const Description = styled.p``;

// TODO: use style css directives for handling error text themes globally
const errorStyles = ` 
  [&>label]:text-red-900 [&>label]:dark:text-red-400 
  [&>p]:text-red-900 [&>p]:dark:text-red-400 
`;
const disabledStyles = `
  [&>label]:text-slate-700 [&>label]:dark:text-slate-300 
  [&>p]:text-slate-700 [&>p]:dark:text-slate-300 
`;

const getErrorThemes = (error: boolean, disabled: boolean): string => {
  let classes = ``;
  
  if (error) classes += errorStyles;
  else if (disabled) classes += disabledStyles;
  return classes;
}

// Radio items layout
const rowStyleVariants = ['default'];
const columnLayout = `flex flex-col items-start gap-2`;
const rowLayout = `flex flex-row justify-start gap-2`;

// has-checked: <> <radio> </>
// checked:
