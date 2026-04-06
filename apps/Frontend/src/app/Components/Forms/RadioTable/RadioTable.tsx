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
  // TODO: we need better displays for when there are errors
  disabled?: boolean;
  // TODO: the selection needs styles for when it's disabled
  required?: boolean;
}


// TODO: clean up the theme styles to be handled with global css styling
export const RadioTable = ({
  variant = 'block', name, label, description,
  radioItems, currentValue, onSelect, 
  error = false, errorMessage, disabled = false, required = false,
  onMouseEnter, onMouseLeave
}: RadioTableProps) => {
  const id = useId();
  
  const optionSelected = (item: RadioItem): boolean => {
    return currentValue.value == item.value;
  }

  const getSelectedStyles = (selected: boolean): string => {
    let classes = outlineStyles;
    if (selected) classes += ` ${error ? 'error-box' : 'selected-box'} z-10 `;
    else classes += ` outline-slate-400/0`;

    return classes;
  }

  return (
    <Container>
      <HeaderContainer className='colStart px-1'>
        { label && <Label>{ label }</Label> }
        { description && <Description>{ description }</Description> }
      </HeaderContainer>

      <Table className={`colStart mt-4 bg-default rounded-md`}>
        {radioItems.map((item: RadioItem, index: number) => 
          <RadioTableItem 
            onClick={() => onSelect(item, index, currentValue)} 
            onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
            onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
            className={`${tableItemStyles} ${getSelectedStyles(optionSelected(item))}`} 
            key={`${id}-radio-table-item-${index}`}
          >
            <Radio 
              value={currentValue.value}
              name={name} 
              checked={optionSelected(item)}
              type='radio' 
              onChange={() => {}} // Handled via button event
              id={`${id}-radio-table-item-${index}-radio`}
              className={`radio-button mt-[2px]`}
              disabled={disabled || item.disabled}
              required={required}
            />
            
            {/* Column Layout */}
            <div className={`colStart *:text-left`}>
              <ItemLabel className='pb-[2px]'>{ item.label }</ItemLabel>

              {(item.description && variant == 'block') && 
                <ItemDescription>{ item.description }</ItemDescription>
              }
            </div>
            
            {/* Row Layout */}
            {description && variant == 'inline' && 
              <ItemDescription className={`ml-auto text-left pl-2`}>
                { item.description }
              </ItemDescription>
            }
          </RadioTableItem>
        )}
      </Table>

      {/* Error text */}
      { error && 
        <Description className='error-text px-1 py-2'>
          { errorMessage }
        </Description>
      }
    </Container>
  );
}


// #region Component styles
const Container = styled.div``;
const HeaderContainer = styled.div``;
const Table = styled.div``;
const RadioTableItem = styled.button``;

const Label = styled.label``;
const Description = styled.p``;

const Radio = styled.input``
const ItemLabel = styled.label``;
const ItemDescription = styled.p``;


const outlineStyles = `outline outline-1 -outline-offset-1`;
const tableItemStyles = `
  rowStart items-start gap-2 
  min-w-full p-4 px-6 
  bg-default border border-default 
  transition [&_div]:transition duration-500 [&_div]:duration-500 
  first:rounded-t-md last:rounded-b-md 
  [&:not(:first-child)]:-mt-[1px] 
`;


// #endregion
