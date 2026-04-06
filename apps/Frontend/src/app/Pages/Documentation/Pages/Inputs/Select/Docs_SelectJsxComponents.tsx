import { Select, SelectItemValues } from "@Project/ReactComponents";
import { Dispatch, SetStateAction, useState } from "react";


export const Example_SelectInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedValue, setSelectedValue] = useState<SelectItemValues>({ value: '', label: '' });
  const [projectIcons, setProjectIcons] = useState<SelectItemValues[]>([
    { value: 'attachFile', label: "Attach File", iconProps:       { icon: "AttachFile", placement: 'left' }},
    { value: 'checkbox', label: "Checkbox", iconProps:            { icon: "Checkbox", placement: 'left' }},
    { value: 'error', label: "Error", iconProps:                  { icon: "Error", placement: 'left' }},
    { value: 'plus', label: "Plus", iconProps:                    { icon: "Plus", placement: 'left' }},
    ...selectIcons
  ]);
  
  const onSelectValue = (selected: SelectItemValues, index: number) => {
    setSelectedValue(selected);
    // console.log('select: new value: ', {currentIcon, index, selectIcons});
  }

  return (
    <div>
      <Select 
        name={`select-form-name`}
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


const selectIcons: SelectItemValues[] = [
  { value: 'darkTheme', label: "Dark Theme", iconProps:         { icon: "DarkTheme", placement: 'left' }},
  { value: 'dropdownArrow', label: "Dropdown Arrow", iconProps: { icon: "DropdownArrow", placement: 'left' }},
  { value: 'envelope', label: "Envelope", iconProps:            { icon: "Envelope", placement: 'left' }},
  { value: 'infoBox', label: "Info box", iconProps:             { icon: "InfoBox", placement: 'left' }},
  { value: 'lightTheme', label: "Light Theme", iconProps:       { icon: "LightTheme", placement: 'left' }},
  { value: 'profile', label: "Profile", iconProps:              { icon: "Profile", placement: 'left' }},
  { value: 'SelectArrow', label: "Select Arrows", iconProps:    { icon: "SelectArrow", placement: 'left' }},
  { value: 'trash', label: "Trash", iconProps:                  { icon: "Trash", placement: 'left' }},
  { value: 'sort', label: "Sort", iconProps:                    { icon: "Sort", placement: 'left' }},
  { value: 'system', label: "System", iconProps:                { icon: "System", placement: 'left' }},
];