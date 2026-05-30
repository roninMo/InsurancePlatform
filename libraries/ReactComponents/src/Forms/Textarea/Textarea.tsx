import { ChangeEvent, memo, FocusEvent, MouseEvent, ReactNode, useMemo, useRef, useState, RefObject, useReducer, useEffect, FormEvent } from "react";
import { useFormContext } from "react-hook-form";
import { InputMask, MaskOpts } from "@Project/ReactComponents/Common/Utilities/InputMasks/InputMask";
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
export interface TextareaProps<T extends MaskOpts> {
  // * Form and display
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
  
  // Handling state
  /** Whether you're using a mask. If you have a custom class for this, declare it in the {@link Textarea}'s template arguments. */
  maskOpts?: T;
  
  /** Optional Event to update the event.currentTarget.value to pass to the  onChange event. If you're using an input mask, this edit is ignored entirely. */
  onUpdateValue?: (prevValue: string, event: FormEvent<HTMLTextAreaElement>) => void;
  
	/** Whether to use Rhf or custom state through the onChange event */
  disableHookForms?: boolean;
  // onChange?: (e: ChangeEvent<any>) => void; 
  
  // * Form / Validation
  /** Error message, if there's an error. */
  error?: string;
  
  /** Whether the textarea is disabled. */
  disabled?: boolean;
  
  /** Whether the textarea is required. */
  required?: boolean;
  
  // * Optional Submit button props
  /** The function that's ran when you press the submit button. */
  onSubmit?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  
  /** The display text for the submit button. */
  submitButtonText?: string;
  
  /** Whether the submit button is explicitly disabled. The default disabled prop doesn't affect the button. */
  submitButtonDisabled?: boolean;
  submitButtonType?: 'button' | 'submit';
  
  // Misc
  /** The attach file props object needs to be memoized when used to prevent extra rerenders. */
	attachFile?: FileUploadProps;
  
  /** Custom interactive buttons for various functionality you'd like to implement alongside this input component */ 
  metadataTags?: MetadataTagProps[] | boolean;
}


/** Tag events for custom logic that you want to run in parallel with the textarea.  */
export interface MetadataTagProps {
  /** Optional, you can use either an icon, label, or both for each actionable bubble event. */
  tagLabel?: string;
  
  /** Optional, you can use either an icon, label, or both for each actionable bubble event. */
  tagIcon?: IconTypes;
  
  /** The styles for the provided icon. */
  iconStyles?: string;
  
  /** The action event for this specific metadata tag. Can be used for anything alongside this captured form input. */
  onClickTag?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
}


