import { ReactNode, FocusEvent, MouseEvent } from 'react';

import styles from './Tooltip.module.scss';
import styled from '@emotion/styled';

export class TooltipEvents {
  // protected open: (e: FocusEvent<HTMLInputElement, Element> | MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => void;
  // protected close: (e: FocusEvent<HTMLInputElement, Element> | MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => void;

  // transitionDuration: number;

  constructor() {
    // this.open = () => {};
    // this.close = () => {};
  }
  
  /**
   * Html event function used to open the modal. Use it on an element to open the modal
   * 
   * @returns The distance from the origin as a positive number.
   */
  public open(e: FocusEvent<HTMLInputElement, Element> | 
    MouseEvent<HTMLInputElement, globalThis.MouseEvent>
  ): void {

  }

  public close(e: FocusEvent<HTMLInputElement, Element> | 
    MouseEvent<HTMLInputElement, globalThis.MouseEvent>
  ): void {

  }
}

export const TooltipService = () => {

}


interface TooltipProps {
  type?: 'focus' | 'element';
  service: TooltipEvents;
  tooltipElement: ReactNode
  children: ReactNode;
}

// Solely tailwind css dropdown using a container with relative positioning and a child element with absolute to create an easy tooltip
export const TooltipContainer = ({ 
  type = 'focus', 
  service: TooltipEvents, 
  tooltipElement, 
  children
}: TooltipProps) => {

  return (
    // to add styles to the tooltip classes outside of this component, use "[&_.tooltip]:opacity-100"
    <ContainerStyles className={`tooltipContainer ${containerStyles} ${transitionStyles}`}>
      { tooltipElement }

      <ToolTipStyles className={`tooltip ${tooltipStyles} ${tooltipThemeStyles} ${tooltipChildrenStyles}`}>
        { children }
      </ToolTipStyles>
    </ContainerStyles>
  );
}

const containerStyles = `
  relative group 
  overflow-hidden focus:overflow-visible 
  w-max h-max p-2 flex flex-row justify-start items-center gap-2 
`;

const transitionStyles = `
  transition:all ease-in duration-200  *:transition-all *:duration-200 *:ease-in 
  *:opacity-0 *:focus:opacity-100 
`;

const tooltipStyles = `
    absolute left-0 -bottom-40 
    w-full h-max p-2
    flex flex-col gap-2
    shadow-lg 
`;

const tooltipThemeStyles = `
  bg-white dark:bg-slate-800 
  border rounded-md 
  border-gray-300 dark:border-white/10 
  focus:border-indigo-600 dark:focus:border-indigo-500 
`;

const tooltipChildrenStyles = `
  *:flex *:flex-row *:gap-2 *:justify-start *:items-center
`;

const ContainerStyles = styled.div``;
const ToolTipStyles = styled.div``;
