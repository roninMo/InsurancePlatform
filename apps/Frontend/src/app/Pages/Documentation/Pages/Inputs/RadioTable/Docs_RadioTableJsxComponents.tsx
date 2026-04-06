import { RadioItem } from "@Project/ReactComponents";
import { useId, useState } from "react";
import { RadioTable } from "../../../../../Components/Forms/RadioTable/RadioTable";




export const Example_InlineRadioTable = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const radioTableId = useId();
  const [selectedItem, setSelectedItem] = useState<RadioItem>({ value: '', label: ''});
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (selected: RadioItem, index: number, currentValue: RadioItem) => {
    setSelectedItem(selected);
    console.log(`user selected: `, {selected, index, currentValue});
  }

  return (
    <div>
      <RadioTable
        variant="inline"
        name={`radioTable-${radioTableId}`}
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
  const radioTableId = useId();
  const [selectedItem, setSelectedItem] = useState<RadioItem>({ value: '', label: ''});
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (selected: RadioItem, index: number, currentValue: RadioItem) => {
    setSelectedItem(selected);
    console.log(`user selected: `, {selected, index, currentValue});
  }

  return (
    <div>
      <RadioTable
        variant="block"
        name={`radioTable-${radioTableId}`}
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