/** The input functionality of the textarea. */
const InputComponent = <Mask extends InputMask = InputMask, MO extends MaskOpts = MaskOpts> ( allProps: 
  & TextareaProps<MO> 
  & UniversalEventHandlers 
  & { localInputRef: RefObject<HTMLTextAreaElement | undefined> } 
  & { MaskClass?: { new (...args: any[]): Mask }; } // Explicitly type the constructor to return the generic type 'Mask'
) => {
  const { 
    type = 'default', name, placeholder, maskOpts, MaskClass = InputMask,
    onUpdateValue, disableHookForms, localInputRef, disabled, required, 
    onChange, onBlur, onFocus, onClick, onMouseEnter, onMouseLeave, onSubmit,
  } = allProps;
  
  // * Input binding logic
  const { register, getValues, getFieldState, control, trigger, clearErrors } = useFormContext() || {};
  const isRHFMode = !disableHookForms && !!register;
  const rhfBindings = isRHFMode ? register(name) : null;
  
  // input mask
  const mask = useRef<InputMask | undefined>( maskOpts ? new MaskClass(maskOpts) : undefined );
  const usingInputMask = mask.current && (maskOpts?.inputMask || maskOpts?.filter);
  console.log(`usingInputMask: ${usingInputMask}, data: `, { maskOpts, mask: mask.current });
  
  // validation logic
  const debouncer = useRef<NodeJS.Timeout>(undefined);
  useEffect(() => () => clearTimeout(debouncer.current), []);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  // Cleanup on unmount
  useEffect(() => {
    () => {
      clearTimeout(debouncer.current); // onKeypress validations
      if (mask.current) mask.current.cleanup(); // Event listeners
    }
  }, []);
  
  /** Handles validation debouncing (if we need to validate) */
  const keypressDebouncer = (newValue: string) => {
    if (!isRHFMode) return;
    
    // const isInRevalidateMode = formState.isSubmitted;
    const isInRevalidateMode = control?._formState?.isSubmitted || false;
    
    // If we no longer need to validate
    if (!isInRevalidateMode || (isInRevalidateMode && !newValue) || disabled) {
      debouncer.current && clearTimeout(debouncer.current);
      
      // check if we should clear any current errors
      const { error } = getFieldState(name);
      if (!!error) clearErrors(name);
      return;
    }
    
    // If it was submitted and still has active errors, refresh to run validations
    if (debouncer.current) clearTimeout(debouncer.current);
    debouncer.current = setTimeout(() => {
      trigger(name);
      // forceUpdate(); // let rhf's validation logic handle rerenders
      // console.log(`running validations for ${name}`, { value: getValue() });
    }, 450);
  }
  
  // * Nested Rerender state
  console.log(`InputComponent Rerendered ${name}-${type}: isRhfMode(${isRHFMode})`,
    `\n bindings: `, { 
      onChange:     !!onChange ?    { func: onChange } : undefined,
      onUpdateValue:  !!onUpdateValue ? { func: onUpdateValue } : undefined,
      onSubmit:     !!onSubmit ?    { func: onSubmit } : undefined,
      onFocus:      !!onFocus  ?    { func: onFocus }  : undefined,
      onBlur:       !!onBlur   ?    { func: onBlur }   : undefined,
    },
  );
  
  /** Either Rhf's captured form value, or the internal ref for custom state. */
  const getValue = (): string => isRHFMode ? getValues(name) || '' : localInputRef?.current?.value || ''; 
  
  
  /**
   * Adds any input masking or custom logic to the input before updating the input component directly. 
   * * Updates the target value during each event before being passed to Rhf's and optional OnChange events.
   * 
   * ---
   * @param event       The native changeEvent data tied to the input event.
   */
  const handleUpdateValue = (event: FormEvent<HTMLTextAreaElement>) => {
    console.log('onBeforeInput change event! ');
    
    // Otherwise, handle custom edits from the onUpdateValue function
    if (!usingInputMask && onUpdateValue) {
      onUpdateValue(getValue(), event);
    }
  }
  
  
  /**
   * Links event logic with custom user event logic for both Rhf and custom state handling.  
   * 
   * By default, this component should handle it's own rerenders, and 
   * onSelect / onChange shouldn't inherently cause hierarchical rerenders.
   * 
   * ---
   * @param event       The native changeEvent data tied to the input event.
   */
  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // handleUpdateValue(event); // Masking / other custom updates 
    console.log(`${name}-${type} handleOnChange(): value(${getValue()})`,
      `\n event data: `, { value: event.target.value, event: event }
    );
    
    // react hook forms event and optional event logic
    if (isRHFMode && rhfBindings) rhfBindings.onChange(event);
    if (onChange) onChange(event);
    
    // update the internal ref so the input reflects the updated value (for non Rhf inputs)
    if (localInputRef.current) {
      const targetValue = event.target.value;
      localInputRef.current.value = targetValue;
    }
    
    // Finally, add a debouncer for handling input validations for keystrokes after a brief duration
    if (isRHFMode && rhfBindings) {
      keypressDebouncer(event.target.value);
    }
  };
  
  
  /** Links custom events with Rhf's event bindings */
  const handleOnBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    if (isRHFMode && rhfBindings) rhfBindings.onBlur(event);
    if (onBlur) onBlur(event);
  }
  
  
  /** Safe Unified Ref Callback */
  const handleRef = (node: HTMLTextAreaElement | null) => {
    // Store it locally for our increment buttons
    localInputRef.current = node || undefined; 
    
    // Pass it along to React Hook Form
    if (isRHFMode && rhfBindings?.ref) {
      rhfBindings.ref(node); 
    }
    
    // Pass a reference to the actual input to our input mask
    if (mask.current && node) {
      mask.current.initEventListeners(node);
    }
  };
  
  
  return (
    <textarea 
        id={name}
        placeholder={placeholder}
        disabled={disabled} required={required}
        
        // Rhf or useState handling
        {...(() => {
          if (isRHFMode && rhfBindings) {
            const { ref: _, onChange: __, onBlur: ___, ...rest } = rhfBindings;
            return rest;
          }
          return { name }; // default behavior
        })()}
        ref={handleRef}
        onBeforeInput={handleUpdateValue}
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
      />
  );
}


