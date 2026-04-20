import { Select, SelectItem } from "@Project/ReactComponents";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { TooltipService } from "../../../../../Components/Utils/Tooltip/TooltipProvider/TooltipProvider";


export const Example_SelectInput = ({ error, setError, disabled, setDisabled }: {
  error: string;
  setError?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedValue, setSelectedValue] = useState<SelectItem>({ value: '', label: '' });
  const [projectIcons, setProjectIcons] = useState<SelectItem[]>([
    { value: 'attachFile', label: "Attach File", iconProps:       { icon: "AttachFile", placement: 'left' }},
    { value: 'checkbox', label: "Checkbox", iconProps:            { icon: "Checkbox", placement: 'left' }},
    { value: 'error', label: "Error", iconProps:                  { icon: "Error", placement: 'left' }},
    { value: 'plus', label: "Plus", iconProps:                    { icon: "Plus", placement: 'left' }},
    ...selectIcons
  ]);
  
  const onSelectValue = (selected: SelectItem, index: number) => {
    setSelectedValue(selected);
    // console.log('select: new value: ', {currentIcon, index, selectIcons});
  }

  // universal tooltip provider
  const tooltipContext = useContext(TooltipService);

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
        multiSelect

        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required

        tooltip={{ context: tooltipContext, content: { text: "Tooltip text..." }}}
        opts={{
          // TODO: add state refs for these values, and another variant in the docs for multiSelect
          // closeDropdownOnLeave: true,
          // keepDropdownOpenOnSelect: true, 
          // preventOpenOnTabFocus: true,
        }}
      />
    </div>
  );
}


const selectIcons: SelectItem[] = [
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
