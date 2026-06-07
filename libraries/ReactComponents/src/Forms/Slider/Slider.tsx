import { ChangeEvent, FocusEvent, useReducer, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './Slider.module.scss';
import { UniversalEventHandlers } from '@Project/ReactComponents/Common';


export type SliderVariants = 'default';
export interface SliderProps {
  /** The variant of the slider component. */
  variant?: SliderVariants;
  
	/** The form group name of this input. Used in Rhf's register function . */
  name: string;
  
	/** The Slider's label. */
  label?: string;
  
	/** The Slider's description. */
  description?: string;
  
  // form state	
  /** Whether we're using react hook forms to handle input state. */
  disableHookForms?: boolean;
  
  /** Whether the input is required. */
  required?: boolean;
  
  /** Whether the input is disabled. */
  disabled?: boolean;
  
  /** Whether the input has an error state. */
  error?: string;
  
  // styles
  /** The additional styles for the slider component. */
  additionalStyles?: string;
}

export const Slider = ({
  variant = 'default', name, label, description, onChange, disableHookForms, 
  error, required, disabled, additionalStyles,
  onFocus, onBlur, onClick, onMouseEnter, onMouseLeave
}: SliderProps & UniversalEventHandlers<HTMLInputElement>) => {
  const { register, control } = useFormContext() || {};
  const isRHFMode = !disableHookForms && !!register;
  const rhfBindings = isRHFMode ? register(name) : null;
  const formValue = useWatch({ name, control: control, disabled: !isRHFMode }); 
  
  const internalValue = useRef<boolean>(false); // custom state handling
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  // * Rerender state
  // console.log(`\n\nRerendered ${name}: isRhfMode(${isRHFMode}) value: `, isRHFMode ? formValue : internalValue.current);
  
  
  /**
   * Links event logic with custom user event logic for both Rhf and custom state handling.  
   * 
   * By default, this component should handle it's own rerenders, and 
   * onSelect / onChange shouldn't inherently cause hierarchical rerenders.
   * 
   * ---
   * @param event       The native changeEvent data tied to the input event.
   * @param selected    The @see RadioItem that was just selected.
   */
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.checked; // update the internal state
    internalValue.current = newValue;
    // console.log(`handleOnChange(${name}) ${newValue ? 'checked' : 'unchecked'} `, e);
    
    // Event functions
    if (isRHFMode && rhfBindings) rhfBindings.onChange(e);
    else forceUpdate(); // update the display
    if (onChange) onChange(e); // additional logic / custom state handling
  };
  
  /** Links custom events with Rhf's event bindings */
  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (isRHFMode && rhfBindings) rhfBindings.onBlur(e);
    if (onBlur) onBlur(e);
  }
  
  // Determine if the toggle is currently active
  const isChecked = isRHFMode ? !!formValue : !!internalValue.current;
  
  
  return (
    <Container className={`slider-c ${disabled ? 'slider-disabled' : error ? 'slider-error' : ''}`}>
      <Content className='colStart gap-1 pb-4 p-2'>
        { label && 
          <Label className='slider-label'>
            { label }
          </Label>
        }
        { description && 
          <Description className='slider-desc'>
            { description }
          </Description> 
        }
        
        <ErrorText show={!!error && !disabled} cStyles='pt-1 error-text'>
          { error ? error : '' } &nbsp;
        </ErrorText>
      </Content>
      
      <SliderContainer 
        onMouseEnter={onMouseEnter as any} onMouseLeave={onMouseLeave as any}
        className={`slider-base ${additionalStyles}`}
      >
        <input 
          type='checkbox' id={`sldr-${name}`}
          disabled={disabled} required={required}
          checked={isChecked}
          
          // Rhf or useState handling
          {...(() => {
            if (isRHFMode && rhfBindings) {
              const { onChange: _, ...rest } = rhfBindings;
              return rest;
            }
            return { name, checked: isChecked }; // default behavior
          })()}
          onChange={handleOnChange} onBlur={handleOnBlur}
          onFocus={onFocus} onClick={onClick}
          className='slider-input'
        />
        
        <Switch className="slider-switch"/>
      </SliderContainer>
    </Container>
  );
}


// Styled Components
const Container = styled.div``;
const Content = styled.div``;
const Label = styled.label``;
const Description = styled.p``;
const SliderContainer = styled.label``;
const Switch = styled.div``;
const ErrorText = styled(Ht)``;
