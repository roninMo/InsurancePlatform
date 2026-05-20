import { Dropbox } from "@Project/ReactComponents"
import { useState } from "react";
import { useFormContext } from "react-hook-form";



export const Example_Dropbox = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [files, setFiles] = useState<FileList | null>(null);
  
  const handleFiles = (files: FileList | null) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues('fileUploadFormName');
    
    // Capturing state manually
    console.log('files uploaded: ', files);
    setFiles(files);
  }

  return (
    <Dropbox 
      name="fileUploadFormName"
      label="Upload files"
      description='The description of the dropbox.'
      // value={files}
      handleFiles={handleFiles}
      // disableHookForms
      multiple
      accept='image/*, .pdf, .doc, .docx, .txt'
      customIcon='Canvas'

      error={error ? 'An error occurred.' : undefined}
      disabled={disabled}
      required
    />
  )
}