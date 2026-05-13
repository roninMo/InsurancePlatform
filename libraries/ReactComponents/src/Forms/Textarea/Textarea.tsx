import { ChangeEvent, memo, FocusEvent, MouseEvent, ReactNode, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FileUploadProps } from "../Dropbox/Dropbox";
import { UniversalEventHandlers } from "../../Common/Utilities/Utils";
import { Icon, IconTypes } from "../../Common/Icons/Icon";
import { Button } from "../Button/Button";
import { Ht } from "../../Common/Content/HeightTransWrapper/HeightTransWrapper";

import styled from '@emotion/styled';
import styles from './Textarea.module.scss';


/** The themed textarea variant you'd like to use. */
export type TextareaTypes = 'default' | 'box' | 'post';

/** The props for the textarea component. */
export interface TextareaProps {
  /** The variant of the textarea we're using. */
  type?: TextareaTypes;

  /** The form name of the textarea. Rhf uses this in it's register functions. */
  name: string;

  /** The textarea's label. */
  label?: string;
  
  /** The description of the textarea. */
  description?: string;

  /** The placeholder for the textarea. */
  placeholder?: string;

  /** If you're overriding Rhf with useState, explicitly set the value. You can use the onChange to handle update events. */
  value?: string;
  // onChange?: (e: ChangeEvent<any>) => void; 
  
  /** Error message, if there's an error. */
  error?: string;

  /** Whether the textarea is disabled. */
  disabled?: boolean;

  /** Whether the textarea is required. */
  required?: boolean;
  

  // Optional Submit button props
  /** The function that's ran when you press the submit button. */
  onSubmit?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  
  /** The display text for the submit button. */
  submitButtonText?: string;

  /** Whether the submit button is explicitly disabled. The default disabled prop doesn't affect the button. */
  submitButtonDisabled?: boolean;
  submitButtonType?: 'button' | 'submit';

  /** The attach file props object needs to be memoized when used to prevent extra rerenders. */
	attachFile?: FileUploadProps;

  /** Custom interactive buttons for various functionality you'd like to implement alongside this input component */ 
  metadataTags?: MetadataTagProps[] | boolean;
}

/** Tag events for custom logic that you want to run in parallel with the textarea.  */
export interface MetadataTagProps {
  tagLabel?: string;
  tagIcon?: IconTypes;
  iconStyles?: string;
  onClickTag?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
}


