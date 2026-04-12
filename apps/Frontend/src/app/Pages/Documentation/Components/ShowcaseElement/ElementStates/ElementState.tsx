import { Icon } from '@Project/ReactComponents';
import styles from './ElementState.module.scss';


export type ElementStateTypes = 'default' | 'error' | 'disabled' | 'errorAndDisabled';
export interface ElementStateProps {
  type: ElementStateTypes | string;
  isSelected?: boolean;
  onClick: (type: ElementStateTypes | string) => void;
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
        styles="icon-default-color size-4 mr-1" 
      /> */}
      
      { type }
    </div>
  );
}

export const ElementStates: ElementStateTypes[] = ['default', 'error', 'disabled'];
