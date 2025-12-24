import { MouseEvent, SVGProps } from 'react';
import styles from './Button.module.scss';


interface ButtonProps {
  displayText: string;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  disabled?: boolean;

  variant?: 'default' | 'md' | 'lg';
  icon?: SVGProps<SVGSVGElement> | TextIcons;
}

export function Button({ displayText,  onClick,  disabled,  variant, icon }: ButtonProps) {
  const variantStyles_default = ` gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 `;
  const variantStyles_md = ` gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 `;
  const variantStyles_lg = ` gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 `;

  return (
    // <div>
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
        
        {icon && icon == 'checkbox' ? Icon_Checkbox : icon == 'custom' && icon}
        {displayText}
      </button>
    // </div>
  );
}


export type TextIcons = 'checkbox' | 'etc' | 'custom';
const Icon_Checkbox = (
  <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="-ml-0.5 size-5">
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" fillRule="evenodd" />
  </svg>
);

export default Button;
