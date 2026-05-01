import { Dropbox } from "@Project/ReactComponents"
import { useState } from "react";



export const Example_Dropbox = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const [files, setFiles] = useState<FileList | null>(null);
  
  const handleFiles = (files: FileList | null) => {
    setFiles(files);
    console.log('files uploaded: ', files);
  }

  return (
    <Dropbox 
      name="fileUpload"
      label="Upload files"
      description='The description of the dropbox.'
      value={files}
      handleFiles={handleFiles}
      multiple
      accept='image/*, .pdf, .doc, .docx, .txt'
      customIcon='Canvas'

      error={!!error}
      errorMessage='An error occurred.'
      disabled={disabled}
      required
    />
  )
}