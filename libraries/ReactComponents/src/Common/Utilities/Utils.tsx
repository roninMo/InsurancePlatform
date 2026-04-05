import { ChangeEvent, Dispatch, FocusEvent, MouseEvent, SetStateAction } from "react";


export interface InputEventHandlers {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onClick?: (e: MouseEvent<HTMLInputElement, Element>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => void;
  // adjustValue?: (setState: Dispatch<SetStateAction<any>>) => void;
}

export interface TextareaEventHandlers {
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement, Element>) => void;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement, Element>) => void;
  onClick?: (e: MouseEvent<HTMLTextAreaElement, globalThis.MouseEvent>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLTextAreaElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLTextAreaElement, globalThis.MouseEvent>) => void;
  // adjustValue?: (setState: Dispatch<SetStateAction<any>>) => void;
}
