import { useMemo } from 'react'
import { getParamsTableItems, ParamTable, ParamTableProps } from '../ParamTable/ParamTable';
import { ParamType } from '../ParamType/ParamType';
import { ParamContext } from '../ShowcaseElement/ShowcaseElement';

import styled from '@emotion/styled';
import styles from './EventParamTable.module.scss';


export const EventParamTable = ({ variant = 'default', additionalStyles }: ParamTableProps) => {
  const typeParamTableItems = useMemo(() => {
    const variantParams: string[] = defaultParams || [];
    return getParamsTableItems(variantParams, [], {}, paramTypeElements, paramDescriptionElements);
  }, []);

  return (
    <ParamTable 
      params={typeParamTableItems} 
      variant={variant}
      additionalStyles={additionalStyles}
    />
  );
}


// Styled Components
const Container = styled.div``;


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// The EventHandlers params used universally for input components - create a paramTable subclass for this
type InputEventHandlerTypes = 'onChange' | 'onBlur' | 'onFocus' | 'onClick' | 'onMouseEnter' | 'onMouseLeave';

// Used as an array to add other elements and functionality from @see ParamTable (ParamItem | 'spacing') ParamTableItem /:
const defaultParams: string[] = [ 
  'onFocus', 'onChange', 'onBlur', 
  'onClick', 'onMouseEnter', 'onMouseLeave'
];


// TODO: we could use this to highlight which ones are used on what for each component if needed
const paramContextsList: Record</*InputEventHandlerTypes*/ string, ParamContext[]> = {
  // "number": [
  //   { name: 'type="number"', 
  //     contextParam: true,
  //     variantOption: false,
  //     overwrite: 'type'
  //   },
  //   { name: 'incrementButtons', 
  //     contextParam: false,
  //     variantOption: true,
  //   },
  // ],
};


//----------------------------------------------//
// Param table static element references        //
//----------------------------------------------//
// Static FC component functions do not take up memory or increase load times, they're static and diffing is nominal
const paramTypeElements: Record<InputEventHandlerTypes, React.FC> = {
  'onFocus': () => <ParamType type='function' tooltip={{ code: Code_onFocus, type: 'type' }} />,
  'onChange': () => <ParamType type='function' tooltip={{ code: Code_onChange, type: 'type' }} />,
  'onBlur': () => <ParamType type='function' tooltip={{ code: Code_onBlur, type: 'type' }} />,
  'onClick': () => <ParamType type='function' tooltip={{ code: Code_onClick, type: 'type' }} />,
  'onMouseEnter': () => <ParamType type='function' tooltip={{ code: Code_onMouseEnter, type: 'type' }} />,
  'onMouseLeave': () => <ParamType type='function' tooltip={{ code: Code_onMouseLeave, type: 'type' }} />,
};


const Code_onFocus = 'onFocus: (e: FocusEvent<T>) => void';
const Code_onChange = 'onChange: (e: ChangeEvent<any>) => void'; 
const Code_onBlur = 'onBlur: (e: FocusEvent<T>) => void';
const Code_onClick = 'onClick: (e: MouseEvent<T>) => void';
const Code_onMouseEnter = 'onMouseEnter: (e: MouseEvent<T>) => void';
const Code_onMouseLeave = 'onMouseLeave: (e: MouseEvent<T>) => void';


const paramDescriptionElements: Record<InputEventHandlerTypes, React.FC> = {
  'onFocus': () =>
    <div className='param-item-desc-text'>
      The focus event happens every time the user focuses on this element. 
    </div>,
  'onChange': () =>
    <div className='param-item-desc-text'>
      the change function runs every time the value of this form element is updated.
    </div>,
  'onBlur': () =>
    <div className='param-item-desc-text'>
      the blur event happens every time the user leaves the focus of this element.
    </div>,
  'onClick': () =>
    <div className='param-item-desc-text'>
      This function is ran every time you click on the element.
    </div>,
  'onMouseEnter': () =>
    <div className='param-item-desc-text'>
      Runs when the user's mouse first hovers over this element.
    </div>,
  'onMouseLeave': () =>
    <div className='param-item-desc-text'>
      Runs when the user's mouse leaves the element. 
    </div>,
};