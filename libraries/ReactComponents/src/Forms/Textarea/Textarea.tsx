import { memo, MouseEvent, useId, useMemo, useRef, useState } from "react";
import { Button } from "../Button/Button";
import { FileUploadProps } from "../Dropbox/Dropbox";
import { Ht } from "../../Common/Content/HeightTransWrapper/HeightTransWrapper";
import { UniversalEventHandlers } from "../../Common/Utilities/Utils";
import { Icon, IconTypes } from "../../Common/Icons/Icon";

import styled from '@emotion/styled';
import styles from './Textarea.module.scss';


export type TextareaTypes = 'default' | 'box' | 'post';
export interface TextareaProps {
  type?: TextareaTypes
  name: string;

  label?: string;
  description?: string;
  placeholder?: string;
  value: string;
  
  error?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;
  
  onSubmit?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  submitButtonText?: string;
  submitButtonDisabled?: boolean;

  // This object needs to be memoized when used to prevent extra rerenders.
	attachFile?: FileUploadProps;

  // Custom interactive buttons for various functionality you'd like to implement alongside this input component
  metadataTags?: MetadataTagProps[] | boolean;
}

export interface MetadataTagProps {
  tagLabel?: string;
  tagIcon?: IconTypes;
  iconStyles?: string;
  onClickTag?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
}


// The input functionality of the textarea
const InputComponent = (allProps: TextareaProps & UniversalEventHandlers) => {
  const { type = 'default', name, value, placeholder, metadataTags, attachFile,
    error = false, errorMessage, disabled, required, 
    onSubmit, submitButtonText, submitButtonDisabled = false, 
    onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
    ...props
  } = allProps;
  const id = useId();

  return (
    <textarea 
        name={name}
        value={value}
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
				
        className={`ta-base
          ${type == 'default' ? 'ta-d-base' : ''}
          ${type == 'box' ? 'ta-b-base' : ''}
          ${type == 'post' ? `ta-p-base` : ''}
        `}
        { ...props }
      />
  );
}


