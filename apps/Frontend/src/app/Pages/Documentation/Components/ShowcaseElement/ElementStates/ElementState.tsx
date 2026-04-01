import styles from './ElementState.module.scss';


export type ElementStateTypes = 'default' | 'error' | 'disabled';
export interface ElementStateProps {
  type: ElementStateTypes | string;
  isSelected?: boolean;
  onClick: (type: ElementStateTypes | string) => void;
}

export const ElementState = ({ type, isSelected = false, onClick }: ElementStateProps) => {
  return (
    <div 
      onClick={() => onClick(type)}
      className={`element-state ${isSelected ? 'element-state-selected' : ''}`}
    >
      { type }
    </div>
  );
}

export const ElementStates: ElementStateTypes[] = ['default', 'error', 'disabled'];