// The input functionality of the textarea
const InputComponent = (allProps: TextareaProps & UniversalEventHandlers) => {
  const { type = 'default', name, value, placeholder, metadataTags, attachFile,
    error = false, disabled, required, 
    onSubmit, submitButtonText, submitButtonDisabled = false, submitButtonType = 'button',
    onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
    ...props
  } = allProps;

  // Input bindings
  const { register, getValues } = useFormContext() || {};
  
    // Input binding logic
    const isRHFMode = !!register && value === undefined;
    const rhfBindings = isRHFMode ? register(name) : null;
    // console.log(`isRhfMode: ${isRHFMode}, data: `, { value, rhfBindings, onChange });
  
    // Intercept changes cleanly
    const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (isRHFMode && rhfBindings) rhfBindings.onChange(e);
      if (onChange) onChange(e);
    };
  
    const handleOnBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
      if (isRHFMode && rhfBindings) rhfBindings.onBlur(e);
      if (onBlur) onBlur(e);
    }


  return (
    <textarea 
        id={name}
        placeholder={placeholder}
        disabled={disabled} required={required}
        
        // Rhf or useState handling
        {...(() => {
          if (isRHFMode && rhfBindings) {
            const { onChange: _, onBlur: __, ...rest } = rhfBindings;
            return rest;
          }
          return { name, value }; // default behavior
        })()}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        
        onFocus={(e) => onFocus ? onFocus(e) : null}
        onClick={(e) => onClick ? onClick(e) : null}
        onMouseEnter={(e) => onMouseEnter ? onMouseEnter(e) : null}
        onMouseLeave={(e) => onMouseLeave ? onMouseLeave(e) : null}
				
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
    value, attachFile, metadataTags = true,
    error = false, required = false, disabled = false, 
    onSubmit, submitButtonText, submitButtonDisabled = false, submitButtonType = 'button', 
  } = allProps;


  //--------------------------------//
  // Memoized content               //
  //--------------------------------//
  // default, box style's ButtonsAndLinks section, and the post style's header section
  const MemoizedContent = useMemo(() => {
    if (type == 'default') return (
      <ButtonsAndLinks className={`ta-d-btn-links`}>
        <PrecedingInputElements className="ta-d-attach-file">
          { attachFile?.handleFiles && 
            <AttachFileElement 
              name={attachFile?.name} handleFiles={attachFile?.handleFiles} 
              multiple={attachFile?.multiple} accept={attachFile?.accept} 
              required={required} disabled={disabled}
              iconStyles={`ta-d-icon 
                ${disabled ? 'ta-d-attach-file-d' : 'ta-d-attach-file-ha'}`} 
            />
          }

          <MetadataTagElements type='post' metadataTags={metadataTags} id={name} disabled={disabled} />
          {/* TODO: emoji plugin for input text - https://www.npmjs.com/package/emoji-picker-react */}
        </PrecedingInputElements>

        { onSubmit && 
          <SubsequentInputElements>
            <Button 
              type={submitButtonType}
              displayText={submitButtonText || "Submit"} 
              onClick={e => onSubmit && onSubmit(e)} 
              disabled={submitButtonDisabled}
              additionalStyles="ta-submit-btn px-3" 
            />
          </SubsequentInputElements>
        }
      </ButtonsAndLinks>
    );

    if (type == 'box') return (
      <ButtonsAndLinks className="ta-b-btn-links">
        <div className={`ta-b-attach-file ${!disabled ? 'ta-b-attach-file-ha' : 'ta-b-attach-file-d'}`}>
          { attachFile?.handleFiles && 
            <AttachFileElement 
              name={attachFile?.name} handleFiles={attachFile?.handleFiles} 
              multiple={attachFile?.multiple} accept={attachFile?.accept} 

              iconStyles={`ta-d-icon ${disabled ? 'i-d-color' : ''}`} 
              required={required} disabled={disabled}
            >
              <p className="italic transition-all">Attach a file</p>
            </AttachFileElement>
          }
        </div>

        { onSubmit && 
          <div className="margin-auto-div-fix">
            <Button 
              type={submitButtonType}
              displayText={submitButtonText || 'Create'} 
              size="default" 
              onClick={e => onSubmit && onSubmit(e)} 
              disabled={submitButtonDisabled}
              additionalStyles="ta-submit-btn px-3" 
            />
          </div>
        }
      </ButtonsAndLinks>
    );

    if (type == 'post') return (<></>);
  }, [type, disabled, submitButtonDisabled]);


    // Post Memoized content
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




  //--------------------------------//
  // default style                  //
  //--------------------------------//
	
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
            { MemoizedContent }
          </InputContainer>
        </Container>
        
        <ErrAndDescElements 
          type={type} description={description} 
          error={error} 
          disabled={disabled}
        />
      </div>
    );
  }


  //--------------------------------//
  // box style                      //
  //--------------------------------//
  else if (type == 'box') {
    return (<>
      <Container className={`ta-b-c group ${!disabled && error ? 'outline-error' : 'outline-styles'}`}>
        { label && <h4 className="ta-b-label">{ label }</h4> }
				<InputComponent { ...allProps } />
        
        {/* Pill action buttons */}
        <MetadataTagElements type='box' metadataTags={metadataTags} id={name} disabled={disabled} />

        <FocusBar className={`focus-bar ${error && !disabled ? 'focus-bar-err' : ''}`} />
        { MemoizedContent }
      </Container>
      
      <ErrAndDescElements 
        type={type} description={description} 
        error={error} 
        disabled={disabled}
      />
    </>);
  }


  //--------------------------------//
  // post style                     //
  //--------------------------------//
  else {
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

                  iconStyles={`ta-d-icon ${disabled ? 'i-d-color' : ''}`} 
                  required={required} disabled={disabled}
                >
                  <p className="italic transition-all">Attach a file</p>
                </AttachFileElement>
              }
            </div>

            <div className="margin-auto-div-fix">
              { onSubmit && (
                <Button 
                type={submitButtonType}
                displayText={submitButtonText || "Post"}
                size="default" 
                onClick={e => onSubmit && onSubmit(e)} 
                disabled={submitButtonDisabled}
                additionalStyles="ta-submit-btn px-3 self-start" 
                />
              )}
            </div>
          </div>
        </InputContainer>
        
        <ErrAndDescElements 
          type={type} description={description} 
          error={error} 
          disabled={disabled}
        />
      </Container>
    );
  }
}


// Universal error and description handling
const ErrAndDescElements = memo(({ type, error, disabled, description }: any) => (
  <ErrorAndDescription 
    show={description || (error && !disabled)} 
    styles={`${type == 'default' ? 'ta-d-d-c' : type == 'box' ? 'ta-d-b-c' : 'ta-d-p-c'}`}
    cStyles={`text-sm ${(!disabled && error) ? 'error-text' : 'text-colors'}`}
  >
    { (!disabled && error) ? error : description } &nbsp;
  </ErrorAndDescription>
), (prev, next) => (prev.error === next.error && prev.disabled === next.disabled));


// additional action events to capture metadata during input captures. ex. Due dates, tags, etc.
const MetadataTagElements = ({ type, metadataTags, id, disabled }: MetadataTagElementProps) => {
  const getIconStyles = (styles?: string, defaultStyles?: string): string => 
    (styles ? styles : defaultStyles || '') + ` ${disabled ? 'i-d-color' : ''}`; 

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

const AttachFileElement = ({ name, accept, handleFiles, multiple, iconStyles, required, disabled, children }: TA_FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // invoke the file input's native event for opening the file selection.
  const onClickDropdown = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    fileInputRef?.current?.click();
  }

  if (true) return (
    <div onClick={onClickDropdown} className="rowStart gap-2">
      <HiddenInput 
        name={name} type="file" ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}

        accept={accept || ''}
        multiple={multiple}
        className='sr-only'

        disabled={disabled} required={required}
      />
      <Icon variant='AttachFile'  styles={iconStyles} />
      { children }
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
  children?: ReactNode;
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
