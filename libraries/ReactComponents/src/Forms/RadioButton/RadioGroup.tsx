import styled from '@emotion/styled';
import { EventHandlers } from '../../Common/Utilities/Utils';

import styles from './RadioGroup.module.scss';
import { RadioItem } from './RadioItem/RadioItem';


export type RadioVariant = 'default' | 'column' | 'columnInline' | 'list' | 'table';
export interface RadioButtonProps {
  variant?: RadioVariant;
  id: string;
  name: string;
  label?: string;
  description?: string;

  radioItems: RadioItem[];
  value: RadioItem;
  onSelect: (item: RadioItem, index: number, currentValue: RadioItem) => void;
  defaultValue?: RadioItem;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;

  aria?: string;
}


export const RadioGroup = ({
  variant = 'default', id, name, label, description,
  radioItems, value, onSelect, defaultValue,
  error = false, errorMessage, disabled = false, required = false, aria,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave
}: EventHandlers & RadioButtonProps) => {
  
  const radioItemSelected = (item: RadioItem, index: number) => {
    console.log(`A radio item was selected: `, {item, index});
    onSelect(item, index, value);
  }

  return (
    <Container className={`w-full flex flex-col justify-start items-start gap-2 ${getErrorThemes(error, disabled)}`}>
      {label || description && 
        <TextContainer className={`flex flex-col gap-1 mb-4 text-sm`}>
          { label && 
            <Label className={`font-medium leading-6 text-slate-800 dark:text-slate-200`}>
              { label }
            </Label>
          }
          
          { description && 
            <Description className={``}>
              { description }
            </Description>
          }
        </TextContainer>
      }

      { radioItems.map((item: RadioItem, index: number) =>
        <RadioItem
          checked={value.value == item.value}
          onSelect={() => radioItemSelected}
          value={item}
          
          inputName={name}
          id={`${id}-${item.value}`}
          radioTheme={variant}
          key={`${id}-${item.value}`}
          index={index}
          
          disabled={item.disabled}
          error={error}
        />
      )}

      { error && 
        <Description className={`text-xs`}>
          { error }
        </Description>
      }
    </Container>
  );
}

const Container = styled.div``;
const TextContainer = styled.div``;
const Label = styled.label``;
const Description = styled.p``;

const errorStyles = ` 
  [&_label]:text-red-900 [&_label]:dark:text-red-400 
  [&_p]:text-red-900 [&_p]:dark:text-red-400 
`;
const disabledStyles = `
  [&_label]:text-slate-700 [&_label]:dark:text-slate-300 
  [&_p]:text-slate-700 [&_p]:dark:text-slate-300 
`;

const getErrorThemes = (error: boolean, disabled: boolean): string => {
  let classes = ``;
  
  if (error) classes += errorStyles;
  else if (disabled) classes += disabledStyles;
  return classes;
}

// has-checked: <> <radio> </>
// checked: