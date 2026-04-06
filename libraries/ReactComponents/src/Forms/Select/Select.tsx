import { ChangeEvent, Dispatch, FocusEvent, MouseEvent, SetStateAction, useId } from "react";

import { Icon, IconTypes } from '../../Common/Icons/Icon';
import { InputEventHandlers } from '../../Common/Utilities/Utils';
import { SelectItem, SelectItemValues } from './SelectItem/SelectItem';

import styles from './Select.module.scss';
import styled from '@emotion/styled';


export interface SelectProps {
  name: string;
  label: string;
  description?: string;
  value: SelectItemValues;
  values: SelectItemValues[];
  onSelect?: (selected: SelectItemValues, index: number) => void;
  placeholder?: string;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}


export const Select = ({
  name, label, description, value, values, onSelect, placeholder,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  error = false, errorMessage, disabled = false, required = false, ...props
}: SelectProps & InputEventHandlers) => {
  const id = useId();
  // TODO: option to unfocus after the user has selected a value

  const selectPressed = (e: MouseEvent<HTMLInputElement, Element>) => {
    // todo: change the styling to open / close when clicked, including when already open instead of focus styling

    if (onClick) onClick(e);
  }

  return (
    <Container className={`${containerStyles}`}>
      <Label className={`block pb-2`}>
        { label }
      </Label>

      <StyledSelect 
        name={name} 
        onChange={e => onChange && onChange(e)}
        onBlur={e => onBlur && onBlur(e)}
        onFocus={e => onFocus && onFocus(e)}
        onClick={e => selectPressed(e)}
        { ...props }
        className={`${selectStyles} ${transitionStyles} ${visibilityStyles} *:bg-default`}
      >
        <CurrentlySelected className={`currently-selected ${currentlySelectedStyles} ${transitionStyles} ${borderStyles} ${getErrorThemes(error)}`}>
          <span> { value.value ? value.label : placeholder } </span>

          <div className='row gap-1 items-center justify-end'>
            { error && <Icon variant='Error' styles='size-4 error-text' />}
            <Icon variant='SelectArrow' styles={`size-5 rotate-0 group-focus:rotate-180 ${error && 'error-text'}`} />
          </div>
        </CurrentlySelected>

        {/* TODO: this is affected by overflow, but it shouldn't */}
        <DropdownItems
          onMouseEnter={e => onMouseEnter && onMouseEnter(e)}
          onMouseLeave={e => onMouseLeave && onMouseLeave(e)}
          className={`dropdown-items ${dropdownStyles} ${!disabled ? dropdownScrollStyles : disabledStyles} ${borderStyles} ${borderThemeStyles}`}
        >
          {values.map((item: SelectItemValues, index: number) => 
            <SelectItem 
              item={item}
              index={index}
              onSelect={onSelect}
              styles={transitionStyles}
              currentSelectValue={value}
              id={id}
              key={`${id}-${index}-${item.value}`}
            />
          )}
        </DropdownItems>
      </StyledSelect>

      <Description className={`mt-2 ${error && 'error-text'}`}>
        { error && errorMessage ? 
          <>{ errorMessage }</>
        : description &&
          <>{ description }</>
        }
      </Description>
    </Container>
  );
}



// #region Styling
// TODO: These should be global theme styles
const containerStyles = `w-full`;
const selectStyles = `min-w-full relative group overflow-hidden focus:overflow-visible cursor-default`;
const currentlySelectedStyles = `min-w-full row justify-between items-center gap-2 p-2`;

const dropdownStyles = `absolute left-0 mt-1 w-full z-10 shadow-lg col flex-grow cursor-pointer`;
const dropdownScrollStyles = `scrollbar-theme overflow-y-scroll overflow-x-hidden scroll-smooth max-h-48`;

const transitionStyles = `transition-all *:transition-all duration-200 *:duration-200 ease-in *:ease-in`;
const visibilityStyles = `*:opacity-0 *:focus:opacity-100 [&_.currently-selected]:opacity-100`;
const borderStyles = `outline-css shadow-lg`;
const borderThemeStyles = `outline-styles`;

const errorStyles = `error error-outline`;
const disabledStyles = `hidden overflow-hidden opacity-0`;

const getErrorThemes = (error: boolean) => {
  if (error) return errorStyles;
  else return borderThemeStyles;
}


// Component styles
const Container = styled.div``;
const Label = styled.label``;
const Description = styled.p``;
const StyledSelect = styled.button``;
const CurrentlySelected = styled.div``;
const DropdownItems = styled.div`
`;
// #endregion
