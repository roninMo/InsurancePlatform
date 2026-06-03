import { ChangeEvent, useState } from "react";
import { Slider } from "@Project/ReactComponents";
import { useFormContext } from "react-hook-form";


export const Example_DefaultSlider = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const { getValues } = useFormContext() || {};
  const [sliderValue, setSliderValue] = useState<boolean>(false);
  
  const onChangeSlider = (e: ChangeEvent<HTMLInputElement>) => {
    // React hook forms
    console.log('getValues: ', getValues('sliderFormName'));
    const formValue = getValues('sliderFormName');
    
    // Capturing state manually
    const newValue: boolean = e?.target?.checked;
    console.log('selected value: ', newValue);
    setSliderValue(newValue);
  }
  
  
  return (
    <div>
      <Slider 
        variant="default"
        name={`sliderFormName`}
        label="Slider Component"
        description="The description of the slider."
        
        onChange={(e) => onChangeSlider(e)} // An optional custom event to run alongside Rhf's change event
        // disableHookForms
        
        error={error}
        disabled={disabled}
        required
      />
    </div>
  );
}
