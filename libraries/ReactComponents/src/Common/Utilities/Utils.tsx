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

export const interpFloat = (current: number, target: number, factor: number): number => {
  return current += (target - current) * factor;
}

interface Vector2D {
  x: number;
  y: number;
}
export const interpV2 = (current: Vector2D, target: Vector2D, factor: number): Vector2D & any => {
  let lerp = current;
  lerp.x += (target.x - current.x) * factor;
  lerp.y += (target.y - current.y) * factor;
  return lerp;
}
