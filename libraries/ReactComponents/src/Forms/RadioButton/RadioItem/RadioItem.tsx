import styled from '@emotion/styled';
import { RadioVariant } from '../RadioGroup';

import styles from './RadioItem.module.scss';


export interface RadioItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioItemProps {
  checked: boolean;
  onSelect: (item: RadioItem, index: number) => void;
  value: RadioItem;
  
  inputName: string;
  id: string;
  radioTheme: RadioVariant;
  index: number;
  
  disabled?: boolean;
  error?: boolean;
}


export const RadioItem = ({ checked, onSelect, value, inputName, id, radioTheme, index, error, disabled}: RadioItemProps) => {
  const getCurrentRadioTheme = (): string => {
    if (radioTheme == 'default') return defaultStyling;
    if (radioTheme == 'column') return columnStyling;
    if (radioTheme == 'columnInline') return columnInlineStyling;
    if (radioTheme == 'list') return listStyling;
    if (radioTheme == 'table') return tableStyling;
    return defaultStyling;
  }

  if (radioTheme == 'column' || radioTheme == 'columnInline') return (
    <Container className={`${containerStyles}`}>
      <Radio 
        value={value.value}
        onChange={(e) => onSelect(value, index)}
        checked={checked}

        name={inputName} 
        type="radio" 
        id={`${id}-${value.value}`}
        className={`${radioItemStyles}`} 
      />

      <RadioItemContainer className={`flex gap-2 
        ${radioTheme == 'column'       && `flex-col items-start`}
        ${radioTheme == 'columnInline' && `flex-row justify-start`}
      `}>
        <Label className={`${labelStyles}`}> { value.label } </Label>
        {value?.description && 
          <Description className={`${descriptionStyles}`}> { value.description } </Description>
        }
      </RadioItemContainer>
    </Container>
  );

  return (<></>);
}


// #region styling
const containerStyles = `min-w-full flex flex-row gap-2 justify-start items-start`;
const radioItemStyles = `mt-[6px]`;
const labelStyles = `min-w-max pr-2 text-sm font-medium leading-6 text-slate-800 dark:text-slate-300`;
const descriptionStyles = `text-sm leading-6`;

// Text themes
// TODO: use style css directives for handling error text themes globally
const themeStyles = ``;
const errorStyles = `text-red-900 dark:text-red-400`;
const disabledStyles = `text-slate-700 dark:text-slate-300`;

// Alignment
const transitionStyles = `transition-all duration-200 ease-in *:transition-all *:duration-200 *:ease-in`;
const defaultStyling = `flex flex-row justify-start items-start gap-2`;
const columnStyling = `flex flex-col justify-start items-start gap-2`;
const columnInlineStyling = `flex flex-col justify-start items-start gap-2 [&_p]:inline-block`;
const listStyling = `flex flex-col justify-start items-start gap-2 border-b border-slate-500`;
const tableStyling = `
  flex flex-col justify-start items-start gap-2
  outline outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 
  
  outline-gray-300 dark:outline-white/10 
  focus:outline-indigo-600 dark:focus:outline-indigo-500 
  `;
  // bg-white dark:bg-slate-800 

const focusedItemStyles = `
  has-checked:outline-indigo-200 dark:has-checked:outline-indigo-800 
  has-checked:bg-indigo-50 dark:has-checked:bg-indigo-600/10 
  
  [&_label]:text-indigo-300
  [&_p]:text-indigo-300/75
`;


// Component styles
const Container = styled.div``;
const RadioItemContainer = styled.div``;
const Radio = styled.input``;
const Label = styled.div``;
const Description = styled.p``;

// #endregion
