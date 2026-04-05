import { ReactNode } from 'react';
import styles from './Tooltip.module.scss';


export interface TooltipProps {
  children: ReactNode;
  alignment?: string;
  additionalStyles?: string;
}
export const Tooltip = ({ children, alignment = 'inset-0', additionalStyles }: TooltipProps) => {
  return (
    <div className="relative inline">
      <div className={`absolute ${alignment} col gap-2 ${additionalStyles}`}>
        { children }
      </div>
    </div>
  );
}
