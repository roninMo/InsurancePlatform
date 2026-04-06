import { useId, useState } from "react";
import { RadioGroup, RadioItem } from "@Project/ReactComponents";


export const Example_DefaultRadioGroup = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const radioGroupId = useId();
  const [selectedItem, setSelectedItem] = useState<RadioItem>({ value: '', label: ''});
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (selected: RadioItem, index: number, currentValue: RadioItem) => {
    setSelectedItem(selected);
    console.log(`user selected: `, {selected, index, currentValue});
  }

  return (
    <div>
      <RadioGroup
        variant="default"
        name={`radioGroup-${radioGroupId}`}
        label="Default Style"
        description="The description of the radio group."

        radioItems={radioItems}
        currentValue={selectedItem}
        onSelect={onSelectRadioItem}

        error={!!error}
        errorMessage={error}
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
  const radioGroupId = useId();
  const [selectedItem, setSelectedItem] = useState<RadioItem>({ value: '', label: ''});
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}.`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (selected: RadioItem, index: number, currentValue: RadioItem) => {
    setSelectedItem(selected);
    console.log(`user selected: `, {selected, index, currentValue});
  }

  return (
    <div>
      <RadioGroup
        variant="column"
        name={`radioGroup-${radioGroupId}`}
        label="Column Style"
        description="The description of the radio group."

        radioItems={radioItems}
        currentValue={selectedItem}
        onSelect={onSelectRadioItem}

        error={!!error}
        errorMessage={error}
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
  const radioGroupId = useId();
  const [selectedItem, setSelectedItem] = useState<RadioItem>({ value: '', label: ''});
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}.`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (selected: RadioItem, index: number, currentValue: RadioItem) => {
    setSelectedItem(selected);
    console.log(`user selected: `, {selected, index, currentValue});
  }

  return (
    <div>
      <RadioGroup
        variant="columnInline"
        name={`radioGroup-${radioGroupId}`}
        label="ColumnInline Style"
        description="The description of the radio group."

        radioItems={radioItems}
        currentValue={selectedItem}
        onSelect={onSelectRadioItem}

        error={!!error}
        errorMessage={error}
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
  const radioGroupId = useId();
  const [selectedItem, setSelectedItem] = useState<RadioItem>({ value: '', label: ''});
  const [radioItems, setRadioItems] = useState<RadioItem[]>(["A", "B", "C", "D"].map((val, index) => {
    return {
      value: `value${val}`,
      label: `Option ${val}`,
      description: `The description of option ${val}.`,
      disabled: false
    };
  }));

  const onSelectRadioItem = (selected: RadioItem, index: number, currentValue: RadioItem) => {
    setSelectedItem(selected);
    console.log(`user selected: `, {selected, index, currentValue});
  }

  return (
    <div>
      <RadioGroup
        variant="list"
        name={`radioGroup-${radioGroupId}`}
        label="List Style"
        description="The description of the radio group."

        radioItems={radioItems}
        currentValue={selectedItem}
        onSelect={onSelectRadioItem}

        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required
      />
    </div>
  );
}
