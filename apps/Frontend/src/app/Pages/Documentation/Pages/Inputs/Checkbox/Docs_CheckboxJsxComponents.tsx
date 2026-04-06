import { MouseEvent, useId, useState } from "react";
import { Checkbox, CheckboxItem } from "../../../../../Components/Forms/Checkbox/Checkbox";


export const Example_DefaultCheckbox = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const checkboxId = useId();
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

  const onCheckedItem = (item: CheckboxItem, event: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    // Record mapping using the internal value as a key
    setCheckboxItems(prevValue => ({ 
      ...prevValue, [item.value]: {...item, checked: !item.checked} 
    }));
  }

  return (
    <div>
      <Checkbox 
        name={`CheckboxComponent-${checkboxId}`}
        variant="default"
        label="Default Checkbox"
        description="The checkbox component's description."

        items={checkboxItems}
        onSelect={onCheckedItem}
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

export const Example_ListCheckbox = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const checkboxId = useId();
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

  const onCheckedItem = (item: CheckboxItem, event: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    // Record mapping using the internal value as a key
    setCheckboxItems(prevValue => ({ 
      ...prevValue, [item.value]: {...item, checked: !item.checked} 
    }));
  }

  return (
    <div>
      <Checkbox 
        name={`CheckboxComponent-${checkboxId}`}
        variant="list"
        label="List Checkbox"
        description="The checkbox component's description."

        items={checkboxItems}
        onSelect={onCheckedItem}
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

export const Example_InlineCheckbox = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const checkboxId = useId();
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

  const onCheckedItem = (item: CheckboxItem, event: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    // Record mapping using the internal value as a key
    setCheckboxItems(prevValue => ({ 
      ...prevValue, [item.value]: {...item, checked: !item.checked} 
    }));
  }

  return (
    <div>
      <Checkbox 
        name={`CheckboxComponent-${checkboxId}`}
        variant="inline"
        label="Inline Checkbox"
        description="The checkbox component's description."

        items={checkboxItems}
        onSelect={onCheckedItem}
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
