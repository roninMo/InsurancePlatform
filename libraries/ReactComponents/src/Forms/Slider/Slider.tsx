import { ChangeEvent } from 'react';
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './Slider.module.scss';


export type SliderVariants = 'default';
export interface SliderProps {
  variant?: SliderVariants;
  name: string;
  label?: string;
  description?: string;

  value: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  additionalStyles?: string;
}

export const Slider = ({
  variant = 'default', name, label, description, value, onChange, 
  error, errorMessage, required, disabled, additionalStyles,
  ...props
}: SliderProps) => {

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

        <ErrorText show={error && !disabled} cStyles='pt-1 error-text'>
          { errorMessage ? errorMessage : '' } &nbsp;
        </ErrorText>
      </Content>
      
      <SliderContainer className={`slider-base ${additionalStyles}`}>
        <input 
          type='checkbox'
          name={name}
          id={`sldr-${name}`}

          // TODO: I don't know whether the form value shouldn't be a specific string value for this project
          value={`${value}`} 
          checked={value}
          onChange={onChange}

          disabled={disabled}
          required={required}
          className='slider-input'
          {...props}
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
