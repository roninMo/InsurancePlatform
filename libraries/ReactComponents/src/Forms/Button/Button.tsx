import { MouseEvent, SVGProps } from 'react';
import { Icon, IconTypes } from '../../Common/Icons/Icon';

import styles from './Button.module.scss';


export interface ButtonProps {
  displayText: string;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  disabled?: boolean;

  icon?: IconTypes;
  iconStyles?: string;
  size?: 'default' | 'md' | 'lg';
  color?: 'primary' | 'gray' | 'gray-focus' | 'none';
  additionalStyles?: string;
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
        shadow-xs dark:shadow-none transition rounded-md 
        outline-css text-white font-semibold 
        
        ${size == 'default' && 'px-2.5  py-1.5'} 
        ${size == 'md'      && 'px-3    py-2 '} 
        ${size == 'lg'      && 'px-3.5  py-2.5'} 

        ${color == 'primary'    && 'btn-primary'} 
        ${color == 'gray'       && 'btn-gray'} 
        ${color == 'gray-focus' && 'btn-gray-focus'} 
        
        ${additionalStyles} 
      `}
    >
      
      {icon && <Icon variant={icon} styles={iconStyles ? iconStyles : undefined}></Icon>}
      {displayText}
    </button>
  );
}

export default Button;
