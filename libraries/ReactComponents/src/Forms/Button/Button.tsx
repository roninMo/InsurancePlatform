import { HTMLAttributes, MouseEvent } from 'react';
import { Icon, IconTypes } from '../../Common/Icons/Icon';

import styles from './Button.module.scss';


export type ButtonSizes = 'default' | 'md' | 'lg' | 'xl' | 'none';
export type ButtonColors = 'primary' | 'gray' | 'gray-focus' | 'none';
export interface ButtonProps {
  displayText?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button" | undefined;

  size?: ButtonSizes;
  color?: ButtonColors;
  additionalStyles?: string | undefined;

  icon?: IconTypes;
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
