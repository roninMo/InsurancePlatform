import { UniversalEventHandlers } from '@Project/ReactComponents';
import { RadioItem, RadioVariant } from '../RadioGroup';

import styled from '@emotion/styled';
import styles from './RadioItem.module.scss';


export interface RadioItemProps {
  variant: RadioVariant;
  checked: boolean;
  onSelect: (item: RadioItem, index: number) => void;
  value: RadioItem;
  
  inputName: string;
  index: number;
  
  disabled?: boolean;
  error?: boolean;
}

export const RadioGroupItem = ({ 
  checked, onSelect, value, inputName, variant, index, error, disabled,
  onFocus, onChange, onBlur, onClick, onMouseEnter, onMouseLeave
}: RadioItemProps & UniversalEventHandlers) => {

  // Event handling
  const selectedRadioItem = (item: RadioItem, index: number) => {
    if (disabled) return; // out event doesn't prevent edits to input values when disabled
    onSelect(value, index);
  }

  return (
    <Container 
      onMouseEnter={e => onMouseEnter && onMouseEnter(e)}
      onMouseLeave={e => onMouseLeave && onMouseLeave(e)}
      onClick={() => selectedRadioItem(value, index)}
      className={`
        ${variant == 'default' ? 'radio-item-c-d' : ''}
        ${variant == 'column' ? 'radio-item-c-c' : ''}
        ${variant == 'columnInline' ? 'radio-item-c-c' : ''}
        ${variant == 'list' ? 'radio-item-c-l' : ''}
      `} 
    >
      <Radio 
        value={value.value}
        onChange={(e) => onChange && onChange(e)}
        checked={checked}
    
        type="radio" 
        disabled={disabled}
        name={`${inputName}-${value.value}`}
        className={`radio-button`} 

        onBlur={e => onBlur && onBlur(e)}
        onFocus={e => onFocus && onFocus(e)}
        onClick={e => onClick && onClick(e)}
      />

      <LabelAndDescription className="radio-text">
        <Label className="min-w-max pr-2 radio-t-label"> { value.label } </Label>
        { value.description && 
          <Description className='radio-t-desc'> { value.description } </Description>
        }
      </LabelAndDescription>
    </Container>
  );
}


// #region styling
const Container = styled.div``;
const Radio = styled.input``;
const LabelAndDescription = styled.div``;
const Label = styled.p``;
const Description = styled.p``;
