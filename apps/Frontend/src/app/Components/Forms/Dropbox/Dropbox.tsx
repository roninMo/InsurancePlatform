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

  // drag over styling
  useEffect(() => {
    const dropbox = dropboxRef.current;
    if (!dropbox) return;

    const handleDragStyle = (action: 'add' | 'remove') => (e: globalThis.DragEvent) => {
      e.preventDefault();
      console.log(`${action == 'add' ? 'adding' : 'removing'} the drag hover style`);
      dropbox.classList[action]('dropbox-drag-hover');
    }

    // Capture the specific function references, and invoke them
    const onEnter = handleDragStyle('add');
    const onLeave = handleDragStyle('remove');
    dropbox.addEventListener('dragenter', onEnter);
    dropbox.addEventListener('dragleave', onLeave);

    return () => {
      dropbox.removeEventListener('dragenter', onEnter);
      dropbox.removeEventListener('dragleave', onLeave);
    }
  }, []);

  // Error state
  const getError = () => !disabled && error;


  return (
    <Container className='dropbox-c' ref={dropboxRef}>
      { label && <label className='dropbox-label'>{ label }</label> }

      <FileUpload 
        className={`dropbox ${additionalStyles}`}
        onClick={(e) => onClickDropdown(e)}
        onDragOver={(e) => e.preventDefault() } // Prevent opening the file in a new tab
        onDrop={(e) => onDropFiles(e)}
      >
        { customIcon 
          ? <Icon variant={customIcon} styles={iconStyles ? iconStyles : 'dropbox-icon'} />
          : <Icon variant='Canvas' styles='dropbox-icon' />
        }

        <Descriptions className='dropbox-text-c'>
          <p className='dropbox-up-link'>Choose a file</p> &nbsp;
          <p className='dropbox-text'>or drag it here.</p>
        </Descriptions>

        <HiddenInput 
          type="file"
          name={name}
          onChange={(e) => handleFileUpload(e.target.files)}
          ref={fileInputRef}

          accept={accept || ''}
          multiple={multiple}
          className='sr-only'

          disabled={disabled}
          required={required}
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
const defaultFiles = '.pdf, .doc, .docx, .txt';


// Styled Components
const Container = styled.div``;
const FileUpload = styled.div``;
const Descriptions = styled.div``;
const ErrorAndDesc = styled.div``;
const HiddenInput = styled.input``;