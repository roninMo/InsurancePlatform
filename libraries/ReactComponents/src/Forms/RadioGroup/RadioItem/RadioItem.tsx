import { ChangeEvent, memo } from 'react';
import { RadioItem, RadioVariant } from '../RadioGroup';
import { UniversalEventHandlers } from '../../../Common/Utilities/Utils';

import styled from '@emotion/styled';
import styles from './RadioItem.module.scss';


export interface RadioItemProps {
  variant: RadioVariant;
  inputName: string;

  value: RadioItem;
  checked: boolean;
  onSelect: (item: RadioItem, e: ChangeEvent<HTMLInputElement>) => void;

  error?: boolean;
  disabled?: boolean;
}

export const RadioGroupItem = memo(({ 
  checked, onSelect, value, inputName, variant, error, disabled,
  onFocus, onChange, onBlur, onClick, onMouseEnter, onMouseLeave
}: RadioItemProps & UniversalEventHandlers) => {

  // Event handling
  const selectedRadioItem = (item: RadioItem, e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    onSelect(item, e);
  }

  return (
    <label 
      onMouseEnter={e => onMouseEnter && onMouseEnter(e)}
      onMouseLeave={e => onMouseLeave && onMouseLeave(e)}
      className={`
        ${variant == 'default' ? 'radio-item-c-d' : ''}
        ${variant == 'column' ? 'radio-item-c-c' : ''}
        ${variant == 'columnInline' ? 'radio-item-c-c' : ''}
        ${variant == 'list' ? 'radio-item-c-l' : ''}
      `} 
    >
      <Radio 
        type="radio" 
        id={`${inputName}-${value.value}`}
        name={inputName}
        className={`radio-button`} 
        
        value={value.value}
        checked={checked}
        disabled={disabled}
        
        onChange={(e) => selectedRadioItem(value, e)}
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
    </label>
  );
});


// Styled Components
const Radio = styled.input``;
const LabelAndDescription = styled.div``;
const Label = styled.span``;
const Description = styled.p``;
