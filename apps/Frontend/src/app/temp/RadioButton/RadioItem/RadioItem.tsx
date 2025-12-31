import styled from '@emotion/styled';
import { RadioVariant } from '../RadioGroup';

import styles from './RadioItem.module.scss';
import { EventHandlers } from '@Project/ReactComponents';


export interface RadioItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioItemProps {
  checked: boolean;
  onSelect: (item: RadioItem, index: number) => void;
  value: RadioItem;
  
  inputName: string;
  id: string;
  variant: RadioVariant;
  index: number;
  
  disabled?: boolean;
  error?: boolean;
}


// TODO: Create a new component for the table variants, and the boxes
export const RadioItem = ({ 
  checked, onSelect, value, inputName, id, variant, index, error, disabled,
  onBlur, onFocus, onClick, onMouseEnter, onMouseLeave
}: RadioItemProps & EventHandlers) => {
  const getContainerStyles = (): string => {
    if (variant == 'default') return defaultStyles;
    if (variant == 'list') return listStyles;
    if (variant == 'column') return columnStyles;
    if (variant == 'columnInline') return columnStyles;
    return '';
  }

  const getItemContainerStyles = (): string => {
    let classes = '';
    classes += ` ${variant == 'columnInline' ? flexRow : flexCol}`;
    if (variant != 'list') classes += ' gap-2';
    return classes;
  }

  return (
    <Container 
      className={`${getContainerStyles()}`} 
      onMouseEnter={e => onMouseEnter && onMouseEnter(e as any)}
      onMouseLeave={e => onMouseLeave && onMouseLeave(e as any)}
    >
      <div className={`radio-button flex justify-center items-center`}>
        <Radio 
          value={value.value}
          onChange={(e) => onSelect(value, index)}
          checked={checked}
      
          type="radio" 
          disabled={disabled}
          name={inputName} 
          id={`${id}-${value.value}`}
          className={`${radioButtonStyles}`} 

          onBlur={e => onBlur && onBlur(e)}
          onFocus={e => onFocus && onFocus(e)}
          onClick={e => onClick && onClick(e as any)}
        />
      </div>

      <RadioItemContainer className={`${getItemContainerStyles()}`}>
        <Label className={`${labelStyles}`}> { value.label } </Label>
        { value.description && 
          <Description className={`${descriptionStyles}`}> { value.description } </Description>
        }
      </RadioItemContainer>
    </Container>
  );
}


// #region styling
const Container = styled.div``;
const RadioItemContainer = styled.div``;
const Radio = styled.input``;
const Label = styled.p``;
const Description = styled.p``;

// Component styles
const flexRow = `flex flex-row justify-start items-start`;
const flexCol = `flex flex-col items-start`;

const defaultStyles = `flex flex-row justify-start items-start gap-2 mr-6`;
const columnStyles = `flex flex-row justify-start items-start gap-2`;
const listStyles = `
min-w-full flex flex-row justify-between items-start gap-2 mr-6
[&>.radio-button]:ml-4 [&>.radio-button]:order-1
border-b border-slate-600 pb-6 pt-2 w-full
`;

const radioButtonStyles = ` 
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
  dark:disabled:checked:bg-slate-600 
`;

const labelStyles = `min-w-max pr-2 text-sm font-medium leading-6 text-slate-800 dark:text-slate-300`;
const descriptionStyles = `text-sm leading-6`;

const focusedItemStyles = `
  has-checked:outline-indigo-200 dark:has-checked:outline-indigo-800 
  has-checked:bg-indigo-50 dark:has-checked:bg-indigo-600/10 
  
  [&_label]:text-indigo-300
  [&_p]:text-indigo-300/75
`;

// #endregion
