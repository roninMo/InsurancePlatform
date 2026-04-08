import { ChangeEvent, Dispatch, FocusEvent, MouseEvent, SetStateAction } from "react";


export interface UniversalEventHandlers<T extends HTMLElement = HTMLElement> {
  // ChangeEvent usually specifically needs to know about value/checked
  onChange?: (e: ChangeEvent<any>) => void; 
  onFocus?: (e: FocusEvent<T>) => void;
  onClick?: (e: MouseEvent<T>) => void;
  onBlur?: (e: FocusEvent<T>) => void;
  onMouseEnter?: (e: MouseEvent<T>) => void;
  onMouseLeave?: (e: MouseEvent<T>) => void;
}
