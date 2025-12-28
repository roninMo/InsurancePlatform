import { ElSelect, ElSelectedcontent, ElOptions, ElOption } from '@tailwindplus/elements/react';
import styles from './Select.module.scss';
import styled from '@emotion/styled';
import { Icon } from '../../Common/Icons/Icon';

export const Select = () => {


/*
  Label

  Select(ed) Item
  Overflow dropdown of items

  Details:
  - icon(s) and various elements preceding dropdown item text
  - dropdown item name
  - subsequent icons at the end of the element
  - ui scrollbar for navigation

  - input interactivity
  - select element settings for configuration
  - error handling
  - array of select item objects to pass via props
  
*/


  const styles_select = `
    flex flex-row justify-end items-end gap-2 rounded-md 
    bg-white dark:bg-slate-800
    *:bg-white *:dark:bg-slate-800
    border border-zinc-300 dark:border-white/10 
    w-max h-max p-2 
    
    relative 
    group 
    transition-all duration-200 ease-in
    *:transition-all *:duration-200 *:ease-in
    
    overflow-hidden 
    focus:overflow-visible 
    
    *:opacity-0
    *:focus:opacity-100

    [&_.dont-hide-me]:opacity-100
  
  `;

  const styles_itemsContainer = `
    flex flex-col justify-end items-end gap-2 rounded-md 
  
  `;

  return (
    <ContainerStyles>
      <SelectStyles className="">
        <CurrentlySelected>
          <span className='dont-hide-me'>
            Currently Selected Item
          </span>
          <Icon variant='DropdownArrow' styles='rotate-90 group-focus:rotate-180 size-5 justify-center self-center' />
        </CurrentlySelected>

        <DropdownItems>
          <div className="absolute shadow-lg -bottom-40 left-0 w-full h-max p-2 bg-white border border-zinc-200 dark:border-white/10  rounded-lg flex flex-col gap-2">
            <span className="flex flex-row gap-2 items-center hover:bg-zinc-100 p-2 rounded-lg">
              <Icon variant='LightTheme' />
              <p>Light</p>
            </span>

            <span className="flex flex-row gap-2 items-center hover:bg-zinc-100 p-2 rounded-lg">
              <Icon variant='DarkTheme' />
              <p>Dark</p>
            </span>

            <span className="flex flex-row gap-2 items-center hover:bg-zinc-100 p-2 rounded-lg">
              <Icon variant='System' />
              <p>System</p>
            </span>
          </div>
        </DropdownItems>

      </SelectStyles>
    </ContainerStyles>
  );
}


// #region Styling
const ContainerStyles = styled.div``;
const SelectStyles = styled.select``;
const CurrentlySelected = styled.div``;
const DropdownItems = styled.div``;
const PrecedingSelectItemElements = styled.div``;
const SubsequentSelectItemElements = styled.div``;

// Select styles
const selectThemeStyles = ``;
const selectDropdownStyles = ``;

const getSelectStyles = (error: boolean) => {
  let classes = ``;

  if (error) null;
  else null;

  return classes;
}

// #endregion




// <svg className="rotate-90 group-focus:rotate-180" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
//   viewBox="0 0 24 24">
//   <path fill="currentColor"
//     d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z" />
// </svg>