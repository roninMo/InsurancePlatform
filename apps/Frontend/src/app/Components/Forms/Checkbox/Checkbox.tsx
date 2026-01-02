import { MouseEvent } from 'react';

import styles from './Checkbox.module.scss';
import { RadioItem } from '@Project/ReactComponents';
import styled from '@emotion/styled';


export interface CheckBoxItem extends RadioItem {
  checked: boolean;
}

export interface CheckboxProps {
  variant?: 'default' | 'inline' | 'list';
  id: string;
  name: string;
  label?: string;
  description?: string;

  radioItems: CheckBoxItem[];
  onSelect: (item: CheckBoxItem) => void;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;

  aria?: string;
}


export const Checkbox = ({
  variant = 'default', id, name, label, description,
  radioItems, onSelect, 
  error = false, errorMessage, disabled = false, required = false, aria,
  onMouseEnter, onMouseLeave
}: CheckboxProps) => {
  const getStyles = () => {
    if (variant == 'list') return `${listStyles} ${radioContainerStyles}`;
    else return `${defaultStyles} ${radioContainerStyles}`;
  }

  return (
    <Container aria-describedby={aria}>
      <HeaderContainer className='flexCol px-1'>
        { label && <Label>{ label }</Label> }
        { description && <Description>{ description }</Description> }
      </HeaderContainer>

      <ItemContainer className={`flexCol mt-4`}>
        {radioItems.map((item: CheckBoxItem, index: number) =>  
          <RadioContainer 
            onClick={() => onSelect(item)} 
            onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
            onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
            className={getStyles()} 
            key={`${id}-radio-table-item-${index}`}
          >
            <div className={variant == 'list' ? 'flexRow justify-between w-full' : 'flexRow'}>
              <Radio 
                value={item.value}
                name={name} 
                checked={item.checked}
                type='checkbox' 
                onChange={() => {}} // Handled via button event
                id={`${id}-radio-table-item-${index}-radio`}
                className={`checkbox mb-auto mt-1 ${variant == 'list' && 'order-1'}`}
                disabled={disabled || item.disabled}
                required={required}
              />

              {(variant == 'list') && <ItemLabel>{ item.label }</ItemLabel>}
            </div>

            <div className={`${variant != 'inline' ? 'flexCol' : 'flexRow gap-2'} text-left`}>
              {(variant != 'list') && <ItemLabel>{ item.label }</ItemLabel>}
              <ItemDescription>{ item.description }</ItemDescription>
            </div>
          </RadioContainer>
        )}
      </ItemContainer>

      { error && 
        <Description className={`error pl-1 ${variant == 'list' && 'pt-3'}`}>
          { errorMessage }
        </Description>}
    </Container>
  );
}

// #region Component styles
const Container = styled.div``;
const HeaderContainer = styled.div``;
const ItemContainer = styled.div``;
const RadioContainer = styled.button``;

const Label = styled.label``;
const Description = styled.p``;

const Radio = styled.input``
const ItemLabel = styled.label``;
const ItemDescription = styled.p``;

const radioContainerStyles = `min-w-full pt-4 pb-6 px-1`;
const defaultStyles = `flexRow gap-2`;
const listStyles = `flexCol gap-1 border-b first:border-t border-default`;

// #endregion
