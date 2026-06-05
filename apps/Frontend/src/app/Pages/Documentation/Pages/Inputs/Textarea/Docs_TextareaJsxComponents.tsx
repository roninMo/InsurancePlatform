import { Dispatch, SetStateAction, useState, MouseEvent, ChangeEvent, useMemo, FormEvent } from "react";
import { SubmitErrorHandler, SubmitHandler, useFormContext } from "react-hook-form";
import { FileUploadProps, MetadataTagProps, Textarea } from "@Project/ReactComponents";


export const Example_DefaultTextareaInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { getValues, handleSubmit } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);
  const defaultMetadataTags: MetadataTagProps[] = useMemo(() => ([
      { tagIcon: 'Smile',     onClickTag: () => {}, iconStyles: undefined},
      { tagIcon: 'Tag',       onClickTag: () => {}, iconStyles: undefined},
      { tagIcon: 'Calendar',  onClickTag: () => {}, iconStyles: undefined},
  ]), []);
  
  const onUpdateValue = (pendingValue: string, e: FormEvent<HTMLTextAreaElement>) => {
    console.log(`onUpdateValue, pendingValue: `, pendingValue);
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // React hook forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('defaultTextareaFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    setValue(newValue);
    console.log(`value changed to ${newValue}`);
  }
  
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // Rhf submission data
    const onSubmit: SubmitHandler<any> = (data) => console.log(`successfully submitted: `, data);
    const onError: SubmitErrorHandler<any> = (error) => console.log(`an error occurred during submission: `, error);
    handleSubmit(onSubmit, onError)();
    
    // Logic for handling form submission...
    console.log(`custom submission data retrieval: `, { value, uploadedFiles });
  };
  
  const onAttachFile = (files: File[] | null) => {
    // Additional logic for handling file attachments
    setUploadedFiles(files);
    console.log(`files uploaded: `, files);
  };
  
  // Prevent unnecessary rerenders.
  const fileUpload: FileUploadProps = useMemo(() => ({
    name: 'defaultTextareaUpload',
    accept: 'image/*, .pdf, .doc, .docx, .txt',
    handleFiles: onAttachFile,
    multiple: true
  }), []);
  
  
  return (
    <div>
      <Textarea  
        type="default"
        name="defaultTextareaFormName"
        
        label="Default style"
        description="The description of the textarea."
        placeholder="input text..."
        
        onUpdateValue={onUpdateValue}
        // maskOpts={charsNumsSpcFilter}
        onTyped={onChangeValue}
        // disableHookForms
        
        onSubmit={onSubmitTextarea}
        submitButtonText="Post"
        submitButtonDisabled={disabled}
        
        error={error}
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
  const { getValues, handleSubmit } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);
  const boxMetadataTags: MetadataTagProps[] = useMemo(() => ([
    { tagLabel: 'assign',   tagIcon: 'Profile',   onClickTag: () => {}, iconStyles: undefined},
    { tagLabel: 'label',    tagIcon: 'Tag',       onClickTag: () => {}, iconStyles: undefined},
    { tagLabel: 'due date', tagIcon: 'Calendar',  onClickTag: () => {}, iconStyles: undefined},
  ]), []);
  
  const onUpdateValue = (pendingValue: string, e: FormEvent<HTMLTextAreaElement>) => {
    console.log(`onUpdateValue, pendingValue: `, pendingValue);
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // React hook forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('boxTextareaFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    setValue(newValue);
    console.log(`value changed to ${newValue}`);
  }
  
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // Rhf submission data
    const onSubmit: SubmitHandler<any> = (data) => console.log(`successfully submitted: `, data);
    const onError: SubmitErrorHandler<any> = (error) => console.log(`an error occurred during submission: `, error);
    handleSubmit(onSubmit, onError)();
    
    // Logic for handling form submission...
    console.log(`custom submission data retrieval: `, { value, uploadedFiles });
  };
  
  const onAttachFile = (files: File[] | null) => {
    // Additional logic for handling file attachments
    setUploadedFiles(files);
    console.log(`files uploaded: `, files);
  };
  
  // Prevent unnecessary rerenders.
  const fileUpload: FileUploadProps = useMemo(() => ({
    name: 'boxTextareaUpload',
    accept: 'image/*, .pdf, .doc, .docx, .txt',
    handleFiles: onAttachFile,
    multiple: true
  }), []);
  
  
  return (
    <div className="pt-2">
      <Textarea  
        name="boxTextareaFormName"
        type="box"
        
        label="Box style"
        description="The description of the textarea."
        placeholder="input text..."
        
        onUpdateValue={onUpdateValue}
        // maskOpts={charsNumsSpcFilter}
        onTyped={onChangeValue}
        // disableHookForms
        
        onSubmit={onSubmitTextarea}
        submitButtonText="Send"
        submitButtonDisabled={disabled}
        
        error={error}
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
  const { getValues, handleSubmit } = useFormContext() || {};
  const [value, setValue] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);
  const postMetadataTags: MetadataTagProps[] = useMemo(() => ([
    { tagIcon: 'Link',        onClickTag: () => {}, iconStyles: undefined},
    { tagIcon: 'CodeBracket', onClickTag: () => {}, iconStyles: undefined},
    { tagIcon: 'AtSymbol',    onClickTag: () => {}, iconStyles: undefined},
  ]), []);
  
  const onUpdateValue = (pendingValue: string, e: FormEvent<HTMLTextAreaElement>) => {
    console.log(`onUpdateValue, pendingValue: `, pendingValue);
  }
  
  const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // React hook forms
    console.log('\nreact-hook-forms getValues: ', getValues());
    const formValue = getValues('postTextareaFormName');
    
    // Capturing state manually
    const newValue = e?.target?.value;
    setValue(newValue);
    console.log(`value changed to ${newValue}`);
  }
  
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // Rhf submission data
    const onSubmit: SubmitHandler<any> = (data) => console.log(`successfully submitted: `, data);
    const onError: SubmitErrorHandler<any> = (error) => console.log(`an error occurred during submission: `, error);
    handleSubmit(onSubmit, onError)();
    
    // Logic for handling form submission...
    console.log(`custom submission data retrieval: `, { value, uploadedFiles });
  };
  
  const onAttachFile = (files: File[] | null) => {
    // Additional logic for handling file attachments
    setUploadedFiles(files);
    console.log(`files uploaded: `, files);
  };
  
  // Prevent unnecessary rerenders.
  const fileUpload: FileUploadProps = useMemo(() => ({
    name: 'postTextareaUpload',
    accept: 'image/*, .pdf, .doc, .docx, .txt',
    handleFiles: onAttachFile,
    multiple: true
  }), []);
  
  
  return (
    <div>
      <Textarea  
        type="post"
        name="postTextareaFormName"
        
        label="Post style"
        description="The description of the textarea."
        placeholder="input text..."
        
        onUpdateValue={onUpdateValue}
        // maskOpts={charsNumsSpcFilter}
        onTyped={onChangeValue}
        // disableHookForms
        
        onSubmit={onSubmitTextarea}
        submitButtonText="Post"
        submitButtonDisabled={disabled}
        
        error={error}
        disabled={disabled}
        required
        
        attachFile={fileUpload}
        metadataTags={postMetadataTags}
      />
    </div>
  );
}
