import { ChangeEvent, memo, MouseEvent, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { mapRecord } from '@Project/ReactComponents/Common';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './Checkbox.module.scss';


/** The form and display information for a checkbox item. */
export interface CheckboxItem {
  label: string;
  description?: string;
  disabled?: boolean;
  value: string;
  checked: boolean;
}


/** Inline is like the native style, default is easier to read, and list is a column like theme for each checkbox item. */
export type CheckboxVariant = 'default' | 'list' | 'inline';

/** The props associated with the Checkbox Component. */
export interface CheckboxProps {
	/** The checkbox variant. */
  variant?: CheckboxVariant;
	
	/** The form group name of the checkbox. used in Rhf's register function. */
  name: string;
	
	/** The label of the checkbox. */
  label?: string;
	
	/** The description of the checkbox. */
  description?: string;

	// Input data and events
	/** The checkbox's list items. Each item contains the value, label, description, and whether it's checked. */
  items: Record<string, CheckboxItem>;
	
	/** optional event that can be used in combination with Rhf. if you're not using Rhf, use this to handle state. */
  onSelect?: (event: ChangeEvent<HTMLInputElement>, checked: CheckboxItem) => void;
	
	/** Whether you want to handle the state instead of using Rhf. */
  disableHookForms?: boolean;

  // Additional events
	/** Mouse event. Needs to be wrapped in a useCallback to prevent rerenders */
  onMouseEnter?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
	
	/** Mouse event. Needs to be wrapped in a UseCallback to prevent rerenders.  */
  onMouseLeave?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;

	// Validation logic
	/** The error message, if there is one. */
  error?: string;
	
	/** Whether the checkbox is disabled. you can disable individual inputs through Checkbox Item's values. */
  disabled?: boolean;
	
	/** Whether the checkbox is a required form input. */
  required?: boolean;
}


export const Checkbox = ({
  variant = 'default', name, label, description,
  items, onSelect, disableHookForms = false,
  error, disabled = false, required = false,
  onMouseEnter, onMouseLeave
}: CheckboxProps) => {
  const { register, watch } = useFormContext() || {};
  const formValues = watch && watch(name);
  const [internalCheckedHash, setInternalCheckedHash] = useState<Record<string, boolean>>({});
  
  const onToggleCheckbox = (event: ChangeEvent<HTMLInputElement>, item: CheckboxItem) => {
    item.checked = !item.checked; // handle this like a native event, to optionally rerender parent
    if (disableHookForms) { // rerender here
      setInternalCheckedHash(prev => {
        const newRecord = mapRecord(prev, (v, c) => v == item.value ? item.checked : c);
        if (!(item.value in newRecord)) newRecord[item.value] = item.checked;
        return newRecord;
      }); 
    }
    
    const updatedItem = { ...item };
    if (onSelect) onSelect(event, updatedItem); 
    // console.log(`${name}(${item.value}) ${updatedItem.checked ? 'checked' : 'unchecked'}: `, { updated: updatedItem, items },
    //   `\nevent value: ${event?.target?.value}, getValues: `, formValues
    // );
  };
  
  const isSelected = (item: CheckboxItem): boolean => {
    if (!disableHookForms) {
      if (Array.isArray(formValues)) return formValues.includes(item.value);
      return !!formValues;
    }
    
    // default logic
    if (item.value in internalCheckedHash) return internalCheckedHash[item.value];
    return false;
  } 
  
  // console.log(`\n\nRerendered ${name}: isRhfMode(${!disableHookForms}), \n data: `, 
  //   !disableHookForms ? formValues : Object.values(items).filter(item => item.checked),
  //   `\n selected from : `, { vals: Object.values(items).map(i => i.value) },
  //   `\ninternal checked values: `, disableHookForms ? internalCheckedHash : undefined
  // );


  return (
    <Container className={variant == 'list' ? 'checkbox-cont-l' : ''}>
      <HeaderContainer className='checkbox-header colStart px-1'>
        { label && <Label className='checkbox-label'>{ label }</Label> }
        { description && <Description className='checkbox-desc'>{ description }</Description> }
      </HeaderContainer>

      <ItemContainer className={`${variant != 'inline' ? 'colStart' : 'rowStart gap-4 flex-wrap'}`}>
        {Object.values(items).map((item: CheckboxItem) =>  
          <CheckBoxItemComponent
            variant={variant}
            name={name}
            key={`cb-${name}-${item.value}`}

            item={item}
            isSelected={isSelected(item)}
            onSelect={onToggleCheckbox}
            rhfBindings={!disableHookForms ? register(name) : undefined}
            disabled={disabled}
            required={required}
            error={!!error && !disabled}

            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      </ItemContainer>

      <ErrorText show={!!error && !disabled} styles='pl-1' cStyles={`error-text ${variant == 'list' ? 'pt-3' : 'pt-2'}`}>
        { error ? error : '' } &nbsp;
      </ErrorText>
    </Container>
  );
}


interface CheckBoxItemComponentProps {
  variant: CheckboxVariant;
  name: string;

  item: CheckboxItem;
  isSelected: boolean;
  onSelect: (event: ChangeEvent<HTMLInputElement>, item: CheckboxItem) => void;
  rhfBindings?: any;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;

  onMouseEnter?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
} 

const CheckBoxItemComponent = memo(({
  variant, name, item, isSelected, onSelect, rhfBindings, 
  error, required, disabled, onMouseEnter, onMouseLeave 
}: CheckBoxItemComponentProps) => {
  console.log(`CheckboxItem ${item.value} rerendered, checked(${isSelected})`);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (rhfBindings) rhfBindings.onChange(e); 
    onSelect(e, item);
  }


  return (
    <label 
      onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
      onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
      className={`group
        ${variant == 'default' ? 'checkbox-i-c-d' : variant == 'inline' ? 'checkbox-i-c-i' : 'checkbox-i-c-l'}
        ${error ? 'checkbox-i-c-error' : ''}
    `}>
      <ListLayout className={variant != 'list' ? 'rowStart' : 'rowBetween w-full'}>
        <StyledCheckbox 
          type='checkbox' id={`${name}-${item.value}`}
          disabled={disabled || item.disabled} required={required}

          // Rhf or useState handling
          {...(() => {
            if (rhfBindings) {
              const { onChange: _, ...rest } = rhfBindings;
              return rest;
            }
            return { name }; // default behavior
          })()}
          value={item.value}
          checked={isSelected}
          onChange={handleOnChange}

          className={`checkbox 
            ${variant == 'list' ? 'order-1' : 'mr-1'} 
            ${error ? 'checkbox-i-error' : ''}
          `}
        />

        { (variant == 'list') && 
          <ItemLabel className='checkbox-i-label'>
            { item.label }
          </ItemLabel>
        }
      </ListLayout>

      <DefaultLayout className={`colStart gap-2 text-left ${variant == 'list' ? 'mr-8' : ''}`}>
        {(variant != 'list') && 
          <ItemLabel className='checkbox-i-label'>
            { item.label }
          </ItemLabel>
        }
        <ItemDescription className='checkbox-i-desc'>
          { item.description }
        </ItemDescription>
      </DefaultLayout>
    </label>
  );
// custom rerender functionality
}, (prevProps, nextProps) => {

  // If its selection status changed, rerender
  if (prevProps.isSelected !== nextProps.isSelected) {
    return false; 
  }

  // If the internal item selection flag changed, rerender (custom state handling)
  if (prevProps.item.checked !== nextProps.item.checked) {
    return false;
  }

  // Form / Validation
  if ( prevProps.disabled !== nextProps.disabled 
    || prevProps.required !== nextProps.required
    || prevProps.item.disabled !== nextProps.item.disabled
    || prevProps.error !== nextProps.error) {
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
const ItemContainer = styled.div``;

const DefaultLayout = styled.div``;
const ListLayout = styled.div``;
const StyledCheckbox = styled.input``;
const Label = styled.p``;
const Description = styled.p``;
const ErrorText = styled(Ht)``;
const ItemLabel = styled.p``;
const ItemDescription = styled.p``;
