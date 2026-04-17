import { ChangeEvent, memo, MouseEvent, useCallback, useId, useRef } from 'react';
import styled from '@emotion/styled';

import { RadioItem } from '@Project/ReactComponents';
import styles from './RadioTable.module.scss';


export type RadioTableVariant = 'inline' | 'block';
export interface RadioTableProps {
  variant?: RadioTableVariant;
  name: string;
  label?: string;
  description?: string;

  radioItems: RadioItem[];
  currentValue: RadioItem;
  onSelect: (item: RadioItem, currentValue: RadioItem, e?: ChangeEvent<HTMLInputElement>) => void;
  
  // These need to be wrapped in a useCallback for memoization to work
  onMouseEnter?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;

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
  const currentValRef = useRef(currentValue); // Prevent rerenders on memoized child
  currentValRef.current = currentValue; 

  const onSelectedRadioItem = useCallback((item: RadioItem, e: ChangeEvent<HTMLInputElement>) => {
    onSelect(item, currentValRef.current, e);
    // console.log(`RadioTable::onSelectRadioItem: `, { item, currentValue: currentValRef.current });
  }, [onSelect]);
  
  // Get functions
  const isSelected = (item: RadioItem): boolean => currentValue.value == item.value;
  const getError = (): boolean => !!error && !disabled;


  return (
    <Container>
      <HeaderContainer className='colStart px-1'>
        { label && <Label>{ label }</Label> }
        { description && <Description>{ description }</Description> }
      </HeaderContainer>

      <Table className={`colStart mt-4 bg-default rounded-md`}>
        {radioItems.map((item: RadioItem) => 
          <RadioTableItem 
            variant={variant} name={name}
            key={`rti-${name}-${item.value}`}

            item={item} radioSelect={onSelectedRadioItem}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}

            isSelected={isSelected(item)}
            error={getError()}
            disabled={disabled}
            required={required}
          />
        )}
      </Table>

      {/* Error Text */}
      <ErrorText className={`px-1 pt-3 height-trans ${getError() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <p className={`error-text height-trans-content`}>
          { errorMessage ? errorMessage : '' } &nbsp;
        </p>
      </ErrorText>
    </Container>
  );
}


interface RadioTableItemProps {
  variant: RadioTableVariant;
  name: string;
  item: RadioItem;
  radioSelect: (item: RadioItem, e: ChangeEvent<HTMLInputElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;

  isSelected: boolean;
  error: boolean;
  required?: boolean;
  disabled?: boolean;
}
const RadioTableItem = memo(({
  variant, name, item, radioSelect, onMouseEnter, onMouseLeave, 
  isSelected, error, required, disabled
}: RadioTableItemProps) => (
  <label 
    onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
    onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
    className={`radio-table-i 
      ${isSelected ? 'radio-t-i-selected z-10' : ''}
      ${error && isSelected    ? 'radio-t-i-selected-error' :     error    ? 'radio-t-i-error' : ''} 
      ${disabled && isSelected ? 'radio-t-i-selected-disabled' :  disabled ? 'radio-t-i-disabled' : ''}
  `}>
    <Radio 
      type='radio' name={name} 
      id={`${name}-${item.value}`}
      
      value={item.value} checked={isSelected}
      onChange={(e) => radioSelect(item, e)}
      required={required}
      disabled={disabled || item.disabled}
      className={`radio-button mt-[2px] ${error ? 'radio-button-error' : ''}`}
    />
    
    <div className={`colStart *:text-left`}>
      <ItemLabel className='pb-[2px] radio-t-i-label'>{ item.label }</ItemLabel>

      {/* Column Layout */}
      {(variant == 'block' && item.description) && 
        <ItemDescription className='radio-t-i-desc'>{ item.description }</ItemDescription>
      }
    </div>
    
    {/* Row Layout */}
    {(variant == 'inline' && item.description) && 
      <ItemDescription className={`ml-auto text-left pl-2 radio-t-i-desc`}>
        { item.description }
      </ItemDescription>
    }
  </label>
));


// Styled Components
const Container = styled.div``;
const HeaderContainer = styled.div``;
const Table = styled.div``;

const Label = styled.label``;
const Description = styled.p``;
const ErrorText = styled.div``;

const Radio = styled.input``
const ItemLabel = styled.span``;
const ItemDescription = styled.p``;
