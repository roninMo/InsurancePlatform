import { ReactNode, FocusEvent, MouseEvent, useState, Dispatch, SetStateAction, useEffect } from 'react';

import styles from './Tooltip.module.scss';
import styled from '@emotion/styled';


  /**
   * A quick and dirty way to handle disjointed components to create a tooltip while still allowing the end user to create a tooltip with their own customization.
   */
  export class TooltipService {
  protected setShowTooltip: Dispatch<SetStateAction<boolean>>;

  constructor(setShowToolTip: Dispatch<SetStateAction<boolean>>) {
    this.setShowTooltip = setShowToolTip;
  }
  
  /**
   * Html event function used to open the tooltip. Use it on an element to open the modal
   * 
   * @param Event   The event used to activate the modal. Should be either a focus event, the MouseEnter, or MouseLeave event on a specific element
   */
  public open(Event: FocusEvent<HTMLInputElement, Element> | 
    MouseEvent<HTMLInputElement, globalThis.MouseEvent>
  ): void {
    console.info(`TooltipEvents::open() - opening the modal`, {Event});
    this.setShowTooltip(true);
  }

  /**
   * Html event function used to close the tooltip. Use it on an element to close the modal
   * 
   * @param Event   The event used to activate the modal. Should be either a focus event, the MouseEnter, or MouseLeave event on a specific element
   */
  public close(e: FocusEvent<HTMLInputElement, Element> | 
    MouseEvent<HTMLInputElement, globalThis.MouseEvent>
  ): void {
    console.info(`TooltipEvents::open() - opening the modal`, {Event});
    this.setShowTooltip(true);
  }
}


interface TooltipProps {
  /* use @TooltipEvents to bridge the tooltip to the element that renders it */
  renderTooltip: boolean;

  /* The element that the user interacts with to display the tooltip, usually an icon  */
  tooltipRenderer: ReactNode;

  /* The contents of the tooltip */
  children: ReactNode;
}


// Use the service functions to interact with both this container, and the other element used to display the tooltip
export const TooltipContainer = ({
  renderTooltip, 
  tooltipRenderer, 
  children
}: TooltipProps) => {
  const renderTooltipStyles = `*:opacity-100`;
  const hideTooltipStyles = `*:opacity-0`;
  let toolTipVisibility = ``;

  // TODO: use class to adjust styles and transitions

  useEffect(() => {
    if (renderTooltip) toolTipVisibility = renderTooltipStyles;
    else toolTipVisibility = hideTooltipStyles;

  }, [renderTooltip]);

  return (
    // to add styles to the tooltip classes outside of this component, use "[&_.tooltip]:opacity-100"
    <ContainerStyles className={`tooltipContainer ${containerStyles} justify-self-stretch`}>
      { tooltipRenderer }

      {/* <ToolTipStyles className={`tooltip ${tooltipStyles} ${tooltipThemeStyles} ${transitionStyles} ${tooltipChildrenStyles} ${toolTipVisibility}`}>
        { children }
      </ToolTipStyles> */}
    </ContainerStyles>
  );
}

const containerStyles = `
  relative group 
  overflow-hidden focus:overflow-visible 
  w-max h-max p-2 flex flex-grow justify-start gap-2 
`;

// If you're building it traditionally, only this is necessary
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
