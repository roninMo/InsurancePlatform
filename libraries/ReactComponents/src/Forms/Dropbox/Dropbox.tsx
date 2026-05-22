import { DragEvent, memo, MouseEvent, useEffect, useReducer, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Icon, IconTypes } from "../../Common/Icons/Icon";
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './Dropbox.module.scss';
import { Button } from '../Button/Button';


/** The file input type's props. These should be memoized. */
export interface FileUploadProps {
	/** the form name used for this input, and in Rhf's register function. */
  name: string;
	
	/** The file types that's accepted by this input. ex: accept='.pdf, .doc, .docx, .txt' */
  accept?: string;
	
	/** Event function for handling the input's changeEvent. Can be used alongside Rhf's change event. */
  handleFiles: (files: File[] | null) => void;
	
	/** Whether to accept multiple files */
  multiple?: boolean;
}

/** The Dropbox component's props */
export interface DropboxProps extends FileUploadProps {	
	/** The Dropbox's label. */
  label?: string;
	
	/** The Dropbox's description. */
  description?: string;
	
	/** Additional styles for the Dropbox.	*/
  additionalStyles?: string;
	
  /** The variant of the file list you want enabled by default */
  fileListType?: FileListVariant;
  
  /** The color theme of the select files list */
  fileListTheme?: FileListTheme;
  
	/** Optional custom icon for the file upload drop zone. */
  customIcon?: IconTypes;
	
	/** The drop zone icon's styles. */
  iconStyles?: string;
	
  /** Whether we should use custom state handling instead of React hook forms. */
  disableHookForms?: boolean;
  
	/** The error message, if there is one. */
  error?: string;
	
	/** Whether the input is disabled. */
  disabled?: boolean;
	
	/** Whether the input is required.	*/
  required?: boolean;
}


