import { Dispatch, SetStateAction, useState, MouseEvent, ChangeEvent, useMemo } from "react";
import { FileUploadProps, MetadataTagProps, Textarea } from "@Project/ReactComponents";


export const Example_DefaultTextareaInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();
  const defaultMetadataTags: MetadataTagProps[] = useMemo(() => ([
      { tagIcon: 'Smile',     onClickTag: () => {}, iconStyles: undefined},
      { tagIcon: 'Tag',       onClickTag: () => {}, iconStyles: undefined},
      { tagIcon: 'Calendar',  onClickTag: () => {}, iconStyles: undefined},
  ]), []);
  
  const onValueUpdated = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }
  
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // Logic for handling input or form submission...
    console.log(`submitting the textarea's data`, { value, uploadedFiles});
  };
  
  const onAttachFile = (files: FileList | null) => {
    // Additional logic for handling file attachments
    console.log(`files uploaded: `, files);
    setUploadedFiles(files || undefined);
  };

  // Prevent unnecessary rerenders.
  const fileUpload: FileUploadProps = useMemo(() => ({
    name: 'textarea-upload-form-name',
    accept: 'image/*, .pdf, .doc, .docx, .txt',
    handleFiles: onAttachFile,
    multiple: true
  }), []);


  return (
    <div>
      <Textarea  
        type="default"
        name="textarea-form-name"
        
        label="Default style"
        description="The description of the textarea."
        placeholder="input text..."
        value={value}
        onChange={(e) => onValueUpdated(e)}

        onSubmit={onSubmitTextarea}
        submitButtonText="Post"
        submitButtonDisabled={disabled}

        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required

        attachFile={fileUpload}
        metadataTags={defaultMetadataTags}
      />
    </div>
  );
}


export const Example_BoxTextareaInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();
  const boxMetadataTags: MetadataTagProps[] = useMemo(() => ([
    { tagLabel: 'assign',   tagIcon: 'Profile',   onClickTag: () => {}, iconStyles: undefined},
    { tagLabel: 'label',    tagIcon: 'Tag',       onClickTag: () => {}, iconStyles: undefined},
    { tagLabel: 'due date', tagIcon: 'Calendar',  onClickTag: () => {}, iconStyles: undefined},
  ]), []);
  
  const onValueUpdated = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }
  
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // Logic for handling form submission...
    console.log(`submitting the textarea's data`, { value, uploadedFiles});
  };
  
  const onAttachFile = (files: FileList | null) => {
    // Additional logic for handling file attachments
    console.log(`files uploaded: `, files);
    setUploadedFiles(files || undefined);
  };

  // Prevent unnecessary rerenders.
  const fileUpload: FileUploadProps = useMemo(() => ({
    name: 'textarea-upload-form-name',
    accept: 'image/*, .pdf, .doc, .docx, .txt',
    handleFiles: onAttachFile,
    multiple: true
  }), []);


  return (
    <div className="pt-2">
      <Textarea  
        type="box"
        name="textarea-form-name"
        
        label="Box style"
        // description="The description of the textarea."
        placeholder="input text..."
        value={value}
        onChange={(e) => onValueUpdated(e)}

        onSubmit={onSubmitTextarea}
        submitButtonText="Post"
        submitButtonDisabled={disabled}

        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required

        attachFile={fileUpload}
        metadataTags={boxMetadataTags}
      />
    </div>
  );
}


export const Example_PostTextareaInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();
  const postMetadataTags: MetadataTagProps[] = useMemo(() => ([
    { tagIcon: 'Link',        onClickTag: () => {}, iconStyles: undefined},
    { tagIcon: 'CodeBracket', onClickTag: () => {}, iconStyles: undefined},
    { tagIcon: 'AtSymbol',    onClickTag: () => {}, iconStyles: undefined},
  ]), []);
  
  const onValueUpdated = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }
  
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // Logic for handling form submission...
    console.log(`submitting the textarea's data`, { value, uploadedFiles});
  };

  const onAttachFile = (files: FileList | null) => {
    // Additional logic for handling file attachments
    console.log(`files uploaded: `, files);
    setUploadedFiles(files || undefined);
  };

  // Prevent unnecessary rerenders.
  const fileUpload: FileUploadProps = useMemo(() => ({
    name: 'textarea-upload-form-name',
    accept: 'image/*, .pdf, .doc, .docx, .txt',
    handleFiles: onAttachFile,
    multiple: true
  }), []);


  return (
    <div>
      <Textarea  
        type="post"
        name="textarea-form-name"
        
        label="Post style"
        description="The description of the textarea."
        placeholder="input text..."
        value={value}
        onChange={(e) => onValueUpdated(e)}

        onSubmit={onSubmitTextarea}
        submitButtonText="Post"
        submitButtonDisabled={disabled}

        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required

        attachFile={fileUpload}
        metadataTags={postMetadataTags}
      />
    </div>
  );
}
