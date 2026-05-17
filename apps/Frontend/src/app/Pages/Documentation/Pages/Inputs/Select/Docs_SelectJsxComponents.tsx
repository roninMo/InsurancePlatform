import { useContext, useMemo, useRef, useState } from "react";
import { Select, SelectItem } from "@Project/ReactComponents";
import { TooltipService } from "@Project/ReactComponents";
import { useFormContext } from "react-hook-form";


export const Example_SelectInput = ({ error, disabled, closeOnLeave, keepOpenOnSlct, preventOpenOnTab }: {
  error: string;
  disabled: boolean;
  closeOnLeave?: boolean;
  keepOpenOnSlct?: boolean;
  preventOpenOnTab?: boolean;
}) => {
  // React hook forms
  const { getValues } = useFormContext() || {};
  
  // raw data object
  const [values, setValues] = useState<SelectItem[]>([
    { value: 'attachFile', label: "Attach File", iconProps:       { icon: "AttachFile", placement: 'left' }},
    { value: 'checkbox', label: "Checkbox", iconProps:            { icon: "CircleOkay", placement: 'left' }},
    { value: 'error', label: "Error", iconProps:                  { icon: "CircleError", placement: 'left' }},
    { value: 'plus', label: "Plus", iconProps:                    { icon: "Plus", placement: 'left' }},
    ...projectIcons
  ]);
  
  const onSelectValue = (newValue: SelectItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`select-form-name`];
    
    // Capturing state manually
    setValues(prev => prev.map(val => val.value === newValue.value ? newValue : val));
    console.log('select: new value: ', newValue, `\nall values: `, values);
  }
  
  // Prevent object from causing rerenders.
  const tooltipContent = useMemo(() => ({ text: "Tooltip text" }), []);
  
  // The universal tooltip provider
  const tooltipContext = useContext(TooltipService);
  
  
  return (
    <div>
      <Select 
        label="Select Component"
        name={`select-form-name`}
        placeholder="Select a value..."
        description="The select input's description."
        
        values={values}
        onSelect={onSelectValue} // optional with Rhf, otherwise use to update state
        // disableHookForms
        
        // Error / Validation
        error={error}
        disabled={disabled}
        required
        
        // Tooltip params
        tooltipContext={ tooltipContext }
        tooltipContent={ tooltipContent }
        
        // Dropdown options? 
        closeDropdownOnLeave={ closeOnLeave }
        keepDropdownOpenOnSelect={ keepOpenOnSlct } 
        preventOpenOnTabFocus={ preventOpenOnTab }
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
  // React hook forms
  const { getValues } = useFormContext() || {};
  
  // raw data object
  const [values, setValues] = useState<SelectItem[]>([
    { value: 'attachFile', label: "Attach File", iconProps:       { icon: "AttachFile", placement: 'left' }},
    { value: 'checkbox', label: "Checkbox", iconProps:            { icon: "CircleOkay", placement: 'left' }},
    { value: 'error', label: "Error", iconProps:                  { icon: "CircleError", placement: 'left' }},
    { value: 'plus', label: "Plus", iconProps:                    { icon: "Plus", placement: 'left' }},
    ...projectIcons
  ]);
  
  const onSelectValue = (newValue: SelectItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`select-form-name`];
    
    // Capturing state manually
    setValues(prev => prev.map(val => val.value === newValue.value ? newValue : val));
    console.log('select: new value: ', newValue, `\nall values: `, values);
  }
  
  // Prevent object from causing rerenders.
  const tooltipContent = useMemo(() => ({ text: "Tooltip text" }), []);
  
  // The universal tooltip provider
  const tooltipContext = useContext(TooltipService);
  
  
  return (
    <div>
      <Select 
        label="Multi Select Component"
        name={`select-form-name`}
        placeholder="Select some values..."
        description="The select input's description."
        
        values={values}
        onSelect={onSelectValue} // optional with Rhf, otherwise use to update state
        // disableHookForms
        multiSelect
        
        // Error / Validation
        error={error}
        disabled={disabled}
        required
        
        // Tooltip params
        tooltipContext={ tooltipContext }
        tooltipContent={ tooltipContent }
        
        // Dropdown options? 
        closeDropdownOnLeave={ closeOnLeave }
        keepDropdownOpenOnSelect={ keepOpenOnSlct } 
        preventOpenOnTabFocus={ preventOpenOnTab }
      />
    </div>
  );
}


const projectIcons: SelectItem[] = [
  { value: 'darkTheme', label: "Dark Theme", iconProps:         { icon: "DarkTheme", placement: 'left' }},
  { value: 'dropdownArrow', label: "Dropdown Arrow", iconProps: { icon: "DropdownArrow", placement: 'left' }},
  { value: 'envelope', label: "Envelope", iconProps:            { icon: "Envelope", placement: 'left' }},
  { value: 'infoBox', label: "Info box", iconProps:             { icon: "CircleInfo", placement: 'left' }},
  { value: 'lightTheme', label: "Light Theme", iconProps:       { icon: "LightTheme", placement: 'left' }},
  { value: 'profile', label: "Profile", iconProps:              { icon: "Profile", placement: 'left' }},
  { value: 'SelectArrow', label: "Select Arrows", iconProps:    { icon: "SelectArrow", placement: 'left' }},
  { value: 'trash', label: "Trash", iconProps:                  { icon: "Trash", placement: 'left' }},
  { value: 'sort', label: "Sort", iconProps:                    { icon: "Sort", placement: 'left' }},
  { value: 'system', label: "System", iconProps:                { icon: "System", placement: 'left' }},
];