export const Dropbox = ({ 
  name, label, description, handleFiles, multiple, accept, 
  disableHookForms, error, disabled, required,
  additionalStyles, fileListType = 'list', fileListTheme = 'green', customIcon, iconStyles 
}: DropboxProps) => {
  const dropboxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const internalFiles = useRef<File[]>([]);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  // * Input binding logic
  const { field } = useController({ name, defaultValue: [] }) || {};
  const { getValues } = useFormContext() || {};
  const isRhfMode = !disableHookForms && !!field;
  const formValues = getValues && getValues(name);
  
  
  /** Returns the current files that we have for this input */
  const getFiles = (): File[] => {
    if (isRhfMode) {
      if (!field.value || !Array.isArray(field.value)) return [];
      return field.value;
    }
    
    // default logic
    return internalFiles.current;
  }
  
  /** Error state */ 
  const getError = (): boolean => !disabled && !!error;
  
  /** Utility to handle passing the new data to the events, native input, and rerender logic */
  const updateComponentState = (files: File[]) => {
    // Update react hook form's value
    if (isRhfMode) field.onChange(files);
    
    // update our internal state, and rerender for the selected file list
    else {
      internalFiles.current = files;
      forceUpdate();
    }
    
    
    // any additional logic / custom state handling
    handleFiles(files); 
    
    // !Important: This allows the 'change' event to trigger if the user selects the same file again
    // The native input will only capture the first file from the list, we clear that after the onChange to handle this behavior w/useController
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
  
  /**
   * Handles passing the captured files to each of the proper events for input and state logic. 
   * 
   * By default, this component should handle it's own rerenders, and 
   * since this is a custom input, we're passing the files directly to the rhf onChange and our change event.
   * 
   * ---
   * @param selected    The @see SelectItem that was just selected.
   */
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const uploadedFilesArray = Array.from(files);
    let updatedFiles: File[] = [];
    
    // If it's a multi file, add the additional files, otherwise capture the current file.
    if (multiple) {
      const currentFiles = getFiles();
      // Filter out files from our current state if they match incoming file names
      const uniqueCurrentFiles = currentFiles.filter(
        (currentFile) => !uploadedFilesArray.some((newFile) => newFile.name === currentFile.name)
      );
      
      // Merge remaining unique existing files with the newly uploaded ones
      updatedFiles = [...uniqueCurrentFiles, ...uploadedFilesArray];
    } else updatedFiles = [uploadedFilesArray[0]];
    
    
    // pass the updated state to the proper events
    // console.log(`handleFileUpload(${name}), old files: `, uploadedFilesArray,
    //   `\n updatedFiles: `, updatedFiles
    // );
    updateComponentState(updatedFiles);
  }
  
  /** Removes a file from the current list of files */
  const removeFileFromList = (fileToRemove: File) => {
    const currentFiles = getFiles();
    const filteredFiles = currentFiles.filter((file) => file.name !== fileToRemove.name);
    
    // pass the updated state to the proper events
    updateComponentState(filteredFiles);
  }
  
  /** When a user clicks on the dropbox, it invoke's the file input's native event top open the file selection menu */
  const onClickDropbox = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    fileInputRef?.current?.click();
  }
  
  /** The drag/drop event that passes onDrop's captured files to the change event. */
  const onDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files; 
    handleFileUpload(files);
  }
  
  // ? Rerender state
  // console.log(`\n\nRerendered ${name}: isRhfMode(${isRhfMode}), \n files: `, 
  //   getFiles(),
  // );
  
  
  //--------------------------------------//
  // drag over styling                    //
  //--------------------------------------//
  const nestedDragCounter = useRef(0);
  useEffect(() => {
    const dropbox = dropboxRef.current;
    if (!dropbox) return;
    
    // Handle dragLeave/dragEnter on children, w/counter starting at 1 for the dropbox.
    const onDragEnter = (e: globalThis.DragEvent) => {
      e.preventDefault();
      nestedDragCounter.current++;
      
      if (nestedDragCounter.current === 1) {
        // console.log(`adding the dropbox-drag-hover class`);
        dropbox.classList.add('dropbox-drag-hover');
      }
    };
    
    // Only remove classes when it leaves the actual dropbox, and not to a nested dropbox child element
    const onDragLeave = (e: globalThis.DragEvent) => {
      e.preventDefault();
      nestedDragCounter.current--;
      
      if (nestedDragCounter.current === 0) {
        // console.log(`removing the dropbox-drag-hover class`);
        dropbox.classList.remove('dropbox-drag-hover');
      }
    };
    
    // Remove the classes
    const onDrop = () => {
      nestedDragCounter.current = 0; // Reset counter so next drag starts fresh
      dropbox.classList.remove('dropbox-drag-hover');
      // console.log(`onDrop: removing the dropbox-drag-hover class`);
    };
    
    dropbox.addEventListener('dragenter', onDragEnter);
    dropbox.addEventListener('dragleave', onDragLeave);
    dropbox.addEventListener('drop', onDrop); // Essential to clean up the style
    
    return () => {
      dropbox.removeEventListener('dragenter', onDragEnter);
      dropbox.removeEventListener('dragleave', onDragLeave);
      dropbox.removeEventListener('drop', onDrop);
    };
  }, []);
  
  /** Changes the display for the currently selected files */
  const [sfVariant, setSfVariant] = useState<FileListVariant>(fileListType);
  const onChangeSfVariant = (variant: FileListVariant) => setSfVariant(variant);
  
  return (
    <Container className='dropbox-c' ref={dropboxRef}>
      { label && <label className='dropbox-label'>{ label }</label> }
      
      <FileUpload 
        onClick={(e) => onClickDropbox(e)}
        onDragOver={(e) => e.preventDefault() } // Prevent opening the file in a new tab
        onDrop={(e) => onDropFiles(e)}
        className={`dropbox ${disabled ? 'dropbox-disabled' : error ? 'dropbox-err' : ''} ${additionalStyles}`}
      >
        { customIcon 
          ? <Icon variant={customIcon} styles={iconStyles ? iconStyles : 'dropbox-icon'} />
          : <Icon variant='Canvas' styles='dropbox-icon' />
        }
        
        <Descriptions className='dropbox-text-c'>
          <p className={`${!disabled ? 'dropbox-up-link' : 'dropbox-up-link-d'}`}>
            Choose a file
          </p> &nbsp;
          <p className={`${!disabled ? 'dropbox-text' : 'dropbox-text-d'}`}>
            or drag it here.
          </p>
        </Descriptions>
        
        <HiddenInput 
          name={name} type="file" ref={fileInputRef}
          onChange={(e) => handleFileUpload(e.target.files)}
          
          accept={accept || ''}
          multiple={multiple}
          className='sr-only'
          
          disabled={disabled} required={required}
        />
      </FileUpload>
      
      <ErrorAndDesc show={!!description || getError()} styles='pl-1 mt-2' cStyles={`text-sm ${getError() ? 'error-text' : 'text-colors'}`}>
        { getError() ? error : description } &nbsp;
      </ErrorAndDesc>
      
      
      {/* Selected files */}
      <SelectedFileList 
        show={getFiles()?.length >= 1} styles='p-1'
        cStyles={getFiles()?.length >= 1 ? 'animate-fade-in' : 'animate-fade-out'}
      >
        <div className='dropbox-sf-dropdown-hc'>
          <div className='dropbox-sf-dropdown-h'>
            Files
          </div>
          
          <Button 
            displayText='List' 
            onClick={() => onChangeSfVariant('list')}
            color='none' additionalStyles={`dropbox-sf-dd-var-l ${sfVariant == 'list' ? 'selected-box' : ''}`} 
          />
          <Button 
            displayText='Box' 
            onClick={() => onChangeSfVariant('box')}
            color='none' additionalStyles={`dropbox-sf-dd-var-b ${sfVariant == 'box' ? 'ok-box' : ''}`} 
          />
        </div>
        
        <Ht show={sfVariant == 'box'} styles={`${sfVariant == 'box' ? 'animate-fade-in' : 'animate-fade-out'}`}>
          <SelectedFiles 
            files={getFiles()} name={name} 
            variant='box' theme={fileListTheme}
            removeFileFromList={removeFileFromList}
          />
        </Ht>
        <Ht show={sfVariant == 'list'} styles={`${sfVariant == 'list' ? 'animate-fade-in' : 'animate-fade-out'}`}>
          <SelectedFiles 
            files={getFiles()} name={name} 
            variant='list' theme={fileListTheme}
            removeFileFromList={removeFileFromList}
          />
        </Ht>
      </SelectedFileList>
    </Container>
  );
}