export const Textarea = (allProps: TextareaProps & UniversalEventHandlers) => {
  const { 
    type = 'default', name, label, description, 
    value, attachFile, metadataTags,
    error = false, errorMessage, required = false, disabled = false, 
    onSubmit, submitButtonText, submitButtonDisabled = false, 
  } = allProps;

  //--------------------------------//
  // default style                  //
  //--------------------------------//
  const ButtonsAndLinksSection = useMemo(() => (
    <ButtonsAndLinks className={`ta-d-btn-links`}>
      <PrecedingInputElements className="rowStart items-center gap-4 pl-1 py-1 animate-fade-in">
          { attachFile?.handleFiles && 
            <AttachFileElement 
              name={attachFile?.name} handleFiles={attachFile?.handleFiles} 
              multiple={attachFile?.multiple} accept={attachFile?.accept} 

              iconStyles={`ta-d-icon ${disabled ? 'icon-disabled-color' : ''}`} 
              required={required} disabled={disabled}
            />
          }

          <MetadataTagElements type='post' metadataTags={metadataTags} id={name} disabled={disabled} />
        {/* TODO: emoji plugin for input text - https://www.npmjs.com/package/emoji-picker-react */}
      </PrecedingInputElements>

      { onSubmit && 
        <SubsequentInputElements>
          <Button 
            displayText={submitButtonText || "Submit"} 
            onClick={e => onSubmit && onSubmit(e)} 
            disabled={disabled}
            additionalStyles="ta-submit-btn px-3" 
          />
        </SubsequentInputElements>
      }
    </ButtonsAndLinks>
  ), [disabled]);
	
  if (type === 'default') {
    return (
      <div className="w-full flex flex-col gap-2">
        { label && 
          <h4 className="ta-d-label">{ label }</h4> 
        }
        <Container className="rowStart gap-2 justify-items-start items-start">
          <Avatar className="ta-d-avatar">
            <Icon variant='Profile' styles="size-4" />  
          </Avatar>

          <InputContainer className="w-full col group">
            <InputComponent { ...allProps } />
            <FocusBar className={`focus-bar ${error && !disabled ? 'focus-bar-err' : ''}`} />
            { ButtonsAndLinksSection }
          </InputContainer>
        </Container>
        
        <ErrAndDescElements 
          type={type} description={description} 
          error={error} errorMessage={errorMessage} 
          disabled={disabled}
        />
      </div>
    );
  }


  //--------------------------------//
  // box style                      //
  //--------------------------------//
  else if (type == 'box') {
    const ButtonsAndLinksSection = useMemo(() => (
      <ButtonsAndLinks className="ta-b-btn-links">
        <div className={`ta-b-attach-file ${!disabled ? 'ta-b-attach-file-ha' : 'ta-b-attach-file-d'}`}>
          { attachFile?.handleFiles && 
            <AttachFileElement 
              name={attachFile?.name} handleFiles={attachFile?.handleFiles} 
              multiple={attachFile?.multiple} accept={attachFile?.accept} 

              iconStyles={`ta-d-icon ${disabled ? 'icon-disabled-color' : ''}`} 
              required={required} disabled={disabled}
            />
          }
          <p className="italic">Attach a file</p>
        </div>

        { onSubmit && 
          <div className="margin-auto-div-fix">
            <Button 
              displayText={submitButtonText ? submitButtonText : 'Create'} 
              size="default" 
              onClick={e => onSubmit && onSubmit(e)} 
              disabled={disabled || submitButtonDisabled}
              additionalStyles="ta-submit-btn px-3" 
            />
          </div>
        }
      </ButtonsAndLinks>
    ), [disabled, submitButtonDisabled]);
		
    return (<>
      <Container className={`ta-b-c group ${!disabled && error ? 'outline-error' : 'outline-styles'}`}>
        { label && <h4 className="ta-b-label">{ label }</h4> }
				<InputComponent { ...allProps } />
        
        {/* Pill action buttons */}
        <MetadataTagElements type='box' metadataTags={metadataTags} id={name} disabled={disabled} />

        <FocusBar className={`focus-bar ${error && !disabled ? 'focus-bar-err' : ''}`} />
        { ButtonsAndLinksSection }
      </Container>
      
      <ErrAndDescElements 
        type={type} description={description} 
        error={error} errorMessage={errorMessage} 
        disabled={disabled}
      />
    </>);
  }


  //--------------------------------//
  // post style                     //
  //--------------------------------//
  else {
    const [showPreview, setShowPreview] = useState<'write' | 'preview'>('write');
    const togglePreview = (type: 'write' | 'preview') => setShowPreview(type);
		
    const PostSectionHeader = useMemo(() => (<>
      { label && <h4 className="py-2 ta-p-label">{ label }</h4> }

      <ButtonsAndLinks className="row justify-between items-center py-2">
        <div className="row gap-2">
          <Button 
            displayText="Write" 
            onClick={() => togglePreview('write')} 
            size="default" 
            color={showPreview == 'write' ? 'gray' : 'gray-focus'}
          />
          <Button 
            displayText="Preview" 
            onClick={() => togglePreview('preview')} 
            size="default" 
            color={showPreview == 'preview' ? 'gray' : 'gray-focus'}
          />
        </div>

        { showPreview == 'write' && 
          <div className="animate-fade-in">
            <MetadataTagElements type='post' metadataTags={metadataTags} id={name} disabled={disabled} />
          </div>
        }
      </ButtonsAndLinks>
    </>), [showPreview]);

    return (
      <Container>
        { PostSectionHeader }

        <Ht show={showPreview == 'preview'}>
          <div className="ta-p-preview-c">
            { value ? value : 'Preview content will render here.' }
          </div>
        </Ht>

        <InputContainer className={`ta-p-c group 
          ${!disabled && error ? 'outline-error' : 'outline-styles'}
          ${showPreview == 'write' ? 'bg-default' : ''}
        `}>
          <Ht show={showPreview == 'write'}>
            <InputComponent { ...allProps } />
          </Ht>

          <FocusBar className={`${showPreview == 'write' ? 'focus-bar' : ''} ${error && !disabled ? 'focus-bar-err' : ''}`} />
          <div className={`ta-p-btn-links ${showPreview == 'write' ? 'border-styles border-t' : ''}`}>
            <div className={`ta-b-attach-file ${!disabled ? 'ta-b-attach-file-ha' : 'ta-b-attach-file-d'}`}>
              { attachFile?.handleFiles && 
                <AttachFileElement 
                  name={attachFile?.name} handleFiles={attachFile?.handleFiles} 
                  multiple={attachFile?.multiple} accept={attachFile?.accept} 

                  iconStyles={`ta-d-icon ${disabled ? 'icon-disabled-color' : ''}`} 
                  required={required} disabled={disabled}
                />
              }
              <p className="italic">Attach a file</p>
            </div>

            <div className="margin-auto-div-fix">
              { onSubmit && (
                <Button 
                displayText="Post" 
                size="default" 
                onClick={e => onSubmit && onSubmit(e)} 
                disabled={disabled}
                additionalStyles="ta-submit-btn px-3 self-start" 
                />
              )}
            </div>
          </div>
        </InputContainer>
        
        <ErrAndDescElements 
          type={type} description={description} 
          error={error} errorMessage={errorMessage} 
          disabled={disabled}
        />
      </Container>
    );
  }
}


// Universal error and description handling
const ErrAndDescElements = memo(({ type, error, errorMessage, disabled, description }: any) => (
  <ErrorAndDescription 
    show={description || (error && !disabled)} 
    styles={`${type == 'default' ? 'ta-d-d-c' : type == 'box' ? 'ta-d-b-c' : 'ta-d-p-c'}`}
    cStyles={`text-sm ${(!disabled && error && errorMessage) ? 'error-text' : 'text-colors'}`}
  >
    { (!disabled && error && errorMessage) ? errorMessage : description } &nbsp;
  </ErrorAndDescription>
), (prev, next) => (prev.error === next.error && prev.disabled === next.disabled));


