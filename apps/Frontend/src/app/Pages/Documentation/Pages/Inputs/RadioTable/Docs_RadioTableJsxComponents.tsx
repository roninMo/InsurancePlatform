import { useState } from "react";
import { RadioItem, RadioTable } from "@Project/ReactComponents";


export const Example_InlineRadioTable = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const [selectedItem, setSelectedItem] = useState<RadioItem>({ value: '', label: ''});
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (selected: RadioItem, currentValue: RadioItem) => {
    setSelectedItem(selected);
    console.log(`user selected: `, {selected, currentValue});
  }

  return (
    <div>
      <RadioTable
        variant="inline"
        name={`radioTable-form-name`}
        label="Inline Style"
        description="The description of the radio table."

        radioItems={radioItems}
        currentValue={selectedItem}
        onSelect={onSelectRadioItem}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}

        error={!!error}
        errorMessage={error}
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
  const [selectedItem, setSelectedItem] = useState<RadioItem>({ value: '', label: ''});
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (selected: RadioItem, currentValue: RadioItem) => {
    setSelectedItem(selected);
    console.log(`user selected: `, {selected, currentValue});
  }

  return (
    <div>
      <RadioTable
        variant="block"
        name={`radioTable-form-name`}
        label="Block Style"
        description="The description of the radio table."

        radioItems={radioItems}
        currentValue={selectedItem}
        onSelect={onSelectRadioItem}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}

        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required
      />
    </div>
  );
}
