import { Dispatch, MouseEvent, SetStateAction } from 'react';

import styles from './Checkbox.module.scss';
import { RadioItem } from '@Project/ReactComponents';
import styled from '@emotion/styled';


export interface CheckboxItem {
  label: string;
  description?: string;
  disabled?: boolean;
  value: string;
  checked: boolean;
}

export interface CheckboxProps {
  variant?: 'default' | 'inline' | 'list';
  id: string;
  name: string;
  label?: string;
  description?: string;

  items: { [key: string]: CheckboxItem };
  onSelect: (checked: CheckboxItem, event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;

  aria?: string;
}


/** This component should be wrapped by another to prevent unnecessary component updates with it's parent, since there's multiple state values being passed in */
export const Checkbox = ({
  variant = 'default', id, name, label, description,
  items, onSelect, 
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
        {Object.values(items).map((item: CheckboxItem, index: number) =>  
          <CheckboxContainer 
            onClick={(e) => onSelect(item, e)} 
            onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
            onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
            className={getStyles()} 
            key={`${id}-radio-table-item-${index}`}
          >
            <div className={variant == 'list' ? 'flexRow justify-between w-full' : 'flexRow'}>
              <StyledCheckbox 
                value={item.value}
                name={name} 
                checked={item.checked}
                type='checkbox' 
                onChange={() => {}} // Handled via button event
                id={`${id}-radio-table-item-${index}-radio`}
                disabled={disabled || item.disabled}
                required={required}
                className={`checkbox 
                  mb-auto mt-1 ${variant == 'list' && 'order-1'}
                  appearance-none size-5 outline-css rounded-[4px] transition-all
                  checked:before:content-['✓'] text-center

                  bg-default outline-default
                  checked:bg-blue-500 checked:outline-blue-400
                  checked:dark:bg-indigo-500 checked:outline-indigo-400
                `}
              />

              {(variant == 'list') && <ItemLabel>{ item.label }</ItemLabel>}
            </div>

            <div className={`
              ${variant != 'inline' ? 'flexCol' : 'flexRow gap-2'} text-left
              ${variant == 'list' && 'mr-8'}
            `}>
              {(variant != 'list') && <ItemLabel>{ item.label }</ItemLabel>}
              <ItemDescription>{ item.description }</ItemDescription>
            </div>
          </CheckboxContainer>
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
const CheckboxContainer = styled.button``;

const Label = styled.label``;
const Description = styled.p``;

const ItemLabel = styled.label``;
const ItemDescription = styled.p``;

const CustomCheckbox = styled.div``;
const StyledCheckbox = styled.input`
  input[type="checkbox"] {

  }
  
  input[type="checkbox"]::before {

  }

`;

const radioContainerStyles = `min-w-full pt-4 pb-6 px-1`;
const defaultStyles = `flexRow gap-2`;
const listStyles = `flexCol gap-1 border-b first:border-t border-default`;

// #endregion
