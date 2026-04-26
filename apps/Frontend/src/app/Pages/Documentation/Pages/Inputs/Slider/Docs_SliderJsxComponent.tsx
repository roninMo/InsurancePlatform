import { useState } from "react";
import { Slider } from "@Project/ReactComponents";


export const Example_DefaultSlider = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const [sliderValue, setSliderValue] = useState<boolean>(false);
  
  const onChangeSlider = () => {
    setSliderValue((prevState: boolean) => {
      const newState = !prevState;
      console.log('slider value: ', newState);
      return newState;
    });
  }

  return (
    <div>
      <Slider 
        variant="default"
        name={`slider-form-name`}
        label="Slider Component"
        description="The description of the slider."
        
        value={sliderValue}
        onChange={() => onChangeSlider()}

        error={!!error}
        errorMessage={error}
        disabled={disabled}
        required
      />
    </div>
  );
}
