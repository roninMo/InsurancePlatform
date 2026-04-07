import { MouseEvent, useId, useState } from "react";
import { TextareaEventHandlers, Icon, Button, IconTypes } from '@Project/ReactComponents';
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
  
  // TODO: Better error and disabled themes for all variants
  error?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;
  
  // TODO: make the submit button optional, and only display if added
  onSubmit?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  submitButtonText?: string;
  submitButtonDisabled?: boolean;

  // TODO: add the tooltip component to the textarea
  tooltip?: boolean;
  tooltipText?: string;
  
  // Variant specific params
  // Default and box variants
  // TODO: why don't we make the list areas where we add attachFile to another metadata tag list of sorts
  // TODO: Learn how to actually handle file attachment functionality
  onAttachFile?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  // Box and post variants
  metadataTags?: MetadataTagProps[] | boolean;
}

export interface MetadataTagProps {
  tagLabel?: string;
  tagIcon?: IconTypes;
  iconStyles?: string;
  onClickTag?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
}


// The input functionality of the textarea
const InputComponent = (allProps: TextareaProps & TextareaEventHandlers) => {
  const { type = 'default', name, value, placeholder, metadataTags,
    error = false, errorMessage, required, disabled,
    onSubmit, submitButtonText, submitButtonDisabled = false, 
    onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
    ...props
  } = allProps;
  const id = useId();

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

        // TODO: add global theme styling for the textarea variants
        className={`ta-base
          ${type == 'default' ? 'ta-d-base' : ''}
          ${type == 'box' ? 'ta-b-base' : ''}
          ${type == 'post' ? `ta-p-base ${error ? 'ta-p-error' : ''}` : ''}
          ${type !== 'post' ? `ta-db-base` : ''}
        `}
        { ...props }
      />
  );
}


export const Textarea = (allProps: TextareaProps & TextareaEventHandlers) => {
  const { type = 'default', name, label, description, value, placeholder, 
    metadataTags, onAttachFile, tooltip = false, tooltipText,
    error = false, errorMessage, required = false, disabled = false, 
    onSubmit, submitButtonText, submitButtonDisabled = false, 
    onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave,
    ...props
		} = allProps;


  // TODO: add a fill bar, from left to right, or from the center out on focus for the variants 
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

            {/* Icons and post button */}
            <ButtonsAndLinks className={`ta-d-btn-links ${error ? 'ta-d-btn-links-error' : 'ta-d-btn-links-focus'}`}>
              <PrecedingInputElements className="rowStart items-center gap-4 pl-1">
                <AttachFileElement onClickAttachFile={onAttachFile} iconStyles="ta-d-icon" />
                <Icon variant='Smile'       styles="ta-d-icon" />
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
      <Container className={`ta-b-c group ${error ? 'outline-error' : 'outline-styles'}`}>
        { label && <h4 className="ta-b-label">{ label }</h4> }
				<InputComponent { ...allProps } />
        
        {/* Pill action buttons */}
        <MetadataTagElements type='box' metadataTags={metadataTags} id={name} />

        <ButtonsAndLinks className="ta-b-btn-links">
          <div className="ta-b-attach-file">
            <AttachFileElement onClickAttachFile={onAttachFile} iconStyles="ta-b-icon" />
            <p className="italic">Attach a file</p>
          </div>

          <div className="margin-auto-div-fix">
            { !submitButtonDisabled && 
              <Button 
                displayText={submitButtonText ? submitButtonText : 'Create'} 
                onClick={e => onSubmit && onSubmit(e)} 
                size="default" 
                additionalStyles="px-3" 
              />
            }
          </div>
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
        { label && <h4 className="py-2 ta-p-label">{ label }</h4> }

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
            <MetadataTagElements type='post' metadataTags={metadataTags} id={name} />
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

          <div className="margin-auto-div-fix">
            <Button 
              displayText="Post" 
              onClick={e => onSubmit && onSubmit(e)} 
              size="default" 
              additionalStyles="px-3 self-start" 
            />
          </div>
        </div>
      </Container>
    );
  }
}


// Universal error and description handling
const ErrAndDescElements = ({ type, error, errorMessage, description }: any) => {
  return (
    <> { (error || description) &&
      <ErrorAndDescription className={type == 'default' ? 'ta-error-d-c' : type == 'box' ? 'ta-error-b-c' : 'ta-error-p-c'}>
        { error && errorMessage ?
          <div className="error-text">{ errorMessage }</div>
        : <div className="text-slate-800 dark:text-slate-500">{ description }</div>
        }
      </ErrorAndDescription>
    } </>
  );
}

// additional action events to capture metadata during input captures. ex. Due dates, tags, etc.
const MetadataTagElements = ({ type, metadataTags, id }: MetadataTagElementProps) => {

  //--------------------------------//
  // metadata tags                  //
  //--------------------------------//
  if (Array.isArray(metadataTags)) {

    // Box variant
    if (type == 'box') return (
      <PillActions className="metadata-tag-styles">
        { metadataTags.map(({tagLabel, tagIcon, iconStyles, onClickTag }: MetadataTagProps) => 
          <div className="hover:bg-div-light" onClick={(e) => onClickTag && onClickTag(e)} key={`${id}-${tagLabel}`}>
            { tagIcon && <Icon variant={tagIcon} styles={iconStyles ? iconStyles : 'metadata-tag-icon-b'} />}
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
              <Icon variant={tagIcon} styles={iconStyles ? iconStyles : '-metadata-tag-icon-p'} /> 
            </div>
          )}
        )}
      </div>
    );
  }

  // solely for documentation and display purposes
  else if (typeof metadataTags === 'boolean' && metadataTags == true) {
    if (type == 'box') return (
      <PillActions className="metadata-tag-styles">
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
const ErrorAndDescription = styled.div``;

const Avatar = styled.div``;
const PrecedingInputElements = styled.div``;
const SubsequentInputElements = styled.div``;

const PillActions = styled.div``;
const ButtonsAndLinks = styled.div``;
