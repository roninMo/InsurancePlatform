import { useMemo } from 'react'
import { getParamsTableItems, ParamTable, ParamTableProps } from '../ParamTable/ParamTable';
import { ParamType } from '../ParamType/ParamType';

import styled from '@emotion/styled';
import styles from './EventParamTable.module.scss';
import { ParamContext } from '../ShowcaseElement/ShowcaseElement';


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
  'onChange', 'onBlur', 'onFocus', 
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
  'onChange': () => <ParamType type='function' />,
  'onBlur': () => <ParamType type='function' />,
  'onFocus': () => <ParamType type='function' />,
  'onClick': () => <ParamType type='function' />,
  'onMouseEnter': () => <ParamType type='function' />,
  'onMouseLeave': () => <ParamType type='function' />,
};

const paramDescriptionElements: Record<InputEventHandlerTypes, React.FC> = {
  'onChange': () =>
    <div className='param-item-desc-text'>
      the change function runs every time the value of this form element is updated.
    </div>,
  'onBlur': () =>
    <div className='param-item-desc-text'>
      the blur event happens every time the user leaves the focus of this element.
    </div>,
  'onFocus': () =>
    <div className='param-item-desc-text'>
      The focus event happens every time the user focuses on this element. 
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