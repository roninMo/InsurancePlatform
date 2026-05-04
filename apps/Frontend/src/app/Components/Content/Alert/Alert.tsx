import { ReactNode } from 'react';
import { Icon, IconTypes } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './Alert.module.scss';


export type AlertType = 'info' | 'warning' | 'error' | 'ok' | 'question';
interface AlertPropsBase {
  type: AlertType;
  children: ReactNode;
  additStyles?: string;
  additCStyles?: string;
}

export type AlertProps = AlertPropsBase;

export const Alert = ({ type, children, additStyles = '', additCStyles = '' }: AlertProps) => {
  const getAlertTheme = (): string => {
    if (type == 'info') return 'selected-box [&_.alert-content]:primary-text';
    if (type == 'warning') return 'warning-box [&_.alert-content]:warning-text';
    if (type == 'error') return 'error-box [&_.alert-content]:error-text';
    if (type == 'ok') return 'ok-box [&_.alert-content]:ok-text';
    if (type == 'question') return 'faded-box [&_.alert-content]:placeholder-text';
    return '';
  }

  const getIconColor = (): string => {
    if (type == 'info') return 'i-info-color';
    if (type == 'warning') return 'i-warn-color';
    if (type == 'error') return 'i-err-color';
    if (type == 'ok') return 'i-ok-color';
    if (type == 'question') return 'i-default-color';
    return '';
  }

  return (
    <Container className={`alert ${getAlertTheme()} ${additCStyles}`}>
      <Icon variant={AlertIcons[type]} styles={`alert-icon ${getIconColor()}`} />

      <div className={`alert-content ${additStyles}`}>
        { children }
      </div>
    </Container>
  );
}


// Styled Components
const Container = styled.div``;

// Alert Icon map
const AlertIcons: Record<AlertType, IconTypes> = {
  'info':     'OutlineQuestion',
  'warning':  'OutlineWarning',
  'error':    'OutlineError',
  'ok':       'OutlineOkay',
  'question': 'OutlineQuestion',
};
