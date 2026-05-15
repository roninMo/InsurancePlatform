import { ChangeEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './Slider.module.scss';


export type SliderVariants = 'default';
export interface SliderProps {
  variant?: SliderVariants;
  name: string;
  label?: string;
  description?: string;

  value?: 'true' | 'false';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;

  error?: string;
  disabled?: boolean;
  required?: boolean;
  additionalStyles?: string;
}

export const Slider = ({
  variant = 'default', name, label, description, value, onChange, 
  error, required, disabled, additionalStyles,
}: SliderProps) => {
  const { register, getValues, control } = useFormContext() || {};
  
  // Input binding logic
  const isRHFMode = !!register && value === undefined;
  const rhfBindings = isRHFMode ? register(name) : null;
  // console.log(`isRhfMode: ${isRHFMode}, data: `, { value, rhfBindings, onChange, register });

  // Intercept changes cleanly
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value == 'true' ? 'false' : 'true';
    if (e?.target?.value) e.target.value = newValue;

    // Event functions
    if (isRHFMode && rhfBindings) rhfBindings.onChange(e);
    if (onChange) onChange(e);
  };

  const isChecked = (): boolean => isRHFMode ? !!watchedValue : value == 'true';
  const watchedValue = useWatch({
    name,
    control: control,
    disabled: !isRHFMode // Optimization: disable watch if not in RHF mode
  });


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
      
      <SliderContainer className={`slider-base ${additionalStyles}`}>
        <input 
          type='checkbox' id={`sldr-${name}`}
          disabled={disabled} required={required}
          
          // Rhf or useState handling
          {...(() => {
            if (isRHFMode && rhfBindings) {
              const { onChange: _, ...rest } = rhfBindings;
              return rest;
            }
            return { name, value: value }; // default behavior
          })()}

          // combined input bindings
          onChange={handleOnChange} // custom rhfBindings.onChange
          checked={isChecked()}
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
