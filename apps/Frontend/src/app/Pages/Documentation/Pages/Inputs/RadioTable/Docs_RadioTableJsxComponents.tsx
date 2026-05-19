import { ChangeEvent, useState } from "react";
import { RadioItem, RadioTable } from "@Project/ReactComponents";
import { useFormContext } from "react-hook-form";


export const Example_InlineRadioTable = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {}
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (e: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`radioTableFormName-i`];
    
    // Capturing state manually
    console.log('selected value: ', selected, `\n all values: `, radioItems);
  }

  return (
    <div>
      <RadioTable
        variant="inline"
        name={`radioTableFormName-i`}
        label="Inline Style"
        description="The description of the radio table."

        radioItems={radioItems}
        onSelect={onSelectRadioItem}
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

export const Example_BlockRadioTable = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (e: ChangeEvent<HTMLInputElement>, selected: RadioItem) => {
    // React hook forms
    console.log('getValues: ', getValues());
    const formValue = getValues()?.[`radioTableFormName-b`];
    
    // Capturing state manually
    console.log('selected value: ', selected, `\n all values: `, radioItems);
  }

  return (
    <div>
      <RadioTable
        variant="block"
        name={`radioTableFormName-b`}
        label="Block Style"
        description="The description of the radio table."

        radioItems={radioItems}
        onSelect={onSelectRadioItem}
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
