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


/**
 * Interpolates between two floats smoothly. The higher the factor, the faster the interp.
 *
 * @param current - the current value
 * @param target - the desired value you want to interpolate to
 * @param factor - the speed at which it interpolates. Must be between 0-1
 * @returns The interpolated step towards the target.
 * 
 * @example
 * ```typescript
 * const loadingProgress = interpFloat(displayedPercentage, percentage, 0.2);
 * ```
 * 
 * Useful for smoothly transitioning with styles.
 */
export const interpFloat = (current: number, target: number, factor: number = 0.2): number => {
  if (Math.abs(target - current) < 0.01) return current;
  return current += (target - current) * Math.min(Math.max(factor, 0.001), .99);
}

interface Vector2D {
  x: number;
  y: number;
}

/**
 * Interpolates a 2D Vector smoothly. The higher the factor, the faster the interp.
 * 
 * Uses the current and target locations in vector space with a factor 
 * for how quickly it interpolates between two points. Safe to use 
 * with identical numbers, there's already checks to prevent interp errors.
 *
 * @param current - the current vector location
 * @param target - the desired location you want to interpolate to
 * @param factor - the speed at which it interpolates. Must be between 0-1
 * @returns The interpolated step towards the target.
 * 
 * @example
 * ```typescript
 * const location = interpV2(currentLocation, { 
 *   x: targetLocation.x, 
 *   y: targetLocation.y 
 * }, interpSpeed);
 * ```
 * Useful for transition logic for elements on the webpage.
 * 
 */
export const interpV2 = (current: Vector2D, target: Vector2D, factor: number = 0.1): Vector2D & any => {
  let lerp = { ...current };
  
  lerp.x = interpFloat(current.x, target.x, factor);
  lerp.y = interpFloat(current.y, target.y, factor);
  return lerp;
}
