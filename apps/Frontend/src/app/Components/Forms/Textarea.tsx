import { MouseEvent, useState } from "react";
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

  onSubmit?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  submitButtonText?: string;

  error?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;
  tooltip?: boolean;
  tooltipText?: string;

  aria?: string | null;
}


// The input functionality of the textarea
const InputComponent = (allProps: TextareaProps & TextareaEventHandlers) => {
  const { type = 'default', name, label, description, value, placeholder, id, onSubmit, submitButtonText,
    error = false, errorMessage, required = false, disabled = false, tooltip = false, tooltipText,
    onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
    aria, ...props
  } = allProps;

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

        className={`w-full p-0 h-24 text-base
          ${type == 'default' && 'bg-div'}
          ${type == 'box'     && 'h-16'}
          ${type == 'post'    && 'bg-default outline-css outline-styles p-2 pl-4'}
          ${type != 'post' && `
            outline-0 focus:outline-0 
            [&::-webkit-scrollbar-corner]:bg-transparent 
            [&::-webkit-resizer]:bg-div 
          `}
        `}
        { ...props }
      />
  );
}


export const Textarea = (allProps: TextareaProps & TextareaEventHandlers) => {
  const { type = 'default', name, label, description, value, placeholder, id, onSubmit, submitButtonText,
    error = false, errorMessage, required = false, disabled = false, tooltip = false, tooltipText,
  } = allProps;

  const iconStyles = `size-5 cursor-pointer transition 
    ${type == 'default' && 'svg-colors hover:text-slate-800 dark:hover:text-slate-200'} 
    ${type == 'box'     && 'svg-colors'} 
    ${type == 'post'    && 'placeholder-text hover:input-colors'}
  `;

  // default variant
  if (type === 'default') {
    return (
      <div className="w-full flex flex-col gap-2">
        { label && <h4 className="py-2 placeholder-text font-normal">{ label }</h4> }
        <Container className="rowStart gap-2 justify-items-start items-start">
          <Avatar className="bg-div-light rounded-full p-1.5 mt-1">
            <Icon variant='Profile' styles="size-4" />  
          </Avatar>

          <InputContainer className="w-full col">
            <div className="pt-1">
              <InputComponent { ...allProps } />
            </div>

            {/* Icons and post button */}
            <ButtonsAndLinks className={`
              w-full row justify-between align-top py-2 
              border-t ${error ? 'border-error' : 'border-default'} `}
            >

              <PrecedingInputElements className="rowStart items-center gap-4">
                <Icon variant='AttachFile'  styles={iconStyles} />
                <Icon variant='Smile'       styles={iconStyles} />
              </PrecedingInputElements>
    
              { submitButtonText && 
                <SubsequentInputElements>
                  <Button 
                    displayText={submitButtonText} 
                    onClick={e => onSubmit && onSubmit(e)} 
                    additionalStyles="px-3" 
                  />
                </SubsequentInputElements>
              }
            </ButtonsAndLinks>
          </InputContainer>
        </Container>
      </div>
    );
  }

  // box variant
  else if (type == 'box') {
    return (
      <Container className="col bg-default outline-css outline-styles rounded-lg w-full">
        { label && <h4 className="p-4 placeholder-text font-normal">{ label }</h4> }
        
        <div className="pl-4">
          <InputComponent { ...allProps } />
        </div>
        
        <PillActions className="row justify-end gap-2 p-2  *:row *:gap-2 *:p-3 *:py-2 
          *:text-colors *:bg-div-light *:opacity-bg-50 *:rounded-full *:cursor-pointer *:transition"
        >
          <div className="hover:bg-div-light"> <Icon variant="Profile"   styles={iconStyles} /> Assign </div>
          <div className="hover:bg-div-light"> <Icon variant="Tag"       styles={iconStyles} /> Label </div>
          <div className="hover:bg-div-light"> <Icon variant="Calendar"  styles={iconStyles} /> Due Date </div>
        </PillActions>

        <ButtonsAndLinks className="
          row justify-between items-center p-2
          border-styles border-t"
        >
          <div className="rowStart gap-2">
            <Icon variant='AttachFile'  styles={iconStyles + 'hover:text-slate-800 dark:hover:text-slate-200'} />
            <p className="italic">Attach a file</p>
          </div>

          <Button 
            displayText={submitButtonText ? submitButtonText : 'Create'} 
            onClick={e => onSubmit && onSubmit(e)} 
            size="default" 
            additionalStyles="px-3" 
          />
        </ButtonsAndLinks>
        
      </Container>
    );
  }

  // post variant
  else {
    const [showPreview, setShowPreview] = useState<boolean>(false);

    return (
      <Container>
        { label && <h4 className="py-2 placeholder-text font-normal">{ label }</h4> }

        <ButtonsAndLinks className="row justify-between items-center py-2">
          <div className="row gap-2">
            <Button 
              displayText="Write" 
              onClick={() => setShowPreview(!showPreview)} 
              size="default" 
              color="none"
              additionalStyles={showPreview ? 'btn-gray-focus' : 'btn-gray'}
            />
            <Button 
              displayText="Preview" 
              onClick={() => setShowPreview(!showPreview)} 
              size="default" 
              color="none"
              additionalStyles={showPreview ? 'btn-gray' : 'btn-gray-focus'}
            />
          </div>

          { !showPreview && 
            <div className="row gap-4">
              <Icon variant="Link"        styles={iconStyles} />
              <Icon variant="CodeBracket" styles={iconStyles} />
              <Icon variant="AtSymbol"    styles={iconStyles} />
            </div>
          }
        </ButtonsAndLinks>

        { showPreview ? 
          <div className="p-2 pb-10 mb-1 border-b border-styles">
            { value ? value : 'Preview content will render here.' }
          </div>
        : 
          <div className="">
            <InputComponent { ...allProps } />
          </div>
        }
        
        <div className="row justify-end pt-1 pb-2">
          <Button 
            displayText="Post" 
            onClick={e => onSubmit && onSubmit(e)} 
            size="default" 
          />
        </div>
      </Container>
    );
  }
}


const InputContainer = styled.div``;
const Container = styled.div``;
const ErrorAndDescription = styled.div``;

const Avatar = styled.div``;
const PrecedingInputElements = styled.div``;
const SubsequentInputElements = styled.div``;

const PillActions = styled.div``;
const ButtonsAndLinks = styled.div``;



const iconStyles = `pointer-events-none`;
const precedingElementStyles =      `justify-center self-center grid col-start-1 row-start-1 `
const subsequentIconElementStyles = `justify-end    self-center grid col-start-1 row-start-1 focus-within:relative`