import { ChangeEvent, memo, MouseEvent, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './Checkbox.module.scss';


export interface CheckboxItem {
  label: string;
  description?: string;
  disabled?: boolean;
  value: string;
  checked: boolean;
}


export type CheckboxVariant = 'default' | 'list' | 'inline';
export interface CheckboxProps {
  variant?: CheckboxVariant;
  name: string;
  label?: string;
  description?: string;

  items: Record<string, CheckboxItem>;
  onSelect: (event: ChangeEvent<HTMLInputElement>, checked: CheckboxItem) => void;
  disableHookForms?: boolean;

  // These need to be wrapped in a useCallback for memoization to work
  onMouseEnter?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Checkbox = ({
  variant = 'default', name, label, description,
  items, onSelect, disableHookForms = false,
  error = false, errorMessage, disabled = false, required = false,
  onMouseEnter, onMouseLeave
}: CheckboxProps) => {

  const { watch } = useFormContext() || {};
  const formValues = watch(name) || [];
  const onToggleCheckbox = useCallback((event: ChangeEvent<HTMLInputElement>, item: CheckboxItem) => {
    const updatedItem = { ...item, checked: !item.checked }; // rhf handles this internally
    onSelect(event, updatedItem); // event logic
    // console.log(`${name}(${item.value}) ${updatedItem.checked ? 'checked' : 'unchecked'}: `, updatedItem);
  }, [onSelect]);

  const renderedItems = () => Object.values(items).map(item => 
    !disableHookForms ? { ...item, checked: formValues.includes(item.value) } as CheckboxItem : item
  );

  return (
    <Container>
      <HeaderContainer className='colStart px-1'>
        { label && <Label className='checkbox-label'>{ label }</Label> }
        { description && <Description className='checkbox-desc'>{ description }</Description> }
      </HeaderContainer>

      <ItemContainer className={`${variant != 'inline' ? 'colStart' : 'rowStart gap-4 flex-wrap'} mt-4`}>
        {renderedItems().map((item: CheckboxItem) =>  
          <CheckBoxItemComponent
            variant={variant}
            name={name}
            key={`cb-${name}-${item.value}`}

            item={item}
            onSelect={onToggleCheckbox}
            usingHookForms={!disableHookForms}
            disabled={disabled}
            required={required}
            error={error && !disabled}

            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      </ItemContainer>

      <ErrorText show={error && !disabled} styles='pl-1' cStyles={`error-text ${variant == 'list' ? 'pt-3' : ''}`}>
        { errorMessage ? errorMessage : '' } &nbsp;
      </ErrorText>
    </Container>
  );
}


interface CheckBoxItemComponentProps {
  variant: CheckboxVariant;
  name: string;

  item: CheckboxItem;
  onSelect: (event: ChangeEvent<HTMLInputElement>, item: CheckboxItem) => void;
  usingHookForms: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;

  onMouseEnter?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
} 

const CheckBoxItemComponent = memo(({
  variant, name, item, onSelect, usingHookForms, 
  error, required, disabled, onMouseEnter, onMouseLeave 
}: CheckBoxItemComponentProps) => {
  const { register, getValues } = useFormContext() || {};
  const rhfBindings = usingHookForms ? register(name) : null;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (usingHookForms && rhfBindings) {
      rhfBindings.onChange(e); 
    }

    onSelect(e, item);
  }


  return (
    <label 
      onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
      onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
      className={`group
        ${variant == 'default' ? 'checkbox-c-d' : variant == 'inline' ? 'checkbox-c-i' : 'checkbox-c-l'}
        ${error ? 'checkbox-c-error' : ''}
    `}>
      <ListLayout className={variant != 'list' ? 'rowStart' : 'rowBetween w-full'}>
        <StyledCheckbox 
          type='checkbox' id={`${name}-${item.value}`}
          disabled={disabled || item.disabled} required={required}

          // Rhf or useState handling
          {...(() => {
            if (usingHookForms && rhfBindings) {
              const { onChange: _, ...rest } = rhfBindings;
              return rest;
            }
            return { name }; // default behavior
          })()}
          value={item.value}
          checked={item.checked}
          onChange={handleOnChange}

          className={`checkbox 
            ${variant == 'list' ? 'order-1' : 'mr-1'} 
            ${error ? 'checkbox-error' : ''}
          `}
        />

        { (variant == 'list') && 
          <ItemLabel className='checkbox-label'>
            { item.label }
          </ItemLabel>
        }
      </ListLayout>

      <DefaultLayout className={`colStart gap-2 text-left ${variant == 'list' ? 'mr-8' : ''}`}>
        {(variant != 'list') && 
          <ItemLabel className='checkbox-label'>
            { item.label }
          </ItemLabel>
        }
        <ItemDescription className='checkbox-desc'>
          { item.description }
        </ItemDescription>
      </DefaultLayout>
    </label>
  );
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
