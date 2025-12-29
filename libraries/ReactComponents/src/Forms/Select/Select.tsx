import styles from './Select.module.scss';
import styled from '@emotion/styled';
import { Icon, IconTypes } from '../../Common/Icons/Icon';
import { EventHandlers } from '../../Common/Utilities/Utils';


export interface SelectProps {
  name: string;
  label: string;
  description?: string;
  value: SelectItemProps;
  values: SelectItemProps[];
  onSelect?: (selected: SelectItemProps, index: number) => void;
  placeholder?: string;
  id: string;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;

  autoComplete?: string;
  aria?: string | null;
}


export const Select = ({
  name, label, description, value, values, onSelect, placeholder, id,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  error = false, errorMessage, disabled = false, required = false,
  autoComplete, aria
}: EventHandlers & SelectProps) => {
  /*
    Label

    Select(ed) Item
    Overflow dropdown of items

    Details:
    - icon(s) and various elements preceding dropdown item text
    - dropdown item name
    - subsequent icons at the end of the element
    - ui scrollbar for navigation

    - input interactivity - styles for the currently selected element
    - select element settings for configuration
    - error handling
    - array of select item objects to pass via props

    - handle building disabled, and disabling multiple values 
    
  */


  return (
    <Container className={`${containerStyles}`}>
      <Label className={`text-sm font-medium leading-6 block pb-2`}>
        { label }
      </Label>

      <StyledSelect name={name} className={`${selectStyles} ${transitionStyles} ${visibilityStyles} *:bg-white *:dark:bg-slate-800`}>
        <CurrentlySelected className={`currently-selected ${currentlySelectedStyles} ${transitionStyles} ${borderStyles} ${getErrorThemes(error)}`}>
          <span> { value.value ? value.label : placeholder } </span>

          <div className='flex flex-row gap-1 items-center justify-end'>
            { error && <Icon variant='Error' styles='size-4 text-red-500 dark:text-red-400' />}
            <Icon variant='SelectArrows' styles={`size-5 rotate-0 group-focus:rotate-180 ${error && 'text-red-500 dark:text-red-400'}`} />
          </div>
        </CurrentlySelected>

        <DropdownItems className={`dropdown-items ${dropdownStyles} ${!disabled ? dropdownScrollStyles : disabledStyles} ${borderStyles} ${borderThemeStyles}`}>
          {values.map((item: SelectItemProps, index: number) => 
            <SelectItem 
              onClick={() => onSelect && onSelect(item, index)} 
              className={`${itemStyles} ${transitionStyles} 
              ${item.value == value.value && activeItemStyles}`}
            >
              <div className={`flex flex-row justify-start gap-2 items-center`}>
                <div className={`icon-placeholder min-h-4 min-w-5`}> 
                  {item.iconProps && item?.iconProps.placement == 'left' && 
                    <Icon variant={item.iconProps.icon} styles={item.iconProps.styles ? item.iconProps.styles : undefined} /> 
                  }
                </div>

                <option value={item.value} id={`${id}-option-${index}`}> 
                  { item.label } 
                </option>
              </div>

              {item.iconProps && item?.iconProps.placement != 'left' && // if the icon placement is on the right (handles default object args)
                <Icon variant={item.iconProps.icon} styles={item.iconProps.styles ? item.iconProps.styles : undefined} /> 
              }
            </SelectItem>


          )}
        </DropdownItems>
      </StyledSelect>

      <Description className={`mt-2 text-xs ${error && 'text-red-900 dark:text-red-400'}`}>
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
const containerStyles = `w-full text-sm text-sm`;
const selectStyles = `min-w-full relative group overflow-hidden focus:overflow-visible cursor-default`;
const currentlySelectedStyles = `min-w-full flex flex-row justify-between items-center gap-2 p-2`;
const itemStyles = `
  flex flex-row gap-2 justify-between items-center p-2 pr-4
  [&_option]:hover:text-slate-200 dark:[&_option]:hover:text-slate-200
  hover:bg-indigo-500 
  [&_svg]:hover:text-slate-200
`;
const activeItemStyles = `
  bg-indigo-400 dark:bg-indigo-400 
  [&_option]:text-slate-300
  [&_svg]:text-slate-300
`;

const dropdownStyles = `absolute left-0 mt-1 w-full flex flex-grow flex-col`;
const dropdownScrollStyles = `overflow-y-scroll overflow-x-hidden scroll-smooth max-h-48`;

const transitionStyles = `transition-all duration-200 ease-in *:transition-all *:duration-200 *:ease-in`;
const visibilityStyles = `*:opacity-0 *:focus:opacity-100 [&_.currently-selected]:opacity-100`;
const borderStyles = `
  outline outline-1 -outline-offset-1 
  shadow-lg rounded-md
  focus:outline-2 focus:-outline-offset-2 
`;
const borderThemeStyles = `
  outline-gray-300 dark:outline-white/10 
  focus:outline-indigo-600 dark:focus:outline-indigo-500 
`;

const errorStyles = `
  text-red-900 dark:text-red-400 
  placeholder:text-red-300 dark:placeholder:text-red-400/70
  
  outline-red-300 dark:outline-red-500/50 
  focus:outline-red-600 dark:focus:outline-red-400 
`;

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
const SelectItem = styled.span``;
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




export interface SelectItemProps {
  value: string;
  label: string;
  iconProps?: SelectItemIconConfig;
}

export interface SelectItemIconConfig {
  icon: IconTypes;
  placement?: 'left' | 'right';
  styles?: string;
}