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
  cardStyles?: string;

  title?: string;
  description?: string;
  buttonProps?: ButtonProps;

  linkText?: string;
  onClickLink?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
}


export const Card = ({ 
  type = 'default', children, 
  outline = 'none', background = 'default', cardStyles, 
  title, description, buttonProps, linkText, onClickLink 
}: CardProps) => {
  const getContainerStyles = (): string => {
    let classes = `${cardStyles} rounded-md transition p-2 `;
    classes += outline    == 'default' ? ' outline-css outline-styles ' : '';
    classes += background == 'default' ? ' bg-default ' : '';
    return classes;
  }

  //--------------------------------//
  // Card                           //
  //--------------------------------//
  if (type == 'card') return (
    <Container className={ getContainerStyles() + ' col gap-2' }>
      <label>{ title }</label>
      <p className='pb-4'>{ description }</p>
      { children }
    </Container>
  );

  //--------------------------------//
  // Card-Button                    //
  //--------------------------------//
  if (type == 'card-button') return (
    <Container className={ getContainerStyles()}>
      <div className='row justify-between items-start'>
        <div className='col pb-4'>
          <label>{ title }</label>
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
      { children }
    </Container>
  );


  //--------------------------------//
  // Card-Link                      //
  //--------------------------------//
  if (type == 'card-link') return (
    <Container className={ getContainerStyles() + ' col gap-2'}>
      <label>{ title }</label>
      <p>{ description }</p>
      
      { (linkText && onClickLink) &&
        <p className='pb-2 font-semibold text-blue-500 dark:text-indigo-500' onClick={(e) => onClickLink(e)}>
          { linkText }
        </p>
      }

      { children }
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