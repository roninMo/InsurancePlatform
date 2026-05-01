import { MouseEvent } from "react";
import { Button } from "@Project/ReactComponents";


export const Example_PrimaryButton = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const onClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    console.log('button clicked!');
  }

  return (
    <div>
      <Button 
        displayText="Button Text..."
        onClick={(e) => onClick(e)}
        disabled={disabled}

        size="default"
        color="primary"

        icon="CodeBracket"
        iconStyles="cursor-pointer trans input-colors hover:text-blue-500"
      />
    </div>
  );
}


export const Example_GrayButton = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const onClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    console.log('button clicked!');
  }

  return (
    <div>
      <Button 
        displayText="Button Text..."
        onClick={(e) => onClick(e)}
        disabled={disabled}

        size="default"
        color="gray"

        icon="CodeBracket"
        iconStyles="cursor-pointer trans input-colors hover:text-blue-500"
      />
    </div>
  );
}


export const Example_GrayFocusButton = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const onClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    console.log('button clicked!');
  }

  return (
    <div>
      <Button 
        displayText="Button Text..."
        onClick={(e) => onClick(e)}
        disabled={disabled}

        size="default"
        color="gray-focus"

        icon="CodeBracket"
        iconStyles="cursor-pointer trans input-colors hover:text-blue-500"
      />
    </div>
  );
}


export const Example_CustomButton = ({ error, disabled }: {
  error: string;
  disabled: boolean;
}) => {
  const onClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    console.log('button clicked!');
  }

  return (
    <div>
      <Button 
        displayText="We'll add unit tests later..."
        onClick={(e) => onClick(e)}
        disabled={disabled}

        size="default"
        color="none"
        additionalStyles="btn-rainbow animate-rainbow text-slate-100 rounded-lg"

        icon="CodeBracket"
        iconStyles="cursor-pointer trans input-colors hover:text-blue-500"
      />
    </div>
  );
}