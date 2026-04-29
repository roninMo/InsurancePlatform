import { ReactNode, MouseEvent } from 'react';
import { Button, ButtonProps } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './Card.module.scss';


export type CardType = 
  | 'default'     // standard container
  | 'card'        // card layout with description, title, and custom content
  | 'card-button' // card with a title, description, and a button event
  | 'card-link'   // card with a title, description, and a hashLink
;

export interface OldCardProps {
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

// Card styles
type ContainerStyles = 
  | { styles?: string; additStyles?: never } 
  | { additStyles?: string; styles?: never };
type HeaderStyles = 
  | { title: string; headerStyles?: string; additHeaderStyles?: never } 
  | { title: string; additHeaderStyles?: string; headerStyles?: never }; 
type DescriptionStyles = 
  | { description: string; descStyles?: string; additDescStyles?: never } 
  | { description: string; additDescStyles?: string; descStyles?: never } 
  | { description?: never; additDescStyles?: never; descStyles?: never }; 
type ContentStyles = // children is a reactNode, will this show up in intellisense whenever it's defined, no matter "what" it is?
  | { children: ReactNode; contentStyles?: string; additContentStyles?: never } 
  | { children: ReactNode; additContentStyles?: string; contentStyles?: never }
  | { children?: never; additContentStyles?: never; contentStyles?: never };


// Card Props
export type CardPropsBase = ContainerStyles & ContentStyles & {
  type?: CardType;
  noBackground?: boolean; // Removed styling from the base styles

	
  noBorder?: boolean;
  interactive?: boolean; // makes the border and divider have focused styles

  // // Container styles
  // (styles || additStyles)?: string;
}


type CardContentProps = CardPropsBase 
  & HeaderStyles 
  & DescriptionStyles 
& {
  type: 'card' | 'card-button' | 'card-link';
  noDivider?: boolean;
  // title?: string;
  // description?: string;

  // // Container styles
  // (styles || additStyles)?: string;
  // // Header styles
  // (headerStyles || additHeaderStyles)?: string;
  // // Description styles
  // (descStyles || additDescStyles)?: string;
  // // Content styles
  // (contentStyles || additContentStyles)?: string;
};

export type CardButtonProps = CardContentProps & {
  type: 'card-button';
  buttonProps: ButtonProps;
}

export type CardLinkProps = CardContentProps & {
  type: 'card-link';
  linkText: string;
  onClickLink: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
}

export type CardProps = 
  | CardButtonProps 
  | CardLinkProps  
  | CardPropsBase 
;


export const Card = (props: CardProps) => {
  const { 
    type, styles, additStyles, 
    noBackground, noBorder, interactive,
    children, contentStyles, additContentStyles 
  } = props as CardPropsBase;

  const titleStyles = `text-base`;
  const dividerStyles = `mb-2 border-b border-styles`;

  const getContainerStyles = (): string => {
    let classes = styles ? styles : `card-container ${additStyles}`;
    if (!noBackground) classes += ` card-bg`;
    if (!noBorder) classes += ` card-border`;
    if (interactive) classes += ' card-interactive';
    return classes;
  }




  //--------------------------------//
  // Default (Container)            //
  //--------------------------------//
  if (type == 'default') return (
    <Container className={getContainerStyles()}>
      { children }
    </Container>
  );


  //--------------------------------//
  // Card                           //
  //--------------------------------//
  else {
    const { 
      title, description, noDivider, 
      headerStyles, additHeaderStyles,
      contentStyles, additContentStyles
    } = props as ContentCardProps;
		const { buttonProps } = props as CardButtonProps;
		const { linkText, onClickLink } = props as CardLinkProps;
    
    
    return (
      <Container className={getContainerStyles()}>
        <label className="card-header">
          { title }
        </label>
        <p className="card-description">
          { description }
        </p>
        
        {/* Divider and Content */}
        { !noDivider && <div className="card-divider" />}
        { children }
      </Container>
    );
  }


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
}


const Container = styled.div``;