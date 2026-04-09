import { MouseEvent, useId } from 'react';
import styled from '@emotion/styled';

import styles from './Checkbox.module.scss';


export interface CheckboxItem {
  label: string;
  description?: string;
  disabled?: boolean;
  value: string;
  checked: boolean;
}


// TODO: the inline style should be refactored to just be a normal inline display style of checkboxes
export type CheckboxVariant = 'default' | 'inline' | 'list';
export interface CheckboxProps {
  variant?: CheckboxVariant;
  name: string;
  label?: string;
  description?: string;

  // TODO: Change this to a record or a partial record. 
  items: { [key: string]: CheckboxItem };
  onSelect: (checked: CheckboxItem, event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;

  // Add better error and disabled styles
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}


/** This component should be wrapped by another to prevent unnecessary component updates with it's parent, since there's multiple state values being passed in */
export const Checkbox = ({
  variant = 'default', name, label, description,
  items, onSelect, 
  error = false, errorMessage, disabled = false, required = false,
  onMouseEnter, onMouseLeave
}: CheckboxProps) => {
  const id = useId();

  const onClickCheckbox = (item: CheckboxItem, event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (disabled) return; // this isn't called from the input's change event
    onSelect(item, event);
  }

  // Error handling 
  const getError = () => error && !disabled;

  return (
    <Container>
      <HeaderContainer className='colStart px-1'>
        { label && <Label>{ label }</Label> }
        { description && <Description>{ description }</Description> }
      </HeaderContainer>

      <ItemContainer className={`colStart mt-4`}>
        {Object.values(items).map((item: CheckboxItem, index: number) =>  
          <CheckboxContainer 
            onClick={(e) => onClickCheckbox(item, e)} 
            onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
            onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
            key={`cb-${name}-${item.value}-${index}-${id}`}
            className={`group
              ${variant == 'default' ? 'checkbox-c-d' : variant == 'inline' ? 'checkbox-c-i' : 'checkbox-c-l'}
              ${getError() ? 'checkbox-c-error' : ''}
              ${disabled ? 'checkbox-c-disabled' : ''}
          `}>
            <ItemLabelAndCheckbox className={variant == 'list' ? 'rowStart justify-between w-full' : 'rowStart'}>
              <StyledCheckbox 
                value={item.value}
                name={name} 
                checked={item.checked}
                type='checkbox' 
                onChange={() => {}} // Handled via button event
                id={`${id}-radio-table-item-${index}-radio`}
                disabled={disabled || item.disabled}
                required={required}
                className={`checkbox ${variant == 'list' ? 'order-1' : 'mr-1'} ${getError() ? 'checkbox-error' : ''}`}
              />

              { (variant == 'list') && 
                <ItemLabel className='checkbox-label'>
                  { item.label }
                </ItemLabel>
              }
            </ItemLabelAndCheckbox>

            <ItemLabelAndDesc className={`text-left 
              ${variant != 'inline' ? 'colStart' : 'rowStart gap-2'} 
              ${variant == 'list' && 'mr-8'}
            `}>
              {(variant != 'list') && 
                <ItemLabel className='checkbox-label'>
                  { item.label }
                </ItemLabel>
              }
              <ItemDescription className='checkbox-desc'>
                { item.description }
              </ItemDescription>
            </ItemLabelAndDesc>
          </CheckboxContainer>
        )}
      </ItemContainer>

      { error && 
        <Description className={`error-text pl-1 ${variant == 'list' && 'pt-3'}`}>
          { errorMessage }
        </Description>}
    </Container>
  );
}


// Styled Components
const Container = styled.div``;
const HeaderContainer = styled.div``;
const ItemContainer = styled.div``;
const CheckboxContainer = styled.button``;

const ItemLabelAndDesc = styled.div``;
const ItemLabelAndCheckbox = styled.div``;
const StyledCheckbox = styled.input``;
const Label = styled.label``;
const Description = styled.p``;
const ItemLabel = styled.label``;
const ItemDescription = styled.p``;
