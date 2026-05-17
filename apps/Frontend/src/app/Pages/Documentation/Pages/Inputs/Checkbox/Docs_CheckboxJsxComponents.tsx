import { ChangeEvent, useState } from "react";
import { Checkbox, CheckboxItem } from "@Project/ReactComponents";
import { useFormContext } from "react-hook-form";


export const Example_DefaultCheckbox = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [checkboxItems, setCheckboxItems] = useState<Record<string, CheckboxItem>>({
    "valueA": {
      label: "Option A",
      description: "Option A's description.",
      disabled: false,
      value: "valueA",
      checked: false
    },
    "valueB": {
      label: "Option B",
      description: "Option B's description.",
      disabled: false,
      value: "valueB",
      checked: false
    },
  });
  
  const onCheckedItem = (event: ChangeEvent<HTMLInputElement>, newValue: CheckboxItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`checkboxFormName`];
    
    // Capturing state manually
    console.log('checked values: ', newValue, `\n all values: `, checkboxItems);
    setCheckboxItems(prev => ({ ...prev, [newValue.value]: newValue }));
  }
  
  
  return (
    <div>
      <Checkbox 
        name={`checkboxFormName`}
        variant="default"
        label="Default Checkbox"
        description="The checkbox component's description."
        
        items={checkboxItems}
        onSelect={onCheckedItem} // optional with Rhf, otherwise use to update state
        // disableHookForms
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        
        error={error}
        disabled={disabled}
        required
      />
    </div>
  );
}


export const Example_ListCheckbox = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [checkboxItems, setCheckboxItems] = useState<Record<string, CheckboxItem>>({
    "valueA": {
      label: "Option A",
      description: "Option A's description.",
      disabled: false,
      value: "valueA",
      checked: false
    },
    "valueB": {
      label: "Option B",
      description: "Option B's description.",
      disabled: false,
      value: "valueB",
      checked: false
    },
  });
  
  const onCheckedItem = (event: ChangeEvent<HTMLInputElement>, newValue: CheckboxItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`checkboxFormName`];
    
    // Capturing state manually
    console.log('checked values: ', newValue, `\n all values: `, checkboxItems);
    setCheckboxItems(prev => ({ ...prev, [newValue.value]: newValue }));
  }
  
  
  return (
    <div>
      <Checkbox 
        name={`CheckboxComponent`}
        variant="list"
        label="List Checkbox"
        description="The checkbox component's description."
        
        items={checkboxItems}
        onSelect={onCheckedItem} // optional with Rhf, otherwise use to update state
        // disableHookForms
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        
        error={error}
        disabled={disabled}
        required
      />
    </div>
  );
}


export const Example_InlineCheckbox = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [checkboxItems, setCheckboxItems] = useState<Record<string, CheckboxItem>>({
    "valueA": {
      label: "Option A",
      description: "Option A's description.",
      disabled: false,
      value: "valueA",
      checked: false
    },
    "valueB": {
      label: "Option B",
      description: "Option B's description.",
      disabled: false,
      value: "valueB",
      checked: false
    },
  });
  
  const onCheckedItem = (event: ChangeEvent<HTMLInputElement>, newValue: CheckboxItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`checkboxFormName`];
    
    // Capturing state manually
    console.log('checked values: ', newValue, `\n all values: `, checkboxItems);
    setCheckboxItems(prev => ({ ...prev, [newValue.value]: newValue }));
  }
  
  
  return (
    <div>
      <Checkbox 
        name={`checkbox-form-name`}
        variant="inline"
        label="Inline Checkbox"
        description="The checkbox component's description."
        
        items={checkboxItems}
        onSelect={onCheckedItem} // optional with Rhf, otherwise use to update state
        // disableHookForms
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        
        error={error}
        disabled={disabled}
        required
      />
    </div>
  );
}
