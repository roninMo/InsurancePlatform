import { ChangeEvent, RefObject } from "react";


export type InputMaskProps = 
| { 
    /** An input mask that uses underscores to represent wildcard characters that are filled from the user's input. */
    mask?: string; 
    /** A regex pattern for the acceptable strings from the user's keyed characters.  */
    acceptableChars?: RegExp;
    /** The input's event that we're using the mask on. */
    event?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>; 
  } 
| { 
    mask?: never; 
    /** @deprecated CANNOT use 'event' without the defined input mask. */
    event?: never; 
    /** @deprecated CANNOT use 'acceptableChars' without the defined input mask. */
    acceptableChars?: never; 
  };


const inputMask = ({ mask, acceptableChars, event }: InputMaskProps): string => {
  const oldValue = event?.target?.value;
  if (!event) return '';
  
  const input = event.target as HTMLTextAreaElement | HTMLInputElement;;
  const inputName = input.name;
  
  const nativeEvent = event.nativeEvent as InputEvent;
  const inputType = nativeEvent.inputType;
  const newlyAddedChars = nativeEvent.data; // null/empty during deletions
  
  // Retrieve the changed input value from the native event
  // ? added character(s)
  // ? # of removed characters
  // ? the pasted characters
  // ? the highlighted scenarios? (reevaluate mask?)
  
  
  console.log(`${inputName} InputMask config`, { mask, acceptableChars, event },
    `\n native event data: `, { inputType, newlyAddedChars },
    `\n input target: `, { inputName, input }
  );
  
  return '';
}


/** Safely restore cursor position in a macro-task */
const restoreCursorPosition = (inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>) => {
  
  // Otherwise, typing in the middle of the mask will throw the cursor to the end.
  setTimeout(() => {
    if (inputRef.current) {
      const computedTargetCursor = calculateNewCursorPos("selectionStart", "actionType");
      inputRef.current.setSelectionRange(computedTargetCursor, computedTargetCursor);
    }
  }, 0);
}

const calculateNewCursorPos = (selectionStart: any, actionType: any): number | null => {
  return null;
}