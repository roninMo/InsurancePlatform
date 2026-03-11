import { MouseEvent, useState } from "react";
import { TextareaEventHandlers, Icon, Button, IconTypes } from '@Project/ReactComponents';
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

  onAttachFile?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  metadataTags?: MetadataTagProps[] | boolean;
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

export interface MetadataTagProps {
  tagLabel?: string;
  tagIcon?: IconTypes;
  iconStyles?: string;
  onClickTag?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
}


// The input functionality of the textarea
const InputComponent = (allProps: TextareaProps & TextareaEventHandlers) => {
  const { type = 'default', name, value, placeholder, id, metadataTags,
    onSubmit, submitButtonText, error = false, errorMessage, required, disabled,
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
  const { type = 'default', name, label, description, value, placeholder, id, metadataTags, onAttachFile, 
    onSubmit, submitButtonText, error = false, errorMessage, required = false, disabled = false, tooltip = false, tooltipText,
    onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
    aria, ...props
  } = allProps;

  const iconStyles = `size-5 cursor-pointer transition 
    ${type == 'default' && 'svg-colors hover:text-slate-800 dark:hover:text-slate-200'} 
    ${type == 'box'     && 'svg-colors'} 
    ${type == 'post'    && 'placeholder-text hover:input-colors'}
  `;


  //--------------------------------//
  // default style                  //
  //--------------------------------//
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
              w-full row justify-between align-top py-2 transition
              border-t ${error ? 'border-error' : 'border-default'} `}
            >
              <PrecedingInputElements className="rowStart items-center gap-4 pl-1">
                <AttachFileElement onClickAttachFile={onAttachFile} iconStyles={iconStyles} />
                <Icon variant='Smile'       styles={iconStyles} />
                {/* TODO: emoji plugin for input text - https://www.npmjs.com/package/emoji-picker-react */}
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
        
        <ErrAndDescElements 
          type={type}
          error={error} 
          errorMessage={errorMessage} 
          description={description} 
        />
      </div>
    );
  }

  //--------------------------------//
  // box style                      //
  //--------------------------------//
  else if (type == 'box') {
    return (<>
      <Container className="col bg-default outline-css outline-styles rounded-lg w-full">
        { label && <h4 className="p-4 placeholder-text font-normal">{ label }</h4> }
        
        <div className="pl-4">
          <InputComponent { ...allProps } />
        </div>
        
        {/* Pill action buttons */}
        <MetadataTagElements type='box' metadataTags={metadataTags} id={id} />

        <ButtonsAndLinks className="
          row justify-between items-center p-2
          border-styles border-t"
        >
          <div className="rowStart gap-2">
            <AttachFileElement onClickAttachFile={onAttachFile} iconStyles={iconStyles + 'hover:text-slate-800 dark:hover:text-slate-200'} />
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
      
      <ErrAndDescElements 
        type={type}
        error={error} 
        errorMessage={errorMessage} 
        description={description} 
      />
    </>);
  }

  //--------------------------------//
  // post style                     //
  //--------------------------------//
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
            <MetadataTagElements type='post' metadataTags={metadataTags} id={id} />
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
        
        <div className="row justify-between pt-1">
          <ErrAndDescElements 
            type={type}
            error={error} 
            errorMessage={errorMessage} 
            description={description} 
          />

          <Button 
            displayText="Post" 
            onClick={e => onSubmit && onSubmit(e)} 
            size="default" 
            additionalStyles="px-3 self-start" 
          />
        </div>
      </Container>
    );
  }
}


// Universal error and description handling
const ErrAndDescElements = ({ type, error, errorMessage, description }: any) => {
  return (
    <> { (error || description) &&
      <ErrorAndDescription className={`
        ${type == 'default' ? 'pl-10'
        : type == 'box'   ?   'p-2 pl-3'
        :                     'pb-2' }
      `}>
        { error && errorMessage ?
          <div className="error-text">{ errorMessage }</div>
        : <div className="placeholder-text">{ description }</div>
        }
      </ErrorAndDescription>
    } </>
  );
}

// additional action events to capture metadata during input captures. ex. Due dates, tags, etc.
const MetadataTagElements = ({ type, metadataTags, id }: MetadataTagElementProps) => {
  const styles = "row justify-end gap-2 p-2  *:row *:gap-2 *:p-3 *:py-2 ";
  const buttonStyles = "*:text-colors *:bg-div-light *:opacity-bg-50 *:rounded-full *:cursor-pointer *:transition ";
  const postIconStyles = "size-5 cursor-pointer transition placeholder-text hover:input-colors ";
  const boxIconStyles = "size-5 cursor-pointer transition svg-colors ";

  //--------------------------------//
  // metadata tags                  //
  //--------------------------------//
  if (Array.isArray(metadataTags)) {

    // Box variant
    if (type == 'box') return (
      <PillActions className={styles + buttonStyles}>
        { metadataTags.map(({tagLabel, tagIcon, iconStyles, onClickTag }: MetadataTagProps) => 
          <div className="hover:bg-div-light" onClick={(e) => onClickTag && onClickTag(e)} key={`${id}-${tagLabel}`}>
            { tagIcon && <Icon variant={tagIcon} styles={iconStyles ? iconStyles : boxIconStyles} />}
            { tagLabel }
          </div>
        )}
      </PillActions>
    );

    // Post variant
    if (type == 'post') return (
      <div className="row gap-4">
        { metadataTags.map(({tagIcon, iconStyles, onClickTag }: MetadataTagProps) => {
          if (tagIcon) return (
            <div onClick={(e) => onClickTag && onClickTag(e)} key={`${id}-${tagIcon}`}>
              <Icon variant={tagIcon} styles={iconStyles ? iconStyles : postIconStyles} /> 
            </div>
          )}
        )}
      </div>
    );
  }

  // solely for documentation and display purposes
  else if (typeof metadataTags === 'boolean' && metadataTags == true) {
    if (type == 'box') return (
      <PillActions className={styles + buttonStyles}>
        <div className="hover:bg-div-light"> <Icon variant="Profile"   styles={boxIconStyles} /> Assign </div>
        <div className="hover:bg-div-light"> <Icon variant="Tag"       styles={boxIconStyles} /> Label </div>
        <div className="hover:bg-div-light"> <Icon variant="Calendar"  styles={boxIconStyles} /> Due Date </div>
      </PillActions>
    );

    else if (type == 'post') return (
      <div className="row gap-4">
        <Icon variant="Link"        styles={postIconStyles} />
        <Icon variant="CodeBracket" styles={postIconStyles} />
        <Icon variant="AtSymbol"    styles={postIconStyles} />
      </div>
    );
  }

  return (<></>);
}

const AttachFileElement = ({onClickAttachFile, iconStyles}: AttachFileProps) => {
  // if (onClickAttachFile) return ( // TODO: only render when provided functionality
  if (true) return (
    <div onClick={(e) => onClickAttachFile && onClickAttachFile(e)}>
      <Icon variant='AttachFile'  styles={iconStyles} />
    </div>
  );

  return (<></>);
}


interface MetadataTagElementProps { 
  type: TextareaTypes;
  metadataTags?: MetadataTagProps[] | boolean;
  id: string;
};
export interface AttachFileProps {
  onClickAttachFile?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  iconStyles: string;
}

const InputContainer = styled.div``;
const Container = styled.div``;
const ErrorAndDescription = styled.div``;

const Avatar = styled.div``;
const PrecedingInputElements = styled.div``;
const SubsequentInputElements = styled.div``;

const PillActions = styled.div``;
const ButtonsAndLinks = styled.div``;
