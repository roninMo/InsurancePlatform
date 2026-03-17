import { ReactNode, MouseEvent } from 'react';
import styled from '@emotion/styled';

import styles from './Card.module.scss';
import { Button, ButtonProps } from '@Project/ReactComponents';


export type CardType = 
    'default'     // standard container
  | 'card'        // card layout with description, title, and custom content
  | 'card-button' // card with a title, description, and a button event
  | 'card-link'   // card with a title, description, and a button event
;

export interface CardProps {
  type?: CardType;
  children?: ReactNode; // Make children optional

  // styles 
  outline?: 'default' | 'none';
  background?: 'default' | 'none';
  divider?: boolean;
  additionalStyles?: string;

  title?: string;
  description?: string;
  buttonProps?: ButtonProps;

  linkText?: string;
  onClickLink?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
}


export const Card = ({ 
  type = 'default', children, 
  outline = 'none', background = 'default', divider = true, additionalStyles, 
  title, description, buttonProps, linkText, onClickLink 
}: CardProps) => {
  const titleStyles = `text-base`;
  const dividerStyles = `mb-2 border-b border-styles`;

  const getContainerStyles = (): string => {
    let classes = `rounded-md transition p-2 `;
    classes += outline    == 'default' ? ' outline-css outline-styles ' : '';
    classes += background == 'default' ? ' bg-default ' : '';
    return classes + ` ${additionalStyles}`;
  }

  //--------------------------------//
  // Card                           //
  //--------------------------------//
  if (type == 'card') return (
    <Container className={ getContainerStyles() + ' col gap-2' }>
      <label className={titleStyles}>{ title }</label>
      <p className='pb-1'>{ description }</p>
      { divider && <div className={dividerStyles} />}
      
      { children }
    </Container>
  );

  //--------------------------------//
  // Card-Button                    //
  //--------------------------------//
  if (type == 'card-button') return (
    <Container className={ getContainerStyles()}>
      <div className='row justify-between items-start'>
        <div className='col pb-4 gap-2'>
          <label className={titleStyles}>{ title }</label>
          <p>{ description }</p>
        </div>

        {(buttonProps?.displayText && buttonProps.onClick) && 
          <Button 
          displayText={buttonProps.displayText}
          onClick={buttonProps.onClick}
          disabled={buttonProps.disabled}
          
          icon={buttonProps.icon}
          iconStyles={buttonProps.iconStyles}
          size={buttonProps?.size || 'md'}
          color={buttonProps.color}
          additionalStyles={buttonProps.additionalStyles}
          />
        }
      </div>

      { divider && <div className={dividerStyles} />}
      { children }
    </Container>
  );


  //--------------------------------//
  // Card-Link                      //
  //--------------------------------//
  if (type == 'card-link') return (
    <Container className={ getContainerStyles() + ' col gap-2'}>
      <label className={titleStyles}>{ title }</label>
      <p className='pb-1'>{ description }</p>
      { divider && <div className={dividerStyles} />}
      
      { children }

      { (linkText && onClickLink) &&
        <p onClick={(e) => onClickLink(e)} className='pt-2 font-semibold link-text' >
          { linkText }
        </p>
      }
    </Container>
  );


  //--------------------------------//
  // Default                        //
  //--------------------------------//
  return (
    <Container className={ getContainerStyles() }>
      { children }
    </Container>
  );
}


const Container = styled.div``;