// Styled Components
const Container = styled.div``;
const FileUpload = styled.div``;
const Descriptions = styled.div``;
const SelectedFileList = styled(Ht)``;
const ErrorAndDesc = styled(Ht)``;
const HiddenInput = styled.input``;

/* File types 
  - Images image/* or image/png, image/jpeg
  - Documents	.pdf, .doc, .docx, .txt
  - Excel	.xls, .xlsx, application/vnd.ms-excel
  - Video	video/*
*/
export const defaultFilesTypes = '.pdf, .doc, .docx, .txt';


/** The variant of the file list you want enabled by default */
export type FileListVariant = 'list' | 'box';
  
/** The color theme of the select files list */
export type FileListTheme = 'default' | 'green' | 'blue';

const SelectedFiles = memo(({ name, files, removeFileFromList, variant, theme }: { 
  name: string,
  files: File[] | null,  
  removeFileFromList: (fileToRemove: File) => void;
  variant: FileListVariant,
  theme: FileListTheme,
}) => {
  if (variant == 'list') return (
    <div className='dropbox-file-c-l'>
      { files?.map((file) => 
        <SelBox key={`${name}-sf-list-${file.name}`}
          className={`dbx-sf-list
            ${theme == 'default' ? 'dbx-sf-box-default hover:faded-def-box' : ''}
            ${theme == 'blue' ? 'dbx-sf-box-blue hover:selected-box' : ''}
            ${theme == 'green' ? 'dbx-sf-box-green hover:ok-box' : ''}
          `} 
        >
          <span className='dbx-sf-desc hover:theme-f'>
            <span className='input-colors not-italic pr-2'>
              Filename:
            </span> 
            { file.name }
          </span>
          <div onClick={() => removeFileFromList(file)}>
            <Icon variant='Close' styles='dbx-sf-box-close-btn' />
          </div>
        </SelBox>
      )}
    </div>
  );
  
  // else variant == 'box'
  return (
    <div className='dropbox-file-c-b'>
      { files?.map((file) => 
        <SelBox key={`${name}-sf-box-${file.name}`}
          className={`dbx-sf-box
            ${theme == 'default' ? 'dbx-sf-box-default' : ''}
            ${theme == 'blue' ? 'dbx-sf-box-blue' : ''}
            ${theme == 'green' ? 'dbx-sf-box-green' : ''}
          `} 
        >
          <span className='dbx-sf-desc max-w-24'>
            { file.name }
          </span>
          <div onClick={() => removeFileFromList(file)}>
            <Icon variant='Close' styles='dbx-sf-box-close-btn' />
          </div>
        </SelBox>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  
  // If the input itself has been rebuilt for another form
  if (prevProps.name !== nextProps.name) {
    return false;
  }
  
  // If the display has changed, rerender
  if (prevProps.variant !== nextProps.variant || prevProps.theme !== nextProps.theme) {
    return false; 
  }
  
  // Check if the files passed in have inherently changed
  const prevFiles = prevProps.files;
  const newFiles = nextProps.files;
  
  // if they added or removed a file
  if (prevFiles?.length !== newFiles?.length) {
    return false;
  }
  
  // if the file count is the same, check if the files in the array (via the order) are the same.
  if (newFiles?.length && prevFiles?.length) {
    for (let i = 0; i < newFiles?.length; i++) {
      const newFile = newFiles[i];
      const prevFile = prevFiles[i];
      
      if (newFile.name !== prevFile.name || newFile.size !== prevFile.size) {
        return false;
      }
    }
  }
  
  // If nothing changed, safely skip the rerender
  return true; 
});


// Selected Files Styled Components
const SelBox = styled.div``;

