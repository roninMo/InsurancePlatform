import { MouseEvent, SVGProps } from 'react';
import { Icon, IconTypes } from '../../Common/Icons/Icon';

import styles from './Button.module.scss';


interface ButtonProps {
  displayText: string;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  disabled?: boolean;

  variant?: 'default' | 'md' | 'lg';
  icon?: IconTypes;
  iconStyles?: string;
}

export function Button({ displayText,  onClick,  disabled,  variant, icon, iconStyles }: ButtonProps) {
  const variantStyles_default = ` gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 `;
  const variantStyles_md = ` gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 `;
  const variantStyles_lg = ` gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 `;

  return (
    <button 
      type="button" 
      onClick={(e) => onClick ? onClick(e) : null}
      disabled={disabled}
      className={(variant == 'md' ? variantStyles_md : variant == 'lg' ? variantStyles_lg : variantStyles_default) + ` 
        inline-flex items-center gap-x-1.5 rounded-md text-sm font-semibold 
        focus-visible:outline-2 focus-visible:outline-offset-2 
        shadow-xs dark:shadow-none 
        
        text-white 
        bg-indigo-600 dark:bg-indigo-500 
        hover:bg-indigo-500 dark:hover:bg-indigo-400 
        focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500
      `}
    >
      
      {icon && <Icon variant={icon} styles={iconStyles ? iconStyles : undefined}></Icon>}
      {displayText}
    </button>
  );
}

export default Button;
