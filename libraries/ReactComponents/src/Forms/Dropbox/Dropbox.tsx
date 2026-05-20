import { DragEvent, MouseEvent, useEffect, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Icon, IconTypes } from "../../Common/Icons/Icon";
import { Ht } from '../../Common/Content/HeightTransWrapper/HeightTransWrapper';

import styled from '@emotion/styled';
import styles from './Dropbox.module.scss';


/** The file input type's props. These should be memoized. */
export interface FileUploadProps {
	/** the form name used for this input, and in Rhf's register function. */
  name: string;
	
	/** The file types that's accepted by this input. ex: accept='.pdf, .doc, .docx, .txt' */
  accept?: string;
	
	/** Event function for handling the input's changeEvent. Can be used alongside Rhf's change event. */
  handleFiles: (files: FileList | null) => void;
	
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
  additionalStyles, customIcon, iconStyles 
}: DropboxProps) => {
  const dropboxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const internalFiles = useRef<FileList>(null);
  
  // Input binding logic
  const { field } = useController({name}) || {};
  const { getValues } = useFormContext() || {};
  const isRhfMode = !disableHookForms && field;
  const formValues = getValues && getValues(name);
  
  console.log(`\n\nRerendered ${name}: isRhfMode(${isRhfMode}), \n files: `, 
    !disableHookForms ? formValues : internalFiles,
  );
  
  
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
    let newFiles = files;
    
    // If it's a multi file, add the additional files, otherwise capture the current file.
    if (multiple && (files instanceof FileList)) {
      const fileData: DataTransfer = new DataTransfer();
      const currentFiles = getFiles();
      
      // add the current and new files to the list.
      for (let i = 0; i < currentFiles?.length; i++) fileData.items.add(currentFiles[i]);
      for (let i = 0; i < files?.length; i++) fileData.items.add(files[i]);
      newFiles = fileData.files;
    }
    
    console.log(`handleFileUpload(${name}), old files: `, getFileList,
      `\n newFiles: `, newFiles
    );
    // TODO: We should add an option to switch between, and also a list of the current files below the dropbox
    
    if (isRhfMode) field.onChange(newFiles); 
    else internalFiles.current = newFiles; // custom state ref capture
    handleFiles(newFiles); // additional logic / custom state handling
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
  
  /** Removes a file from the current list of files */
  const removeFileFromList = (fileToRemove: File) => {
    let fileList: FileList | null = getFileList();
    const newList = new DataTransfer();
    if (!(fileList instanceof FileList)) return;
    
    // Create a new list and remove the current file
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.name != fileToRemove.name) {
        newList.items.add(fileList[i])
      }
    }
    
    if (isRhfMode) field.onChange(newList.files);
    else internalFiles.current = newList.files;
  }
  
  /** Returns the current files that we have for this input */
  const getFiles = (): File[] => {
    let files: File[] = [];
    let fileList: FileList | null = getFileList();
    
    if (!fileList) return [];
    for (let i = 0; i < fileList?.length; i++) {
      files.push(fileList[i]);
    }
    
    return files;
  }
  
  /** Returns the current fileList. */
  const getFileList = (): FileList | null => isRhfMode ? formValues : internalFiles.current;
  
  /** Error state */ 
  const getError = (): boolean => !disabled && !!error;
  
  
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
      
      <div className='dropbox-file-c'>
        { getFiles().map((file) => 
          <div className='dropbox-file-i'>
            <span className='dropbox-file-i-desc'>{ file.name }</span>
            <div onClick={() => removeFileFromList(file)}>
              <Icon variant='Close' styles='dropbox-file-i-close-btn' />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}


/* File types 
  - Images image/* or image/png, image/jpeg
  - Documents	.pdf, .doc, .docx, .txt
  - Excel	.xls, .xlsx, application/vnd.ms-excel
  - Video	video/*
*/
export const defaultFilesTypes = '.pdf, .doc, .docx, .txt';


// Styled Components
const Container = styled.div``;
const FileUpload = styled.div``;
const Descriptions = styled.div``;
const ErrorAndDesc = styled(Ht)``;
const HiddenInput = styled.input``;
