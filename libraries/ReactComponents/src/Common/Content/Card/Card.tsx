import { ReactNode, MouseEvent, useMemo } from 'react';
import { Button, ButtonProps } from '../../../Forms/Button/Button';
import { ContainerStyles, ContentStyles, DescriptionStyles, TitleStyles } from '../../../Types/ConditionalProps';

import styled from '@emotion/styled';
import styles from './Card.module.scss';


// #region Props and Types
export type CardType = 
  | 'default'     // standard container
  | 'card'        // card layout with description, title, and custom content
  | 'card-button' // card with a title, description, and a button event
  | 'card-link'   // card with a title, description, and a hashLink
;

// Card Props
export type CardPropsBase = ContainerStyles & {
  type: CardType;
  noBackground?: boolean; // Removed styling from the base styles

  noBorder?: boolean;
  hoverTheme?: boolean;

  // // Container styles
  // (styles || additStyles)?: string;
}


type DefaultCardProps = CardPropsBase & {
  type: 'default';
  children: ReactNode; // this variant just uses styles/additStyles
};


type CardContentProps = CardPropsBase 
  & TitleStyles 
  & DescriptionStyles 
  & ContentStyles
& {
  type: 'card' | 'card-button' | 'card-link';
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

export type ButtonLocation = 'bottomLeft' | 'bottomRight' | 'top';
export type CardButtonProps = CardContentProps & {
  type: 'card-button';
  buttonProps: ButtonProps;
  buttonLocation: ButtonLocation;
  focusTheme?: boolean;
}

export type CardLinkProps = CardContentProps & {
  type: 'card-link';
  linkText: string;
  onClickLink: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
}

export type CardProps = 
  | CardButtonProps   // card-button
  | CardLinkProps     // card-link
  | CardContentProps  // card & ^
  | DefaultCardProps     // default (intellisense routing)
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
              iconStyles={buttonProps.iconStyles}
              size={buttonProps?.size}
              color={buttonProps.color}
              additionalStyles={buttonProps.additionalStyles}
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
