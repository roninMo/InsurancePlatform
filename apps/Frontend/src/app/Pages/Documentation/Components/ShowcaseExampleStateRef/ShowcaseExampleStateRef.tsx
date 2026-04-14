import { Dispatch, SetStateAction, ReactNode, useId, useState } from 'react';
import { ElementStateTypes, ElementState } from '../ShowcaseElement/ElementStates/ElementState';

import styles from './ShowcaseExampleStateRef.module.scss';


interface ShowcaseExampleStateRefProps {
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  elementStateTypes?: ElementStateTypes[];
  styles: string;
  stateStyles: string;
  children: ReactNode;
}

export const ShowcaseExample_StateRef = ({ 
  error, setError, disabled, setDisabled, 
  elementStateTypes, styles, stateStyles, children 
}: ShowcaseExampleStateRefProps) => {
  const id = useId();
  const [elementStates, setElementStates] = useState<Record<ElementStateTypes, boolean>>({
    'default': (!error && !disabled), // capture previous states from parent
    'error': (!!error && !disabled), 
    'disabled': (disabled && !error), 
    'errorAndDisabled': (!!error && disabled),
    ...elementStateTypes?.map((stateType: ElementStateTypes) => ({[stateType]: false}))
  });

  const onSelectState = (type: ElementStateTypes | string) => {
    const currentTypeValue = elementStates?.[type as ElementStateTypes] || false;
    const nextTypeValue = !elementStates?.[type as ElementStateTypes] || false;
    const clearedState: any = Object.fromEntries(Object.entries(elementStates)
      ?.map(([type, isSelected]) => [type, false])); // { 'error': false }

    if (currentTypeValue) return; // Stop if they're selecting the current state
    setElementStates((prevState: Record<ElementStateTypes, boolean>) => {
      const nextState = clearedState;
      nextState[type as ElementStateTypes] = nextTypeValue;
      return nextState;
    });

    // Change input state
    if (type == 'default') {
      if (error) setError('');
      if (disabled) setDisabled(false);
    }
    
    else if (type == 'error') {
      if (!error) setError('An error occurred.');
      if (disabled) setDisabled(false);
    } 
    
    else if (type == 'disabled') {
      if (error) setError('');
      if (!disabled) setDisabled(true);
    }

    else if (type == 'errorAndDisabled') {
      if (!error) setError('An error occurred.');
      if (!disabled) setDisabled(true);
    }
  }

  return (
    <>
      <div className={styles}>
        { children }
      </div>
      <div className={stateStyles}>
        { Object.entries(elementStates)?.map(([type, isSelected]) => 
          <ElementState type={type} isSelected={isSelected} onClick={() => onSelectState(type)} key={`element-state-${type}-${id}`} />
        )}
      </div>
    </>
  )
}

