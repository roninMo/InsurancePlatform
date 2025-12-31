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
  value: RadioItem;
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
  radioItems, value, onSelect, 
  error = false, errorMessage, disabled = false, required = false, aria,
  onBlur, onFocus, onClick, onMouseEnter, onMouseLeave
}: EventHandlers & RadioGroupProps) => {
  
  const radioItemSelected = (item: RadioItem, index: number) => {
    console.log(`\nA radio item was selected: `, {item, index});
    onSelect(item, index, value);
  }

  return (
    <Container className={`w-full flex flex-col justify-start items-start gap-2 ${getErrorThemes(error, disabled)}`} aria-describedby={aria}>

      {/* Radio Button Label w/description */}
      { (label || description) && 
        <TextContainer className={`flex flex-col gap-1 mb-4 text-sm`}>
          { label && 
            <Label className={`${labelStyles}`}>{ label }</Label>
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
            checked={value.value == item.value}
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
const Description = styled.p``;
const Label = styled.label``;

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

const labelStyles = `font-medium leading-6 text-slate-800 dark:text-slate-200`;
const descriptionStyles = `text-sm leading-6`;

// Radio items layout
const rowStyleVariants = ['default'];
const columnLayout = `flex flex-col items-start gap-2`;
const rowLayout = `flex flex-row justify-start gap-2`;

// Radio Button Styles
export const radioButtonStyles = ` 
  appearance-none mt-1 p-[6px] mr-1 rounded-lg cursor-pointer
  border-2 checked:outline checked:outline-[5px] checked:-outline-offset-[5px]
  disabled:checked:outline-[5px] disabled:checked:-outline-offset-[5px] 
  
  bg-white border-gray-300
  checked:bg-white checked:outline-indigo-500 
  disabled:bg-gray-300 disabled:border-gray-400 
  disabled:checked:bg-slate-300 disabled:checked:outline-indigo-500
  
  dark:bg-slate-800 dark:border-slate-700
  dark:checked:bg-white
  dark:disabled:bg-slate-400 dark:disabled:border-slate-500 
  dark:disabled:checked:bg-slate-300 
`;

// has-checked: <> <radio> </>
// checked:
