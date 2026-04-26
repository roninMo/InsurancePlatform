import { DragEvent, MouseEvent, useEffect, useRef } from 'react';
import { Icon, IconTypes } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './Dropbox.module.scss';


export interface FileUploadProps {
  name: string;
  handleFiles: (files: FileList | null) => void;
  multiple?: boolean;
  accept?: string;
}

export interface DropboxProps extends FileUploadProps {
  label?: string;
  description?: string;
  additionalStyles?: string;
  customIcon?: IconTypes;
  iconStyles?: string;

  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Dropbox = ({ 
  name, label, description, handleFiles, multiple, accept, 
  error, errorMessage, disabled, required,
  additionalStyles, customIcon, iconStyles 
}: DropboxProps) => {
  const dropboxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // invoke the file input's native event for opening the file selection.
  const onClickDropdown = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    fileInputRef?.current?.click();
  }

  const onDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files; 
    handleFileUpload(files);
  }

  const handleFileUpload = (files: FileList | null) => {
    // console.log('handling file upload: ', files);
    handleFiles(files); 
  }

  // Error state
  const getError = () => !disabled && error;


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
        console.log(`adding the dropbox-drag-hover class`);
        dropbox.classList.add('dropbox-drag-hover');
      }
    };

    // Only remove classes when it leaves the actual dropbox, and not to a nested dropbox child element
    const onDragLeave = (e: globalThis.DragEvent) => {
      e.preventDefault();
      nestedDragCounter.current--;
      
      if (nestedDragCounter.current === 0) {
        console.log(`removing the dropbox-drag-hover class`);
        dropbox.classList.remove('dropbox-drag-hover');
      }
    };

    // Remove the classes
    const onDrop = () => {
      nestedDragCounter.current = 0; // Reset counter so next drag starts fresh
      dropbox.classList.remove('dropbox-drag-hover');
        console.log(`onDrop: removing the dropbox-drag-hover class`);
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
        onClick={(e) => onClickDropdown(e)}
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

      <ErrorAndDesc className={`pl-1 mt-2 height-trans ${description || getError() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <p className={`height-trans-content text-sm ${getError() ? 'error-text' : 'text-colors'}`}>
          { getError() ? errorMessage : description } &nbsp;
        </p>
      </ErrorAndDesc>
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
const ErrorAndDesc = styled.div``;
const HiddenInput = styled.input``;
