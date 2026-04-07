import { MouseEvent } from "react";
import { Button } from "@Project/ReactComponents";


export const Example_Button = ({ error, disabled }: {
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
