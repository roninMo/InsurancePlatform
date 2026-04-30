import { ReactNode } from 'react';
import { Icon, IconTypes } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './Alert.module.scss';


export type AlertType = 'info' | 'warning' | 'error' | 'ok' | 'gray';
interface AlertPropsBase {
  type: AlertType;
  children: ReactNode;
  additionalStyles?: string;
}

export type AlertProps = AlertPropsBase;

export const Alert = ({ type, children, additionalStyles = '' }: AlertProps) => {
  const getAlertTheme = (): string => {
    if (type == 'info') return 'selected-box';
    if (type == 'warning') return 'warning-box';
    if (type == 'error') return 'error-box';
    if (type == 'ok') return 'ok-box';
    if (type == 'gray') return 'faded-box';
    return '';
  }

  const getTextTheme = (): string => {
    if (type == 'info') return 'primary-text';
    if (type == 'warning') return 'warning-text';
    if (type == 'error') return 'error-text';
    if (type == 'ok') return 'ok-text';
    if (type == 'gray') return 'placeholder-text';
    return '';
  }

  return (
    <Container className={`alert ${getAlertTheme()}`}>
      <Icon variant={AlertIcons[type]} styles={`size-4 justify-center self-center ${getTextTheme()} opacity-90`} />

      <div className={`alert-content ${getTextTheme()} ${additionalStyles}`}>
        { children }
      </div>
    </Container>
  );
}


// Styled Components
const Container = styled.div``;

// Alert Icon map
const AlertIcons: Record<AlertType, IconTypes> = {
  'info': 'InfoBox',
  'warning': 'Error',
  'error': 'Error',
  'ok': 'Checkbox',
  'gray': 'InfoBox',
};