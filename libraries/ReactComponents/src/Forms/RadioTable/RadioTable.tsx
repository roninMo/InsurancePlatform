import { ChangeEvent, FocusEvent, memo, MouseEvent, useCallback, useReducer, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { UniversalEventHandlers } from '@Project/ReactComponents/Common';
import { RadioItem } from '../RadioGroup/RadioGroup';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './RadioTable.module.scss';


/** This changes the behavior of the labeled description only. */
export type RadioTableVariant = 'inline' | 'block';
export interface RadioTableProps {	
	/** Whether you want an inline or block style layout for each table item. */
  variant?: RadioTableVariant;
  
	/** The form group name of this input. Used in Rhf's register function. */
  name: string;
  
	/** The RadioTable's label. */
  label?: string;
  
	/** The RadioTable's description. */
  description?: string;
  
	// Input Handling	
	/** The radio items for this input. Each item has both value and display properties. */
  radioItems: RadioItem[];
  
	/** Only used if you want custom state handling in favor of using react hook forms.  */
  // currentValue: RadioItem;
  
	/** Event function that can be used with Rhf. If you're handling custom state, handle it here. */
  onSelect: (e: ChangeEvent<HTMLInputElement>, selected: RadioItem) => void;
  
  /** Whether we should use custom state handling instead of React hook forms. */
  disableHookForms?: boolean;
  
	// form / validation
	/** The error message, if there us one. */
  error?: string;
	
	/** Whether this input is disabled. */
  disabled?: boolean;
	
	/** Whether this input is required. */
  required?: boolean;
}


export const RadioTable = ({
  variant = 'block', name, label, description,
  radioItems, onSelect, disableHookForms,  
  onChange, onBlur, onMouseEnter, onMouseLeave,
  error, disabled, required,
}: RadioTableProps & UniversalEventHandlers) => {
  const { getValues } = useFormContext() || {};
  const formValues = getValues(name);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  const onSelectedRadioItem = (e: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
    // By default, this component should handle it's own rerenders
    // And onSelect / onChange shouldn't inherently cause hierarchical rerenders
    radioItems.forEach(item => { item.selected = false; });
    selected.selected = true; // native-like event update
    const newVal = { ...selected }; // new reference
    
    // console.log(`groupHandleOnChange: ${!disableHookForms ? 'forceUpdate() - ' : ''} Just selected ${newVal.value}`, selected);
    if (disableHookForms) forceUpdate(); // update the display
    if (onSelect) onSelect(e, newVal); // optional event logic
  };
  
  // Get functions
  const isSelected = (item: RadioItem): boolean => !disableHookForms ? formValues == item.value : !!item.selected;
  const getError = (item?: RadioItem): boolean => !!error && !getDisabled(item);
  const getDisabled = (item?: RadioItem): boolean => disabled || !!(item && item.disabled);
  
  // console.log(`\n\nRerendered ${name}: isRhfMode(${!disableHookForms}), \n data: `, 
  //   !disableHookForms ? formValues : radioItems.filter(item => item.selected)?.[0] || [],
  //   `\n selected from : `, radioItems,
  // );
  
  
  return (
    <Container>
      <HeaderContainer className='colStart px-1'>
        { label && <Label>{ label }</Label> }
        { description && <Description>{ description }</Description> }
      </HeaderContainer>
      
      <Table className={`colStart mt-4 bg-default rounded-md`}>
        {radioItems.map((item: RadioItem) => 
          <RadioTableItem 
            variant={variant} name={name}
            key={`rti-${name}-${item.value}`}
            
            value={item} 
            selected={isSelected(item)}
            onSelected={onSelectedRadioItem}
            isRhfMode={!disableHookForms}
            
            onChange={onChange} onBlur={onBlur}
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
            
            error={getError(item)}
            disabled={getDisabled(item)}
            required={required}
          />
        )}
      </Table>
      
      {/* Error Text */}
      <ErrorText show={getError()} styles='px-1 pt-3' cStyles='error-text'>
        { error ? error : '' } &nbsp;
      </ErrorText>
    </Container>
  );
}


interface RadioTableItemProps {
  /** Used for handling proper styling from @see RadioGroup */
  variant: RadioTableVariant;
  
  /** The form group name for this input/Rhf register's init. */
  name: string;
  
  // Input handling
  /** The value of the RadioItem. not used when using Rhf. */
  value: RadioItem;
  
  /** Whether this value is the currently selected value. */
  selected: boolean;
  
  /** OnChange event. used in combination with Rhf, or for handling state your own way. */
  onSelected: (e: ChangeEvent<HTMLInputElement>, item: RadioItem) => void;
  
  /** Whether we're using react hook forms to handle input state. */
  isRhfMode?: boolean;
  
  // event logic
  /** Additional logic during the input's onChange event. */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  
  /** Additional logic during the input's onBlur event. */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  
  /** Additional logic during the input's onMouseEnter event. */
  onMouseEnter?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
  
  /** Additional logic during the input's onMouseLeave event. */
  onMouseLeave?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
  
  // form state	
  /** Whether the input is required. */
  required?: boolean;
  
  /** Whether the input is disabled. */
  disabled?: boolean;
  
  /** Whether the input has an error state. */
  error: boolean;
}

const RadioTableItem = memo(({
  variant, name, value, selected, onSelected, isRhfMode, 
  onChange, onBlur, onMouseEnter, onMouseLeave, 
  error, required, disabled,
}: RadioTableItemProps) => {
  const { register, getValues } = useFormContext() || {};
  const rhfBindings = isRhfMode ? register(name) : null;
  // console.log(`RadioTableItem ${value.value} rerendered, selected(${value.selected})`);
  
  /** Handle react hook form's event logic here, and other linked events. */
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    value.selected = true;  // native-like !nonRender ref update
    // console.log(`(${value.value})ItemHandleOnChange, target data: ${e?.target?.value}, `,
    //   `\n selected: `, value,
    //   `\n event data: `, e
    // );
    
    // React hook forms event logic
    if (isRhfMode && rhfBindings) {
      rhfBindings.onChange(e);
    }
    
    if (onChange) onChange(e); // additional optional event @see UniversalEventHandlers
    if (onSelected) onSelected(e, value); // default logic
  }
  
  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (isRhfMode && rhfBindings) rhfBindings.onBlur(e);
    if (onBlur) onBlur(e);
  }
  
  
  return (
  <label 
    onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
    onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
    className={`radio-table-i 
      ${selected ? 'radio-t-i-selected z-10' : ''}
      ${error && selected    ? 'radio-t-i-selected-error' :     error    ? 'radio-t-i-error' : ''} 
      ${disabled && selected ? 'radio-t-i-selected-disabled' :  disabled ? 'radio-t-i-disabled' : ''}
      ${!selected && !disabled ? 'hover:theme-fa active:duration-500' : ''}
  `}>
    <Radio 
      type="radio" id={`${name}-${value.value}`}
      value={value.value} 
      disabled={disabled} required={required}
      
      // Rhf or useState handling
      {...(() => {
        if (isRhfMode && rhfBindings) {
          const { onChange: _, onBlur: __, ...rest } = rhfBindings;
          return rest;
        }
        
        return { name, checked: selected }; // default logic
      }) ()}
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      
      className={`radio-button mt-[2px] ${error ? 'radio-button-error' : ''}`}
    />
    
    <div className={`colStart *:text-left`}>
      <ItemLabel className='pb-[2px] radio-t-i-label'>{ value.label }</ItemLabel>
      
      {/* Column Layout */}
      {(variant == 'block' && value.description) && 
        <ItemDescription className='radio-t-i-desc'>{ value.description }</ItemDescription>
      }
    </div>
    
    {/* Row Layout */}
    {(variant == 'inline' && value.description) && 
      <ItemDescription className={`ml-auto text-left pl-2 radio-t-i-desc`}>
        { value.description }
      </ItemDescription>
    }
  </label>
)}, (prevProps, nextProps) => {

  // If its selection status changed, rerender
  if (prevProps.selected !== nextProps.selected) {
    return false; 
  }
  
  // // If the actual item's value changed, rerender
  // if (prevProps.value.selected !== nextProps.value.selected) {
  //   return false;
  // }
  
  // Form / Validation
  if ( prevProps.error !== nextProps.error
    || prevProps.disabled !== nextProps.disabled 
    || prevProps.required !== nextProps.required
    || prevProps.value.disabled !== nextProps.value.disabled) {
    return false;
  }
  
  // If configurations change, rerender
  if (prevProps.name !== nextProps.name) {
    return false;
  }
  
  // If nothing changed, safely skip the rerender
  return true; 
});


// Styled Components
const Container = styled.div``;
const HeaderContainer = styled.div``;
const Table = styled.div``;

const Label = styled.label``;
const Description = styled.p``;
const ErrorText = styled(Ht)``;

const Radio = styled.input``
const ItemLabel = styled.span``;
const ItemDescription = styled.p``;
