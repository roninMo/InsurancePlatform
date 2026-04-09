import { useState } from "react";
import { Slider } from "../../../../../Components/Forms/Slider/Slider";


export const Example_DefaultSlider = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const [sliderValue, setSliderValue] = useState<boolean>(false);
  
  const onChangeSlider = () => {
    setSliderValue((prevState: boolean) => !prevState);
  }

  return (
    <div>
      <Slider 
        variant="default"
        type="button"
        
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
