import { MouseEvent } from "react";
import { TextareaEventHandlers, Icon, Button } from '@Project/ReactComponents';
import styled from '@emotion/styled';

import styles from './Textarea.module.scss';


export type TextareaTypes = 'default' | 'box' | 'post';
export interface TextareaProps {
  type?: TextareaTypes

  id: string;
  name: string;
  label?: string;
  value: string;
  placeholder?: string;
  description?: string;

  submitButtontext?: string;
  onSubmit?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;

  error?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;
  tooltip?: boolean;
  tooltipText?: string;

  aria?: string | null;
}


export const Textarea = (allProps: TextareaProps & TextareaEventHandlers) => {
  const { type = 'default', name, label, description, value, placeholder, id, submitButtontext, onSubmit,
    error = false, errorMessage, required = false, disabled = false, tooltip = false, tooltipText,
    onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
    aria, ...props
  } = allProps;

  const iconStyles = `size-5 svg-colors cursor-pointer`;

  // default variant
  return (
    <Container className="rowStart gap-2 justify-items-start items-start ">
      <Avatar className="bg-div-light rounded-full p-1.5 mt-1">
        <Icon variant='Profile' styles="size-4" />  
      </Avatar>

      <InputContainer className="w-full colStart">
        <InputComponent {...allProps} />

        {/* Icons and post button */}
        <ButtonsAndLinks className={`
          w-full row justify-between align-top py-2
          border-t ${error ? 'border-error' : 'border-default'} peer-focus:border-focus 

        `}>
          <PrecedingInputElements className="rowStart items-center gap-4">
            <Icon variant='AttachFile'  styles={iconStyles} />
            <Icon variant='Smile'       styles={iconStyles} />
          </PrecedingInputElements>

          {submitButtontext && 
            <SubsequentInputElements>
              <Button displayText={submitButtontext} onClick={e => onSubmit && onSubmit(e)} variant="default" additionalStyles="px-3" />
            </SubsequentInputElements>
          }
        </ButtonsAndLinks>
      </InputContainer>
    </Container>
  );

  // box variant

  // post variant

  return (
    <Container>
      <label htmlFor={type} className=""> { label } </label>

      <InputContainer className={``}>
        <PrecedingInputElements className={precedingElementStyles}>
          { type == 'box' && <Icon variant='Envelope' styles='size-4 ml-3' /> }

        </PrecedingInputElements>
        

        <input></input>

        <SubsequentInputElements className={subsequentIconElementStyles}>
          
        </SubsequentInputElements>
      </InputContainer>

      <ErrorAndDescription>

      </ErrorAndDescription>
    </Container>
  );
}


const InputComponent = ({ 
  name, value, placeholder, id,
  error = false, required = false, disabled = false,
  onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
  aria, ...props 
}: any) => {
    
  return (
    <textarea 
        name={name}
        value={!disabled ? value : placeholder}
        placeholder={placeholder}
        id={id}

        onChange={(e) => onChange ? onChange(e) : null}
        onBlur={(e) => onBlur ? onBlur(e) : null}
        onFocus={(e) => onFocus ? onFocus(e) : null}
        onClick={(e) => onClick ? onClick(e) : null}
        onMouseEnter={(e) => onMouseEnter ? onMouseEnter(e) : null}
        onMouseLeave={(e) => onMouseLeave ? onMouseLeave(e) : null}

        required={required}
        disabled={disabled}

        aria-describedby={aria || ''}
        aria-invalid={error ? "true" : "false"}

        className={`pb-8
          bg-div outline-0 focus:outline-0
          [&::-webkit-scrollbar-corner]:bg-transparent 
          [&::-webkit-resizer]:bg-div
        `}
        { ...props }
      />
  );
}

const InputContainer = styled.div``;
const Container = styled.div``;
const ErrorAndDescription = styled.div``;

const Avatar = styled.div``;
const PrecedingInputElements = styled.div``;
const SubsequentInputElements = styled.div``;

const ButtonsAndLinks = styled.div``;



const iconStyles = `pointer-events-none`;
const precedingElementStyles =      `justify-center self-center grid col-start-1 row-start-1 `
const subsequentIconElementStyles = `justify-end    self-center grid col-start-1 row-start-1 focus-within:relative`