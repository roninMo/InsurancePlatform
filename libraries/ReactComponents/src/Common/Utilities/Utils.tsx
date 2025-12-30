import { ChangeEvent, Dispatch, FocusEvent, MouseEvent, SetStateAction } from "react";


export interface EventHandlers {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onClick?: (e: MouseEvent<HTMLInputElement, Element>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => void;
  adjustValue?: (setState: Dispatch<SetStateAction<any>>) => void;
}
