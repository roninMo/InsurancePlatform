import { ChangeEvent, useState } from "react";
import { RadioGroup, RadioItem } from "@Project/ReactComponents";
import { useFormContext } from "react-hook-form";


export const Example_DefaultRadioGroup = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      selected: false,
    };
  }));
  
  const onSelectRadioItem = (event: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`radioGroupFormName-default`];
    
    // Capturing state manually
    console.log('selected value: ', selected, `\n all values: `, radioItems);
  }
  
  return (
    <div>
      <RadioGroup
        variant="default"
        name={`radioGroupFormName-default`}
        label="Default Style"
        description="The description of the radio group."
        
        radioItems={radioItems}
        onSelect={onSelectRadioItem}
        // disableHookForms
        
        error={error}
        disabled={disabled}
        required
      />
    </div>
  );
}

export const Example_ColumnRadioGroup = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}.`,
    };
  }));
  
  const onSelectRadioItem = (event: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`radioGroupFormName-column`];
    
    // Capturing state manually
    console.log('selected value: ', selected, `\n all values: `, radioItems);
  }
  
  
  return (
    <div>
      <RadioGroup
        variant="column"
        name={`radioGroupFormName-column`}
        label="Column Style"
        description="The description of the radio group."
        
        radioItems={radioItems}
        onSelect={onSelectRadioItem}
        // disableHookForms
        
        error={error}
        disabled={disabled}
        required
      />
    </div>
  );
}

export const Example_ColumnInlineRadioGroup = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}.`,
    };
  }));
  
  const onSelectRadioItem = (event: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`radioGroupFormName-ci`];
    
    // Capturing state manually
    console.log('selected value: ', selected, `\n all values: `, radioItems);
  }
  
  
  return (
    <div>
      <RadioGroup
        variant="columnInline"
        name={`radioGroupFormName-ci`}
        label="ColumnInline Style"
        description="The description of the radio group."
        
        radioItems={radioItems}
        onSelect={onSelectRadioItem}
        // disableHookForms
        
        error={error}
        disabled={disabled}
        required
      />
    </div>
  );
}

export const Example_ListRadioGroup = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}.`,
    };
  }));
  
  const onSelectRadioItem = (event: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`radioGroupFormName-list`];
    
    // Capturing state manually
    console.log('selected value: ', selected, `\n all values: `, radioItems);
    setRadioItems(prev => prev.map(item => item.value == selected.value ? selected : item));
  }
  
  
  return (
    <div>
      <RadioGroup
        variant="list"
        name={`radioGroupFormName-list`}
        label="List Style"
        description="The description of the radio group."
        
        radioItems={radioItems}
        onSelect={onSelectRadioItem}
        // disableHookForms
        
        error={error}
        disabled={disabled}
        required
      />
    </div>
  );
}
