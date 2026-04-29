import { ReactNode, MouseEvent, useMemo } from 'react';
import { Button, ButtonProps } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './Card.module.scss';


export type CardType = 
  | 'default'     // standard container
  | 'card'        // card layout with description, title, and custom content
  | 'card-button' // card with a title, description, and a button event
  | 'card-link'   // card with a title, description, and a hashLink
;

// Card Props
export type CardPropsBase = ContainerStyles & ContentStyles & {
  type: CardType;
  noBackground?: boolean; // Removed styling from the base styles

  noBorder?: boolean;
  hoverTheme?: boolean;

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
  buttonLocation: 'bottomLeft' | 'bottomRight' | 'top';
  focusTheme?: boolean; // add focus to the border when the button is clicked?
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
  | CardPropsBase     // default (intellisense routing)
;


// #region Card styles 
// note: Adding @deprecated is what removes it from the intellisense options, so these are kind of bloated
// Container Styles
type ContainerStyles = 
| { 
    styles?: string; 
    /** @deprecated CANNOT use 'additStyles' when 'styles' is present. */
    additStyles?: never; 
  } 
| { 
    additStyles?: string; 
    /** @deprecated CANNOT use 'styles' when 'additStyles' is present. */
    styles?: never; 
  };

// Header Styles
type HeaderStyles = 
| { 
    title: string; 
    headerStyles?: string; 
    /** @deprecated CANNOT use 'additHeaderStyles' when 'headerStyles' is present. */
    additHeaderStyles?: never; 
  } 
| { 
    title: string; 
    additHeaderStyles?: string; 
    /** @deprecated CANNOT use 'headerStyles' when 'additHeaderStyles' is present. */
    headerStyles?: never; 
  }

| { 
    title?: never; 
    headerStyles?: never; 
    additHeaderStyles?: never; 
  };

// Description Styles
type DescriptionStyles = 
| { 
    description: string; 
    descStyles?: string; 
    /** @deprecated CANNOT use 'additDescStyles' when 'descStyles' is present. */
    additDescStyles?: never; 
  } 

| { 
    description: string; 
    additDescStyles?: string; 
    /** @deprecated CANNOT use 'descStyles' when 'additDescStyles' is present. */
    descStyles?: never; 
  }
| { 
    description?: never; 
    descStyles?: never; 
    additDescStyles?: never; 
  };

// Content Styles
type ContentStyles = 

| { 
    children: ReactNode; 
    contentStyles?: string; 
    /** @deprecated CANNOT use 'additContentStyles' when 'contentStyles' is present. */
    additContentStyles?: never; 
  } 
| { 
    children: ReactNode; 
    additContentStyles?: string; 
    /** @deprecated CANNOT use 'contentStyles' when 'additContentStyles' is present. */
    contentStyles?: never; 
  }
| { 
    children?: never; 
    contentStyles?: never; 
    additContentStyles?: never; 
  };
// #endregion



export const Card = (props: CardProps) => {
  const { 
    type, styles, additStyles, 
    noBackground, noBorder, hoverTheme,
    children 
  } = props as CardPropsBase;
  const { focusTheme } = props as any;

  const getContainerStyles = (): string => {
    let classes = styles ? styles : `card-container ${additStyles}`;
    if (!noBackground) classes += ` card-bg`;
    if (!noBorder) classes += ` card-border`;
    if (hoverTheme) classes += ` card-hover`;
    if (focusTheme) classes += ` card-focus`;
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
  // Card, Card-Button, Card-Link   //
  //--------------------------------//
  else {
    const { 
      title, description, noDivider, 
      headerStyles, additHeaderStyles = '', 
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
            <label className={headerStyles ? headerStyles : `card-header ${additHeaderStyles}`}>
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
}


// Styled Components
const Container = styled.div``;
const HeaderAndDescription = styled.div``;
const CardLink = styled.div``;
const Divider = styled.div``;
const Content = styled.div``;
