import { Dispatch, SetStateAction, useState, MouseEvent, ChangeEvent } from "react";
import { Textarea, MetadataTagProps } from "../../../../../Components/Forms/Textarea/Textarea";


export const Example_DefaultTextareaInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState<string>('');
  
  const onValueUpdated = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }
  
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // Logic for handling form submission...
  };
  
  const onAttachFile = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    // Additional logic for handling file attachments
  };

  return (
    <div>
      <Textarea  
        type="default"
        name="textarea-form-name"
        
        label="Default style"
        description="the description of the textarea."
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

        onAttachFile={onAttachFile}
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
  const boxMetadataTags: MetadataTagProps[] = [
    { tagLabel: 'assign', tagIcon: 'Profile', onClickTag: () => {}, iconStyles: ''},
    { tagLabel: 'label', tagIcon: 'Tag', onClickTag: () => {}, iconStyles: ''},
    { tagLabel: 'due date', tagIcon: 'Calendar', onClickTag: () => {}, iconStyles: ''},
  ];
  
  const onValueUpdated = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e?.target?.value;
    setValue(newValue);
  }
  
  const onSubmitTextarea = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // Logic for handling form submission...
  };
  
  const onAttachFile = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    // Additional logic for handling file attachments
  };
  
  return (
    <div className="pt-2">
      <Textarea  
        type="box"
        name="textarea-form-name"
        
        label="Box style"
        description="the description of the textarea."
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

        onAttachFile={onAttachFile}
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
  const postMetadataTags: MetadataTagProps[] = [
    { tagIcon: 'Link', iconStyles: '', onClickTag: () => {}},
    { tagIcon: 'CodeBracket', iconStyles: '', onClickTag: () => {}},
    { tagIcon: 'AtSymbol', iconStyles: '', onClickTag: () => {}},
  ];
  
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
