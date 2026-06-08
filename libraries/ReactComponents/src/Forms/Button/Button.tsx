import { HTMLAttributes, MouseEvent } from 'react';
import { UniversalEventHandlers } from '../../Common/Utilities/Utils';
import { getIconStyles, Icon, IconTypes } from '../../Common/Icons/Icon';
import { ContainerStyles, IconStyleProps } from '@Project/ReactComponents/Types';

import styles from './Button.module.scss';


export type ButtonSizes = 'default' | 'md' | 'lg' | 'xl' | 'none';
export type ButtonColors = 'primary' | 'gray' | 'gray-focus' | 'none';
export type ButtonProps = 
 & Omit<UniversalEventHandlers<HTMLButtonElement>, 'onChange' > 
 & ContainerStyles
 & IconStyleProps
 & {
	/** The button's display text */
  displayText?: string;
	
	/** Whether the button is disabled. */
  disabled?: boolean;
	
	/** The button's type. */
  type?: "submit" | "reset" | "button" | undefined;
  
	/** The different sizes of each button. Adjusts the padding and text size. */
  size?: ButtonSizes;
	
	/** The button's color themes. there's primary, gray, gray-focus, or none for custom colors. */
  color?: ButtonColors;
	
}

export const Button = ({ 
  displayText, type = 'button', disabled, 
  onClick, onMouseEnter, onMouseLeave, 
  onFocus, onBlur,  
  size = 'default', color = 'primary', 
  styles, additStyles, icon, iconStyles, additIconStyles 
}: ButtonProps) => {
  
  return (
    <div>
      <button 
        type={type} 
        onClick={onClick}
        onFocus={onFocus} onBlur={onBlur}
        onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
        disabled={disabled}
        className={styles ? styles : `button-base 
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
          
          ${additStyles}
        `}
      >
        
        {icon && <Icon variant={icon} styles={iconStyles ? iconStyles : `${getIconStyles(icon)} ${additIconStyles}`} />}
        {displayText && displayText}
      </button>
    </div>
  );
}
