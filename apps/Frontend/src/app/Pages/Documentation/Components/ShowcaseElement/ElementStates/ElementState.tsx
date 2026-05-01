import { Icon } from '@Project/ReactComponents';
import styles from './ElementState.module.scss';


export type ElementStateDefaults = 'default' | 'error' | 'disabled' | 'errorAndDisabled';
export type ElementStateTypes = ElementStateDefaults | (string & {});
export interface ElementStateProps {
  type: ElementStateTypes;
  isSelected?: boolean;
  onClick: (type: ElementStateTypes) => void;
}

export const ElementState = ({ type, isSelected = false, onClick }: ElementStateProps) => {
  return (
    <div 
    onClick={() => onClick(type)}
    className={`element-state ${isSelected ? 'element-state-selected' : ''} rowStart items-center`}
    >
      {/* TODO: Make the bubble element states one element with no padding, and arrows on either side to transition between each */}
      {/* <Icon 
        variant={type == 'error' ? 'CircleError' : type == 'disabled' ? 'CirclePause' : 'CircleCheck'}
        styles="i-default-color size-4 mr-1" 
      /> */}
      
      { type }
    </div>
  );
}

export const ElementStates: ElementStateTypes[] = ['default', 'error', 'disabled'];
