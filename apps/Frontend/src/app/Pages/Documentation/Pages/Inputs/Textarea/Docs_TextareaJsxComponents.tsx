import { Dispatch, SetStateAction, useState, MouseEvent, ChangeEvent, useMemo } from "react";
import { MetadataTagProps, Textarea } from "@Project/ReactComponents";


export const Example_DefaultTextareaInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState<string>('');
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
    // Logic for handling form submission...
  };
  
  const onAttachFile = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    // Additional logic for handling file attachments
  };

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

        // onAttachFile={onAttachFile}
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
  };
  
  const onAttachFile = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    // Additional logic for handling file attachments
    console.log('attach file function', e);
  };
  
  return (
    <div className="pt-2">
      <Textarea  
        type="box"
        name="textarea-form-name"
        
        label="Box style"
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

        // onAttachFile={onAttachFile}
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
  };

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

        metadataTags={postMetadataTags}
      />
    </div>
  );
}