// additional action events to capture metadata during input captures. ex. Due dates, tags, etc.
const MetadataTagElements = ({ type, metadataTags, id, disabled }: MetadataTagElementProps) => {
  const getIconStyles = (styles?: string, defaultStyles?: string): string => 
    (styles ? styles : defaultStyles || '') + ` ${disabled ? 'icon-disabled-color' : ''}`; 

  //--------------------------------//
  // metadata tags                  //
  //--------------------------------//
  if (Array.isArray(metadataTags)) {

    // Default variant
    if (type == 'default') return (
      <div className="row gap-4">
        { metadataTags.map(({tagIcon, iconStyles, onClickTag}: MetadataTagProps) => {
          if (tagIcon) return (
            <div onClick={(e) => onClickTag && onClickTag(e)} key={`${id}-${tagIcon}`}>
              <Icon variant={tagIcon} styles={getIconStyles(iconStyles, 'ta-d-icon')} /> 
            </div>
          )}
        )}
      </div>
    );

    // Box variant
    if (type == 'box') return (
      <PillActions className="metadata-tag-styles">
        { metadataTags.map(({tagLabel, tagIcon, iconStyles, onClickTag }: MetadataTagProps) => 
          <div className="ta-pill-actions" onClick={(e) => onClickTag && onClickTag(e)} key={`${id}-${tagLabel}`}>
            { tagIcon && <Icon variant={tagIcon} styles={getIconStyles(iconStyles, 'metadata-tag-icon-b')} />}
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
              <Icon variant={tagIcon} styles={getIconStyles(iconStyles, 'metadata-tag-icon-p')} /> 
            </div>
          )}
        )}
      </div>
    );
  }

  // solely for documentation and display purposes
  // TODO: delete this
  else if (typeof metadataTags === 'boolean' && metadataTags == true) {
    if (type == 'box') return (
      <PillActions className="metadata-tag-styles">
        <div className="ta-pill-actions"> <Icon variant="Profile"   styles="metadata-tag-icon-b" /> Assign </div>
        <div className="ta-pill-actions"> <Icon variant="Tag"       styles="metadata-tag-icon-b" /> Label </div>
        <div className="ta-pill-actions"> <Icon variant="Calendar"  styles="metadata-tag-icon-b" /> Due Date </div>
      </PillActions>
    );

    else if (type == 'post') return (
      <div className="row gap-4">
        <Icon variant="Link"        styles="metadata-tag-icon-p" />
        <Icon variant="CodeBracket" styles="metadata-tag-icon-p" />
        <Icon variant="AtSymbol"    styles="metadata-tag-icon-p" />
      </div>
    );

    else if (type == 'default') return (
      <div className="row gap-4">
        <Icon variant='Smile'       styles="ta-d-icon" />
      </div>
    )
  }

  return (<></>);
}

const AttachFileElement = ({ name, accept, handleFiles, multiple, iconStyles, required, disabled }: TA_FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // invoke the file input's native event for opening the file selection.
  const onClickDropdown = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    fileInputRef?.current?.click();
  }

  if (true) return (
    <div onClick={onClickDropdown}>
      <HiddenInput 
        name={name} type="file" ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}

        accept={accept || ''}
        multiple={multiple}
        className='sr-only'

        disabled={disabled} required={required}
      />
      <Icon variant='AttachFile'  styles={iconStyles} />
    </div>
  );
}


interface MetadataTagElementProps { 
  type: TextareaTypes;
  metadataTags?: MetadataTagProps[] | boolean;
  id: string;
  disabled: boolean;
};
export interface TA_FileUploadProps extends FileUploadProps {
  iconStyles: string;
  required?: boolean;
  disabled?: boolean;
}


// Default metadata tags
export const defaultBoxMetadataTags: MetadataTagProps[] = [
  {
    tagLabel: 'assign', onClickTag: () => {},
    tagIcon: 'Profile', iconStyles: '',
  },
  {
    tagLabel: 'label', onClickTag: () => {},
    tagIcon: 'Tag', iconStyles: '',
  },
  {
    tagLabel: 'due date', onClickTag: () => {},
    tagIcon: 'Calendar', iconStyles: '',
  },
];
export const defaultPostMetadataTags:MetadataTagProps[] = [
  {
    tagIcon: 'Link', iconStyles: '',
    onClickTag: () => {},
  },
  {
    tagIcon: 'CodeBracket', iconStyles: '',
    onClickTag: () => {},
  },
  {
    tagIcon: 'AtSymbol', iconStyles: '',
    onClickTag: () => {},
  },
];

// Styled Components
const InputContainer = styled.div``;
const Container = styled.div``;
const ErrorAndDescription = styled(Ht)``;
const FocusBar = styled.div``;

const Avatar = styled.div``;
const PrecedingInputElements = styled.div``;
const SubsequentInputElements = styled.div``;

const PillActions = styled.div``;
const ButtonsAndLinks = styled.div``;
const HiddenInput = styled.input``;