export const Textarea = <M extends InputMask = InputMask, MO extends MaskOpts = MaskOpts>
(allProps: TextareaProps<MO> & UniversalEventHandlers) => {
  const { 
    type = 'default', name, label, description, placeholder, 
    onUpdateValue, disableHookForms, attachFile, metadataTags = true,
    error, required = false, disabled = false, maskOpts,
    onSubmit, submitButtonText, submitButtonDisabled = false, submitButtonType = 'button', 
  } = allProps;
  // * Input binding logic
  const { register, getValues, getFieldState, control } = useFormContext() || {};
  const isRHFMode = !disableHookForms && !!register;
  const { error: errors } = getFieldState(name, control?._formState); // <- second arg prevents the internal JavaScript Proxy from adding a tracking flag to your component.
  const localInputRef = useRef<HTMLTextAreaElement | undefined>(undefined); // When not using rhf
  
  /** Either Rhf's captured form value, or the internal ref for custom state. */
  const getValue = (): string => isRHFMode ? getValues(name) || '' : localInputRef?.current?.value || ''; 
  
  // * Rerender state
  console.log(`\n\nRerendered ${name}(${type}): isRhfMode(${isRHFMode}) `, 
    `\n data: `, { value: getValue(), localRef: localInputRef, errors: { field: errors, prop: error } },
    `\n submitButton: `, { text: submitButtonText, disabled: submitButtonDisabled, type: submitButtonType, onSubmit },
    `\n attachFile: `, { file: getValues(attachFile?.name || ' '), props: attachFile},
    `\n metadataTags: `, metadataTags,
  );
  
  
  //--------------------------------//
  // Memoized content               //
  //--------------------------------//
  // Memoize the actual input, and safely pass it's props
  const MemoedInput = useMemo(() => {
    const { onFocus, onChange, onBlur, onMouseEnter, onMouseLeave, onClick } = allProps;
    
    return (
      <InputComponent 
        type={type} name={name}
        onChange={onChange} onUpdateValue={onUpdateValue} placeholder={placeholder}
        disableHookForms={disableHookForms} localInputRef={localInputRef} maskOpts={maskOpts}
        required={required} disabled={disabled} // error={error}
        onFocus={onFocus} onBlur={onBlur} onClick={onClick}
        onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
        onSubmit={onSubmit} 
      />
    );
  }, [name, type, disableHookForms, required, disabled]);
  
  
  // * Default and Box style's ButtonsAndLinks section
  const MemoizedContent = useMemo(() => {
    console.log(`${name}(${type}) MemoizedContent Rerendered`, { disabled, submitButtonDisabled });
    
    // Each variant's memoized components
    if (type == 'default') return (
      <ButtonsAndLinks className={`ta-d-btn-links`}>
        <PrecedingInputElements className="ta-d-attach-file">
          { attachFile?.handleFiles && 
            <AttachFileElement 
              name={attachFile?.name} handleFiles={attachFile?.handleFiles} 
              multiple={attachFile?.multiple} accept={attachFile?.accept} 
              required={required} disabled={disabled} isRhfMode={isRHFMode}
              iconStyles={`ta-d-icon 
                ${disabled ? 'ta-d-attach-file-d' : 'ta-d-attach-file-ha'}`} 
            />
          }
          
          <MetadataTagElements type='post' metadataTags={metadataTags} name={name} disabled={disabled} />
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
              required={required} disabled={disabled} isRhfMode={isRHFMode}
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
  
  
  // * Post variant's header section (the header write/preview and metadata tags)
  const [showPreview, setShowPreview] = useState<'write' | 'preview'>('write');
  const togglePreview = (type: 'write' | 'preview') => setShowPreview(type);
  
  const PostSectionHeader = useMemo(() => {
    console.log(`${name}(${type}) MemoizedContent Rerendered`, { showPreview });
    return (
      <>
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
              <MetadataTagElements type='post' metadataTags={metadataTags} name={name} disabled={disabled} />
            </div>
          }
        </ButtonsAndLinks>
      </>
    );
  }, [showPreview]);


  //--------------------------------//
  // default style                  //
  //--------------------------------//
  if (type === 'default') {
    return (
      <div className="w-full flex flex-col gap-2">
        { label && <h4 className="ta-d-label">{ label }</h4> }
        <Container className="rowStart gap-2 justify-items-start items-start">
          <Avatar className="ta-d-avatar">
            <Icon variant='Profile' styles="size-4" />  
          </Avatar>
          
          <InputContainer className="w-full col group">
            {/* Textarea Input */}
            { MemoedInput }
            
            {/* Pill Actions, and Submit Button */}
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
      <InputContainer className={`ta-b-c group ${!disabled && error ? 'outline-error' : 'outline-styles'}`}>
        { label && <h4 className="ta-b-label">{ label }</h4> }
				{/* Textarea Input */}
        { MemoedInput }
        
        {/* Pill actions and Submit Button */}
        <MetadataTagElements type='box' metadataTags={metadataTags} name={name} disabled={disabled} />
        <FocusBar className={`focus-bar ${error && !disabled ? 'focus-bar-err' : ''}`} />
        { MemoizedContent }
      </InputContainer>
      
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
            { getValue() ? getValue() : 'Preview content will render here.' }
          </div>
        </Ht>
        
        <InputContainer className={`ta-p-c group 
          ${!disabled && error ? 'outline-error' : 'outline-styles'}
          ${showPreview == 'write' ? 'bg-default' : ''}
        `}>
          {/* Textarea input */}
          <Ht show={showPreview == 'write'}>
            { MemoedInput }
          </Ht>
          
          <FocusBar className={`${showPreview == 'write' ? 'focus-bar' : ''} ${error && !disabled ? 'focus-bar-err' : ''}`} />
          <ButtonsAndLinks className={`ta-p-btn-links ${showPreview == 'write' ? 'border-styles border-t' : ''}`}>
            <div className={`ta-b-attach-file ${!disabled ? 'ta-b-attach-file-ha' : 'ta-b-attach-file-d'}`}>
              { attachFile?.handleFiles && 
                <AttachFileElement 
                  name={attachFile?.name} handleFiles={attachFile?.handleFiles} 
                  multiple={attachFile?.multiple} accept={attachFile?.accept} 
                  iconStyles={`ta-d-icon ${disabled ? 'i-d-color' : ''}`} 
                  required={required} disabled={disabled} isRhfMode={isRHFMode}
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
          </ButtonsAndLinks>
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


/** Universal error and description handling for all variants */
const ErrAndDescElements = ({ type, error, disabled, description }: any) => (
  <ErrorAndDescription 
    show={description || (error && !disabled)} 
    styles={`${type == 'default' ? 'ta-d-d-c' : type == 'box' ? 'ta-d-b-c' : 'ta-d-p-c'}`}
    cStyles={`text-sm ${(!disabled && error) ? 'error-text' : 'text-colors'}`}
  >
    { (!disabled && error) ? error : description } &nbsp;
  </ErrorAndDescription>
);



/** Strictly for the component to render the props */
interface MetadataTagElementProps { 
  /** The textarea's current variant. */
  type: TextareaTypes;
  
  /** The action bubbles for the current textarea. */
  metadataTags?: MetadataTagProps[] | boolean;
  
  /** Used for the mapped keys, and other non essential state. */
  name: string;
  
  /** Whether the textarea is currently disabled. */
  disabled: boolean;
};

/** Additional action events to capture metadata during input captures. ex. Due dates, tags, etc. */ 
const MetadataTagElements = memo(({ type, metadataTags, name, disabled }: MetadataTagElementProps) => {
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
            <div onClick={(e) => onClickTag && onClickTag(e)} key={`${name}-${tagIcon}`}>
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
          <div className="ta-pill-actions" onClick={(e) => onClickTag && onClickTag(e)} key={`${name}-${tagLabel}`}>
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
            <div onClick={(e) => onClickTag && onClickTag(e)} key={`${name}-${tagIcon}`}>
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
}, (prevProps, nextProps) => {
  
  // If the input itself has been rebuilt for another form
  if (prevProps.type !== nextProps.type || prevProps.name !== nextProps.name) {
    return false;
  }
  
  // If the form's input was disabled, rerender
  if (prevProps.disabled !== nextProps.disabled) {
    return false; 
  }
  
  // Check if the metadata tags have changed
  const prevTags = prevProps.metadataTags;
  const nextTags = nextProps.metadataTags;
  const prevWasBoolean = (prevTags === true || prevTags === false);
  const nextWasBoolean = (nextTags === true || nextTags === false);
  if (prevWasBoolean !== nextWasBoolean) return false; // strictly a visual appearance option, but add here for safety
  
  // actual logic
  if (!prevWasBoolean && !nextWasBoolean && (prevTags !== undefined && nextTags !== undefined)) {
    if (prevTags.length !== nextTags.length) return false; // efficiency check
    
    const nextMap = new Map(nextTags.map(item => [item.tagLabel, item]));
    return prevTags.every(prevItem => {
      const nextItem = nextMap.get(prevItem.tagLabel);
      if (!nextItem) return false; // Item was replaced
      if (prevItem.tagLabel !== nextItem.tagLabel) return false;
      if (prevItem.tagIcon !== nextItem.tagIcon) return false;
      if (prevItem.iconStyles !== nextItem.iconStyles) return false;
      // Skip function check and hope we aren't doing anything too finnicky
    });
  }
  
  // If nothing changed, safely skip the rerender
  return true; 
});


/** Textarea's file attachment component props */
export interface TA_FileUploadProps extends FileUploadProps {
  /** The styles of the file attachment icon */
  iconStyles: string;
  
  /** Whether the uploaded file is required. */
  required?: boolean;
  /** Whether the uploaded file is disabled. */
  disabled?: boolean;
  
  /** Whether we're currently using react hook forms */
  isRhfMode: boolean;
  
  /** Whether it's an icon, or an icon with additional things like a text element. */
  children?: ReactNode;
}
const AttachFileElement = ({ name, accept, handleFiles, multiple, iconStyles, required, disabled, isRhfMode, children }: TA_FileUploadProps) => {
  const { setValue } = useFormContext() || {};
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // invoke the file input's native event for opening the file selection.
  const onClickDropdown = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    fileInputRef?.current?.click();
  }
  
  /** Input binding for rhf and additional event logic during file upload. */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(event?.target?.files || []);
    
    // Synthetic update and validation
    if (isRhfMode) setValue(name, files, { shouldDirty: true, shouldValidate: true });
    
    // ? Additional event logic
    handleFiles(files);
    
    // !Important: This allows the 'change' event to trigger if the user selects the same file again
    if (event.target) {
      event.target.value = '';
    }
  }
  
  if (true) return (
    <div onClick={onClickDropdown} className="rowStart gap-2">
      <HiddenInput 
        type="file"
        ref={fileInputRef} onChange={handleFileChange}
        disabled={disabled} required={required}
        accept={accept || ''} multiple={multiple}
        className='sr-only'
      />
      <Icon variant='AttachFile'  styles={iconStyles} />
      { children }
    </div>
  );
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
