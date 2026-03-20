import { HTMLAttributes, MouseEvent } from 'react';
import { Icon, IconTypes } from '../../Common/Icons/Icon';

import styles from './Button.module.scss';


export interface ButtonProps {
  displayText: string;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  disabled?: boolean;

  icon?: IconTypes;
  iconStyles?: string;
  size?: 'default' | 'md' | 'lg' | 'xl' | 'none';
  color?: 'primary' | 'gray' | 'gray-focus' | 'none';
  additionalStyles?: string | undefined;
}

export function Button({ 
  displayText,  onClick,  disabled,  
  icon, iconStyles, 
  size = 'default', color = 'primary', additionalStyles 
}: ButtonProps) {

  return (
    <button 
      type="button" 
      onClick={(e) => onClick ? onClick(e) : null}
      disabled={disabled}
      className={` 
        inline-flex items-center 
        shadow-md dark:shadow-none transition 
        outline-css font-semibold text-nowrap m-auto
        
        ${  size == 'default' ? 'px-2.5  py-1.5' 
          : size == 'md'      ? 'px-3    py-2 ' 
          : size == 'lg'      ? 'px-3.5  py-2.5'
          : size == 'xl'      ? 'px-5    py-3'
          : ''
        } 

        ${  color == 'primary'    ? 'btn-primary text-white'
          : color == 'gray'       ? 'btn-gray text-black dark:text-white' 
          : color == 'gray-focus' ? 'btn-gray-focus text-black dark:text-white' 
          : '' 
        } 

        ${additionalStyles}
      `}
    >
      
      {icon && <Icon variant={icon} styles={iconStyles ? iconStyles : undefined}></Icon>}
      {displayText}
    </button>
  );
}

export default Button;
