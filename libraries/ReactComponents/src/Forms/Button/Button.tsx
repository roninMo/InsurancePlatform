import { HTMLAttributes, MouseEvent } from 'react';
import { Icon, IconTypes } from '../../Common/Icons/Icon';

import styles from './Button.module.scss';


export type ButtonSizes = 'default' | 'md' | 'lg' | 'xl' | 'none';
export type ButtonColors = 'primary' | 'gray' | 'gray-focus' | 'none';
export interface ButtonProps {
	/** The button's display text */
  displayText?: string;
	
	/** The button's event function. */
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
	
	/** Whether the button is disabled. */
  disabled?: boolean;
	
	/** The button's type. */
  type?: "submit" | "reset" | "button" | undefined;

	/** The different sizes of each button. Adjusts the padding and text size. */
  size?: ButtonSizes;
	
	/** The button's color themes. there's primary, gray, gray-focus, or none for custom colors. */
  color?: ButtonColors;
	
	/** Additional styles added to the button component.  */
  additionalStyles?: string | undefined;

	/** An optional Icon added alongside the displayText. */
  icon?: IconTypes;
	
	/** Styles for the icon. */
  iconStyles?: string;
}

export const Button = ({ 
  displayText,  onClick,  disabled, type = 'button',
  size = 'default', color = 'primary', 
  additionalStyles, icon, iconStyles, 
}: ButtonProps) => {

  return (
    <button 
      type={type} 
      onClick={(e) => onClick ? onClick(e) : null}
      disabled={disabled}
      className={`button-base 
        ${  size == 'default' ? 'btn-al-d' 
          : size == 'md'      ? 'btn-al-md' 
          : size == 'lg'      ? 'btn-al-lg'
          : size == 'xl'      ? 'btn-al-xl'
          : ''
        } 

        ${  color == 'primary'    ? 'btn-el-primary' 
          : color == 'gray'       ? 'btn-el-gray' 
          : color == 'gray-focus' ? 'btn-el-gray-focus' 
          : '' 
        }

        ${additionalStyles}
      `}
    >
      
      {icon && <Icon variant={icon} styles={iconStyles ? iconStyles : undefined} />}
      {displayText && displayText}
    </button>
  );
}
