import { MouseEvent, useId } from 'react';
import styled from '@emotion/styled';

import { RadioItem } from '@Project/ReactComponents';
import styles from './RadioTable.module.scss';


export interface RadioTableProps {
  variant?: 'inline' | 'block';
  name: string;
  label?: string;
  description?: string;

  radioItems: RadioItem[];
  currentValue: RadioItem;
  onSelect: (item: RadioItem, index: number, currentValue: RadioItem) => void;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}


export const RadioTable = ({
  variant = 'block', name, label, description,
  radioItems, currentValue, onSelect,  onMouseEnter, onMouseLeave,
  error, errorMessage, disabled, required,
}: RadioTableProps) => {
  const id = useId();

  const onSelectedRadioItem = (item: RadioItem, index: number, currentValue: RadioItem) => {
    if (disabled) return; // This isn't handled through the input's change event
    onSelect(item, index, currentValue);
  }
  
  // Get functions
  const isSelected = (item: RadioItem): boolean => currentValue.value == item.value;
  const getError = () => error && !disabled;


  return (
    <Container>
      <HeaderContainer className='colStart px-1'>
        { label && <Label>{ label }</Label> }
        { description && <Description>{ description }</Description> }
      </HeaderContainer>

      <Table className={`colStart mt-4 bg-default rounded-md`}>
        {radioItems.map((item: RadioItem, index: number) => 
          <RadioTableItem 
            onClick={() => onSelectedRadioItem(item, index, currentValue)} 
            onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
            onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
            key={`rti-${name}-${item.value}-${index}-${id}`}
            className={`radio-table-i 
              ${isSelected(item) ? 'radio-t-i-selected' : ''}
              ${getError() && isSelected(item) ? 'radio-t-i-selected-error' : getError() ? 'radio-t-i-error' : ''} 
              ${disabled && isSelected(item) ? 'radio-t-i-selected-disabled' : disabled ? 'radio-t-i-disabled' : ''}
          `}>
            <Radio 
              type='radio' name={name} 
              id={`rt-ii-${name}-${item.value}-${index}`}
              value={currentValue.value}
              checked={isSelected(item)}
              onChange={() => {}} // Handled via button event
              required={required}
              disabled={disabled || item.disabled}
              className={`radio-button mt-[2px] ${getError() ? 'radio-button-error' : ''}`}
            />
            
            <div className={`colStart *:text-left`}>
              <ItemLabel className='pb-[2px] radio-t-i-label'>{ item.label }</ItemLabel>

              {/* Column Layout */}
              {(variant == 'block' && item.description) && 
                <ItemDescription className='radio-t-i-desc'>{ item.description }</ItemDescription>
              }
            </div>
            
            {/* Row Layout */}
            {(variant == 'inline' && description) && 
              <ItemDescription className={`ml-auto text-left pl-2 radio-t-i-desc`}>
                { item.description }
              </ItemDescription>
            }
          </RadioTableItem>
        )}
      </Table>

      {/* Error text */}
      { getError() && 
        <Description className='error-text px-1 py-2'>
          { errorMessage }
        </Description>
      }
    </Container>
  );
}


// Styled Components
const Container = styled.div``;
const HeaderContainer = styled.div``;
const Table = styled.div``;
const RadioTableItem = styled.button``;

const Label = styled.label``;
const Description = styled.p``;

const Radio = styled.input``
const ItemLabel = styled.label``;
const ItemDescription = styled.p``;
