import { MouseEvent, useId, useState } from "react";
import { UniversalEventHandlers, Icon, Button, IconTypes, TooltipContextActions, TooltipContentProps } from '@Project/ReactComponents';
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

  // TODO: Update the post variant to include the same textarea styling as the box, and add attach file to it.
  // TODO: Add metadata tags to the default layout after the first two icons (or let emojis be a metadata tag, (create a universal help for this))
  // TODO: Add a drag and drop file attachment component, use it's props for attachFile here, and notify that the object needs to be memoized
  // Attach file for all variants
	attachFile?: {
		name: string;
    onAttachFile?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
	}
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
const InputComponent = (allProps: TextareaProps & UniversalEventHandlers) => {
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
          ${type == 'post' ? `ta-p-base ${error && !disabled ? 'ta-p-error' : ''}` : ''}
          ${type !== 'post' ? `ta-db-base` : ''}
        `}
        { ...props }
      />
  );
}


export const Textarea = (allProps: TextareaProps & UniversalEventHandlers) => {
  const { 
    type = 'default', name, label, description, 
    value, metadataTags,
    error = false, errorMessage, required = false, disabled = false, 
    onSubmit, submitButtonText, submitButtonDisabled = false, 
  } = allProps;


  // TODO: add a fill bar, from left to right, or from the center out on focus for the variants 
  //--------------------------------//
  // default style                  //
  //--------------------------------//
	
	//add a useMemo for the buttons and links, and the metdata inbetween them and the input
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
            
            <div className={`focus-bar ${error && !disabled ? 'focus-bar-err' : ''}`} />
            <ButtonsAndLinks className={`ta-d-btn-links`}>
              <PrecedingInputElements className="rowStart items-center gap-4 pl-1 py-1">
                <AttachFileElement onClickAttachFile={() => {}} iconStyles="ta-d-icon" />
                <Icon variant='Smile'       styles="ta-d-icon" />
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
		
		// add a useMemo for the buttons and links section
		
    return (<>
      <Container className={`ta-b-c group ${!disabled && error ? 'outline-error' : 'outline-styles'}`}>
        { label && <h4 className="ta-b-label">{ label }</h4> }
				<InputComponent { ...allProps } />
        
        {/* Pill action buttons */}
        <MetadataTagElements type='box' metadataTags={metadataTags} id={name} />

        <ButtonsAndLinks className="ta-b-btn-links">
          <div className="ta-b-attach-file">
            <AttachFileElement onClickAttachFile={() => {}} iconStyles="ta-b-icon" />
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
    const togglePreview = (type: 'write' | 'preview') => {
      setShowPreview(type);
    }
		
		// add a useMemo for the metadata tags

    return (
      <Container>
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
              <MetadataTagElements type='post' metadataTags={metadataTags} id={name} />
            </div>
          }
        </ButtonsAndLinks>

        <div className={`height-trans ${showPreview == 'preview' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="height-trans-content ">
            <div className="ta-p-preview-c">
              { value ? value : 'Preview content will render here.' }
            </div>
          </div>
        </div>

        <div className={`height-trans ${showPreview == 'write' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="height-trans-content ">
            <InputComponent { ...allProps } />
          </div>
        </div>

        
        <div className="row justify-between pt-1">
          <ErrAndDescElements 
            type={type} description={description} 
            error={error} errorMessage={errorMessage} 
            disabled={disabled}
          />

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
      </Container>
    );
  }
}


// Universal error and description handling
const ErrAndDescElements = ({ type, error, errorMessage, disabled, description }: any) => {
	
	// memo with config to only update when there's an error or disabled state
  return (
    <ErrorAndDescription className={`
      ${type == 'default' ? 'ta-d-d-c' : type == 'box' ? 'ta-d-b-c' : 'ta-d-p-c'}
      height-trans ${description || (error && !disabled) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
    `}>
      <p className={`height-trans-content text-sm ${(!disabled && error && errorMessage) ? 'error-text' : 'text-colors'}`}>
        { (!disabled && error && errorMessage) ? errorMessage : description } &nbsp;
      </p>
    </ErrorAndDescription>
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
          <div className="ta-pill-actions" onClick={(e) => onClickTag && onClickTag(e)} key={`${id}-${tagLabel}`}>
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
              <Icon variant={tagIcon} styles={iconStyles ? iconStyles : 'metadata-tag-icon-p'} /> 
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
