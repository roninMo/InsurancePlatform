import styled from '@emotion/styled';
import { MouseEvent, useId } from 'react';
import styles from './Slider.module.scss';

export type SliderVariants = 'default';
export interface SliderProps {
  variant?: SliderVariants;

  name: string;
  label?: string;
  description?: string;
  
  value: boolean;
  onChange: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;

  error?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;
  styles?: string;
}

export const Slider = ({
  variant = 'default', name, label, description, value, onChange, 
  error, errorMessage, required, disabled, styles,
  ...props
}: SliderProps) => {
  const id = useId();

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

        <ErrorText className={`height-trans ${(error && !disabled) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <p className={`pt-1 error-text height-trans-content`}>
            { errorMessage ? errorMessage : '' } &nbsp;
          </p>
        </ErrorText>
      </Content>
      
      <Button 
        onClick={(e) => onChange(e)}  type='button' name={name} disabled={disabled}
        className={styles ? styles : `slider-base 
          ${value ? 'slider-on' : 'slider-off'}
          ${disabled ? 'slider-disabled' : ''}
          ${error && !disabled ? 'slider-error' : ''}`} 
        {...props}
      >
        <SliderButton className={`slider-switch ${value ? 'slider-switch-on' : ''}`}/>
      </Button>

      {/* Captured input */}
      <input 
        type="checkbox" 
        name={name} 
        id={`slider-${name}-${id}`}
        className="absolute hidden opacity-0" 
        checked={value}
        required={required} // TODO: add the target value to the onchange for a synthetic invocation 
        onChange={() => {}} // Button handles the change event
      />
    </Container>
  );
}


// Styled Components
const Container = styled.div``;
const Content = styled.div``;
const Label = styled.label``;
const Description = styled.p``;
const SliderButton = styled.div``;
const Button = styled.button``;
const ErrorText = styled.div``;
