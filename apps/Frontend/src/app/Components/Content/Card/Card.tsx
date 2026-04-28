import { ReactNode, MouseEvent } from 'react';
import styled from '@emotion/styled';

import styles from './Card.module.scss';
import { Button, ButtonProps } from '@Project/ReactComponents';


export type CardType = 
    'default'     // standard container
  | 'card'        // card layout with description, title, and custom content
  | 'card-button' // card with a title, description, and a button event
  | 'card-link'   // card with a title, description, and a hashLink
;

export interface CardProps {
  type?: CardType;
  children?: ReactNode;

  // universal styles
  border?: boolean | 'default' | 'interactive' | 'none';
  background?: boolean | 'default' | 'none';
  divider?: boolean;
  additionalStyles?: string;

  title?: string;
  description?: string;

  // This needs to be memoized to prevent unnecessary rerenders 
  buttonProps?: ButtonProps;

  // card-link props
  linkText?: string;
  onClickLink?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
}

type ContainerStyles = 
  | { styles?: string; additStyles?: never } 
  | { additStyles?: string; styles?: never };
type HeaderStyles = 
  | { headerStyles?: string; additHeaderStyles?: never } 
  | { additHeaderStyles?: string; headerStyles?: never }; 
type ContentStyles = 
  | { contentStyles?: string; additContentStyles?: never } 
  | { additContentStyles?: string; contentStyles?: never };

interface CardPropsBase {
  type?: CardType;
  children?: ReactNode;

  // Removed styling from the base styles
  noBackground?: boolean;

  // If either of these are interactive, both will use interactive styles (if enabled)
  noBorder?: boolean | 'interactive';
  noDivider?: boolean | 'interactive';

  // // Container styles
  // (styles || additStyles)?: string;
  // // Header styles
  // (headerStyles || additHeaderStyles)?: string;
  // // Content styles
  // (contentStyles || additContentStyles)?: string;
}

interface ContentCardProps extends CardPropsBase {
  type: 'card' | 'card-button' | 'card-link';
  title?: string;
  description?: string;
  
  // // Container styles
  // (styles || additStyles)?: string;
  // // Header styles
  // (headerStyles || additHeaderStyles)?: string;
  // // Content styles
  // (contentStyles || additContentStyles)?: string;
}

interface ButtonCardProps extends ContentCardProps {
  type: 'card-button';
  buttonProps?: ButtonProps;
}

interface LinkCardProps extends ContentCardProps {
  
}





interface AdditiveStyles { 

}

/* 

Styles
  - Container + (background, outline, styles)
  - Header 
  - Description
  - Content Container


Card props distribution 

  Universal
    - type
    - background, border, divider
    - children (content)

  default (Container)
    - title, description
    - additionalStyles


  card (title, desc, content)
    - title, description
    - additionalStyles

  card-button (title, desc, button event)
    - title, description
    - buttonProps, buttonLocation
    - additionalStyles

  card-link (title, desc, content, link)
    - title, description
    - linkText, linkStyles, onClickLink
    - additionalStyles

*/


export const Card = ({ 
  type = 'default', children, 
  border = 'none', background = 'default', divider = true, additionalStyles, 
  title, description, buttonProps, linkText, onClickLink 
}: CardProps) => {
  const titleStyles = `text-base`;
  const dividerStyles = `mb-2 border-b border-styles`;

	// TODO: The styles and themes need to be added globally and themed
  const getContainerStyles = (): string => {
    let classes = `rounded-md trans p-2 `;
    classes += border     == 'default' ? ' outline-css outline-styles ' : '';
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