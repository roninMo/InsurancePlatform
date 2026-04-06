import { Select, SelectItemValues } from "@Project/ReactComponents";
import { Dispatch, SetStateAction, useId, useState } from "react";


export const Example_SelectInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState<SelectItemValues>({ value: '', label: '' });
  const [projectIcons, setProjectIcons] = useState<SelectItemValues[]>([
    { value: 'attachFile', label: "Attach File", iconProps:       { icon: "AttachFile", placement: 'left' }},
    { value: 'checkbox', label: "Checkbox", iconProps:            { icon: "Checkbox", placement: 'left' }},
    { value: 'error', label: "Error", iconProps:                  { icon: "Error", placement: 'left' }},
    { value: 'plus', label: "Plus", iconProps:                    { icon: "Plus", placement: 'left' }},
  ]);
  
  const onSelectValue = (selected: SelectItemValues, index: number) => {
    setSelectedValue(selected);
    // console.log('select: new value: ', {currentIcon, index, selectIcons});
  }

  return (
    <div>
      <Select 
        name={`select-${id}`}
        label="Select Component"
        placeholder="Select a value..."
        description="The select input's description."

        value={selectedValue}
        values={projectIcons}
        onSelect={onSelectValue}

        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required
      />
    </div>
  );
}

