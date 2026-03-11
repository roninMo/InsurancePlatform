import { ReactNode, MouseEvent } from 'react';
import styled from '@emotion/styled';

import styles from './Card.module.scss';


export type CardType = 
    'default'     // standard container
  | 'card'        // card layout with description, title, and custom content
  | 'card-button' // card with a title, description, and a button event
  | 'card-link'   // card with a title, description, and a button event
;

export interface CardProps {
  type?: CardType;
  children?: ReactNode; // Make children optional

  title?: string;
  description?: string;
  onClick?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;

  // styles 
  background: 'default' | 'none';
  outline: 'default' | 'none';
}


export const Card = ({ type = 'default', children }: CardProps) => {
  const containerStyles = '';

  if (type == 'default') return (
    <Container className="bg-default outline-css outline-styles">
      { children }
    </Container>
  );
}


const Container = styled.div``;