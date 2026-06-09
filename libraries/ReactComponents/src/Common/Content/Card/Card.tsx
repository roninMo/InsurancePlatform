import { ReactNode, MouseEvent, useMemo } from 'react';
import { Button, ButtonProps } from '../../../Forms/Button/Button';
import { ContainerStyles, ContentStyles, DescriptionStyles, TitleStyles } from '../../../Types/ConditionalProps';

import styled from '@emotion/styled';
import styles from './Card.module.scss';


// #region Props and Types
/** The {@link Card} variant we're using. */
export type CardType = 
  | 'default'     // standard container
  | 'card'        // card layout with description, title, and custom content
  | 'card-button' // card with a title, description, and a button event
  | 'card-link'   // card with a title, description, and a hashLink
;


/** The base peops for the {@link Card} component. */
export type CardPropsBase = ContainerStyles & {
	/** The variant of the {@link Card} component we're using. */
  type: CardType;
	
	/** Whether to remove the default background theme for the {@link Card} component. */
  noBackground?: boolean; 

	/** Whether to remove the default border theme for the {@link Card} component. */
  noBorder?: boolean;
	
	/** Add a highlight to the *background* and *text* during hover. */
  hoverTheme?: boolean;

  // // Container styles
  // (styles || additStyles)?: string;
}


/** The *default* {@link Card} variant's props. */
type DefaultCardProps = CardPropsBase & {
	/** The *default* card variant. Just a nested themed container for displaying content. */
  type: 'default';
	
	/** The content displayed in the {@link Card} component. */
  children: ReactNode; 
};


/** The *card*, *card-button*, and *card-link*'s variant props. */
type CardContentProps = CardPropsBase 
  & TitleStyles 
  & DescriptionStyles 
  & ContentStyles
& {
	/** Each of these variants have extra styling props for their content. */
  type: 'card' | 'card-button' | 'card-link';
	
	/** Whether to adda divider between the *title*, *description* and before the rendered *children*. */
  noDivider?: boolean;
  // title?: string;
  // description?: string;

  // // Container styles
  // (styles || additStyles)?: string;
  // // Header styles
  // (titleStyles || additTitleStyles)?: string;
  // // Description styles
  // (descStyles || additDescStyles)?: string;
  // // Content styles
  // (contentStyles || additContentStyles)?: string;
};


/** The *card-button's* location on the component. */
export type ButtonLocation = 'bottomLeft' | 'bottomRight' | 'top';

/** The *card-button's* props for the {@link Card} component. */
export type CardButtonProps = CardContentProps & {
	/** The *card-button* has styled props for it's content and button, as well as props for the {@link Button} component. */
  type: 'card-button';
	
	/** The props for creating a {@link Button} component. */
  buttonProps: ButtonProps;
	
	/** The location of the button on the {@link Card}. */
  buttonLocation: ButtonLocation;
	
	/** Whether to add a focus outline fo the {@link Card} component when the user *interacts* with it. */
  focusTheme?: boolean;
}


	/** The *card-link's* props for the {@link Card} component. */
export type CardLinkProps = CardContentProps & {
	/** The *card-link* has style props for it's content, and an onClick function for handling the logic for the *link*.  */
  type: 'card-link';
	
	/** The *link's* displayed text. */
  linkText: string;
	
	/** the `onClick` function for the *link*. */
  onClickLink: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
}


/** The {@link Card} component's props for each of it's *variants*. */
export type CardProps = 
  | CardButtonProps   // card-button
  | CardLinkProps     // card-link
  | CardContentProps  // card & ^
  | DefaultCardProps  // default (intellisense routing)
;



// #endregion
export const Card = (props: CardProps) => {
  // #region Component State
  const { 
    type, styles, additStyles, 
    noBackground, noBorder, hoverTheme, 
  } = props as CardPropsBase;
  const { focusTheme } = props as any;
  
  const getContainerStyles = (): string => {
    return styles ? styles : `
      card-container
      ${noBackground ?  '' : 'card-bg'}
      ${noBorder ?      '' : 'card-border'}
      ${hoverTheme ? 'card-hover' : ''}
      ${focusTheme ? 'card-focus' : ''}
      ${additStyles}
    `;
  }
  
  
  // #endregion
  // #region HTML: Card (Default)
  //--------------------------------//
  // Default (Container)            //
  //--------------------------------//
  if (type == 'default') {
    const { children } = props as DefaultCardProps;
    
    return (
      <Container className={getContainerStyles()}>
        { children }
      </Container>
    );
  }
  
  
  // #endregion
  // #region HTML: Card Variants (Card/Button/Link)
  //--------------------------------//
  // Card, Card-Button, Card-Link   //
  //--------------------------------//
  else {
    const { 
      title, description, noDivider, children, 
      titleStyles, additTitleStyles = '', 
      descStyles, additDescStyles = '', 
      contentStyles, additContentStyles = '' 
    } = props as CardContentProps;
		const { buttonProps, buttonLocation = 'top' } = props as CardButtonProps;
		const { linkText, onClickLink } = props as CardLinkProps;
    
    const cardButton = () => {
      if (type != 'card-button' || !buttonProps) return null;
      return (
        <div className={`pt-0.5
          ${buttonLocation == 'bottomLeft' ? 'text-left mt-2' : ''}
          ${buttonLocation == 'bottomRight' ? 'text-right' : ''}
        `}>
          <div>
            <Button 
              displayText={buttonProps.displayText || 'Submit'}
              onClick={buttonProps.onClick}
              disabled={buttonProps.disabled}
              
              icon={buttonProps.icon}
              // iconStyles={buttonProps.iconStyles}
              size={buttonProps?.size}
              color={buttonProps.color}
              additStyles={buttonProps.additStyles}
              />
          </div>
        </div>
      )
    };
    
    return (
      <Container className={getContainerStyles()}>
        <HeaderAndDescription className='row justify-between gap-2'>
          <div className='col gap-2'>
            <label className={titleStyles ? titleStyles : `card-header ${additTitleStyles}`}>
              { title }
            </label>
            <p className={descStyles ? descStyles : `card-description ${additDescStyles}`}>
              { description }
            </p>
          </div>
          
          { buttonLocation == 'top' && cardButton() }
        </HeaderAndDescription>
        
        {/* Divider and Content */}
        { !noDivider && <Divider className="card-divider" />}
        <Content className={contentStyles ? contentStyles : `card-content ${additContentStyles}`}>
          { children }
        </Content>
        
        {/* Card Button and Link */}
        { buttonLocation != 'top' && cardButton() }
        { type == 'card-link' && 
          <CardLink onClick={(e) => onClickLink(e)} className='card-link' >
            { linkText }
          </CardLink>
        }
      </Container>
    );
  }
  // #endregion
}


// Styled Components
const Container = styled.div``;
const HeaderAndDescription = styled.div``;
const CardLink = styled.div``;
const Divider = styled.div``;
const Content = styled.div``;
