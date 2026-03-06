import { MouseEvent } from 'react';
import styled from '@emotion/styled';

import { RadioItem } from '@Project/ReactComponents';
import styles from './RadioTable.module.scss';


export interface RadioTableProps {
  variant?: 'inline' | 'block';
  id: string;
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

  aria?: string;
}


export const RadioTable = ({
  variant = 'block', id, name, label, description,
  radioItems, currentValue, onSelect, 
  error = false, errorMessage, disabled = false, required = false, aria,
  onMouseEnter, onMouseLeave
}: RadioTableProps) => {
  const optionSelected = (item: RadioItem): boolean => {
    return currentValue.value == item.value;
  }

  const getSelectedStyles = (selected: boolean): string => {
    let classes = outlineStyles;
    if (selected) {
      classes += ` ${tableColorTheme}`;
      if (error) classes += ` ${itemErrorTheme}`;
    }

    return classes;
  }

  return (
    <Container aria-describedby={aria}>
      <HeaderContainer className='flexCol px-1'>
        { label && <Label>{ label }</Label> }
        { description && <Description>{ description }</Description> }
      </HeaderContainer>

      <Table className={`flexCol mt-4 bg-default rounded-md`}>
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
            <div className={`flexCol *:text-left`}>
              <ItemLabel className='pb-[2px]'>{ item.label }</ItemLabel>

              {(item.description && variant == 'block') && 
                <ItemDescription>{ item.description }</ItemDescription>
              }
            </div>
            
            {/* Row Layout */}
            {description && variant == 'inline' && 
              <ItemDescription className={`ml-auto text-left`}>
                { item.description }
              </ItemDescription>
            }
          </RadioTableItem>
        )}
      </Table>

      {/* Error text */}
      { error && 
        <Description className='error px-1 py-2'>
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


const tableItemStyles = `
  flexRow items-start gap-2 
  min-w-full p-4 px-6 
  border bg-slate-800 border-default
  transition-all duration-300
  first:rounded-t-md last:rounded-b-md 
  [&:not(:first-child)]:-mt-[1px] 
`;

const outlineStyles = `outline outline-1 -outline-offset-1 outline-slate-400/0`;
const tableColorTheme = `z-10 
  outline-indigo-600 dark:outline-indigo-500 
  bg-indigo-600 dark:bg-indigo-500
  bg-opacity-10 dark:bg-opacity-10 
`;
const itemErrorTheme = `z-10 
  outline-red-400 dark:outline-red-500
  bg-red-400 dark:bg-red-500
  bg-opacity-10 dark:bg-opacity-10 
`;

// #endregion

/*

const selectedItemTheme = `z-10`;
const tableColorTheme = ` 
  focus:border-b focus:border-indigo-500 
  focus:bg-opacity-10 focus:bg-indigo-500
`;
const errorTheme = `
  focus:border-b focus:border-red-500
  border-default 
`;

*/