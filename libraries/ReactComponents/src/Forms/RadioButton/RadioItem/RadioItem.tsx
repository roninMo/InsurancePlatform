import styled from '@emotion/styled';
import { radioButtonStyles, RadioItem, RadioVariant } from '../RadioGroup';

import styles from './RadioItem.module.scss';
import { EventHandlers } from '@Project/ReactComponents';

export interface RadioItemProps {
  variant: RadioVariant;
  checked: boolean;
  onSelect: (item: RadioItem, index: number) => void;
  value: RadioItem;
  
  inputName: string;
  id: string;
  index: number;
  
  disabled?: boolean;
  error?: boolean;
}


// TODO: Create a new component for the table variants, and the boxes
export const RadioGroupItem = ({ 
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
          id={`radioGroupItemInput-${id}-${value.value}`}
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

const labelStyles = `min-w-max pr-2 text-sm font-medium leading-6 text-slate-800 dark:text-slate-300`;
const descriptionStyles = `text-sm leading-6`;

// #endregion
