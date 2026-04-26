import { useContext, useMemo, useRef, useState } from "react";
import { Select, SelectItem } from "@Project/ReactComponents";
import { TooltipService } from "@Project/ReactComponents";


export const Example_SelectInput = ({ error, disabled, closeOnLeave, keepOpenOnSlct, preventOpenOnTab }: {
  error: string;
  disabled: boolean;
  closeOnLeave?: boolean;
  keepOpenOnSlct?: boolean;
  preventOpenOnTab?: boolean;
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
    console.log('select: new value: ', selected);
  }
  
  // Prevent object from causing rerenders.
  const tooltipContent = useMemo(() => ({ text: "Tooltip text" }), []);

  // The universal tooltip provider
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

        // Error / Validation
        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required

        // Tooltip params
        tooltipContext={ tooltipContext }
        tooltipContent={ tooltipContent }
        
        // Dropdown options? 
        closeDropdownOnLeave={ closeOnLeave}
        keepDropdownOpenOnSelect={ keepOpenOnSlct} 
        preventOpenOnTabFocus={ preventOpenOnTab}
      />
    </div>
  );
}


export const Example_MultiSelectInput = ({ error, disabled, closeOnLeave, keepOpenOnSlct, preventOpenOnTab }: {
  error: string;
  disabled: boolean;
  closeOnLeave?: boolean;
  keepOpenOnSlct?: boolean;
  preventOpenOnTab?: boolean;
}) => {

  // raw data object
  const [projectIcons, setProjectIcons] = useState<SelectItem[]>([
    { value: 'attachFile', label: "Attach File", iconProps:       { icon: "AttachFile", placement: 'left' }},
    { value: 'checkbox', label: "Checkbox", iconProps:            { icon: "Checkbox", placement: 'left' }},
    { value: 'error', label: "Error", iconProps:                  { icon: "Error", placement: 'left' }},
    { value: 'plus', label: "Plus", iconProps:                    { icon: "Plus", placement: 'left' }},
    ...selectIcons
  ]);
  
  // state values for multiSelect
  const currentlySelected = useRef<SelectItem>({ value: '', label: '' }); // up to you which value is displayed as the current
  const [selectedValues, setSelectedValues] = useState<Record<string, SelectItem>>(
    Object.fromEntries(projectIcons.map(item => [item.value, item]))
  );
  
  const onSelectValue = (selected: SelectItem, index: number) => {
    const updatedSelection: SelectItem = { ...selected }; // rerender the SelectItem only w/new object and a memo.
    updatedSelection.selected = !updatedSelection.selected; 
    
    // if most recently selected, then update single display 
    if (updatedSelection.selected) currentlySelected.current = updatedSelection;

    // update the current list of selected values
    setSelectedValues(prevValue => {
      const newValue = { ...prevValue, [selected.value]: updatedSelection };
      console.log(`multiSelect::updated: ${prevValue[updatedSelection.value].label}: `, { 
        value: updatedSelection,
        values: newValue
      });
      return newValue;
    });
  }
  
    // Prevent object from causing rerenders.
    const tooltipContent = useMemo(() => ({ text: "Tooltip text" }), []);

  // The universal tooltip provider
  const tooltipContext = useContext(TooltipService);

  return (
    <div>
      <Select 
        name={`select-form-name`}
        label="Multi Select Component"
        placeholder="Select some values..."
        description="The select input's description."

        value={currentlySelected.current} // only shows current if there's only one selected
        values={Object.values(selectedValues)}
        onSelect={onSelectValue}
        multiSelect

        // Error / Validation
        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required

        // Tooltip params
        tooltipContext={ tooltipContext }
        tooltipContent={ tooltipContent }
        
        // Dropdown options? 
        closeDropdownOnLeave={ closeOnLeave}
        keepDropdownOpenOnSelect={ keepOpenOnSlct} 
        preventOpenOnTabFocus={ preventOpenOnTab}
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
