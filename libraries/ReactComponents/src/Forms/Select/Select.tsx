import styles from './Select.module.scss';
import styled from '@emotion/styled';
import { Icon, IconTypes } from '../../Common/Icons/Icon';
import { EventHandlers } from '../../Common/Utilities/Utils';
import { SelectItem, SelectItemValues } from './SelectItem/SelectItem';


export interface SelectProps {
  name: string;
  label: string;
  description?: string;
  value: SelectItemValues;
  values: SelectItemValues[];
  onSelect?: (selected: SelectItemValues, index: number) => void;
  placeholder?: string;
  id: string;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;

  aria?: string | null;
}


export const Select = ({
  name, label, description, value, values, onSelect, placeholder, id,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  error = false, errorMessage, disabled = false, required = false, aria, ...props
}: SelectProps & EventHandlers) => {
  // TODO: option to unfocus after the user has selected a value

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
        onClick={e => onClick && onClick(e)}
        aria-describedby={aria || undefined}
        { ...props }
        className={`${selectStyles} ${transitionStyles} ${visibilityStyles} *:bg-white *:dark:bg-slate-800`}
      >
        <CurrentlySelected className={`currently-selected ${currentlySelectedStyles} ${transitionStyles} ${borderStyles} ${getErrorThemes(error)}`}>
          <span> { value.value ? value.label : placeholder } </span>

          <div className='flex flex-row gap-1 items-center justify-end'>
            { error && <Icon variant='Error' styles='size-4 error' />}
            <Icon variant='SelectArrows' styles={`size-5 rotate-0 group-focus:rotate-180 ${error && 'error'}`} />
          </div>
        </CurrentlySelected>

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

      <Description className={`mt-2 text-sm ${error && 'error'}`}>
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
const containerStyles = `w-full`;
const selectStyles = `min-w-full relative group overflow-hidden focus:overflow-visible cursor-default`;
const currentlySelectedStyles = `min-w-full flex flex-row justify-between items-center gap-2 p-2 *:text-sm`;

const dropdownStyles = `absolute left-0 mt-1 w-full z-10 shadow-lg flex flex-grow flex-col`;
const dropdownScrollStyles = `overflow-y-scroll overflow-x-hidden scroll-smooth max-h-48`;

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
  --tw-bg-opacity: 1;
  
  ::-webkit-scrollbar {
    width: 0.74rem;
    background-color: rgb(30 41 59 / var(--tw-bg-opacity));
  }
    
  ::-webkit-scrollbar-track {
    border-bottom-right-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    background-color: rgb(51 65 85 / var(--tw-bg-opacity));
  }
    
  ::-webkit-scrollbar-thumb {
    border-radius: 0.375rem;
    background-color: rgb(148 163 184 / var(--tw-text-opacity)) /* #94a3b8 */;
  }
`;
// #endregion
