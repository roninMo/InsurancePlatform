import styled from '@emotion/styled';
import { Icon, IconTypes } from '../../../Common/Icons/Icon';

import styles from './SelectItem.module.scss';


export interface SelectItemValues {
  value: string;
  label: string;
  iconProps?: SelectItemIconConfig;
}

export interface SelectItemIconConfig {
  icon: IconTypes;
  placement?: 'left' | 'right';
  styles?: string;
}

export interface SelectItemProps {
  item: SelectItemValues;
  index: number;
  onSelect?: (selected: SelectItemValues, index: number) => void;
  styles?: string;
  currentSelectValue: SelectItemValues;
  id: string;
}


export const SelectItem = ({ item, index, onSelect, styles, currentSelectValue, id }: SelectItemProps) => {
  // console.log('props', { item, index, onSelect, styles, currentSelectValue, id });
  return (
    <Container 
      onClick={() => onSelect && onSelect(item, index)} 
      className={`${itemStyles} ${styles} 
      ${item.value == currentSelectValue.value && activeItemStyles}`}
      id={`${id}-${item.value}`}
    >
      <LeftHandSide className={`flex flex-row justify-start gap-2 items-center`}>
        {item.iconProps && item?.iconProps.placement == 'left' && 
          <div className={`icon-placeholder min-h-4 min-w-5`}> 
              <Icon variant={item.iconProps.icon} styles={item.iconProps.styles ? item.iconProps.styles : undefined} /> 
          </div>
        }

        <option value={item.value} id={`${id}-option-${index}`}> 
          { item.label } 
        </option>
      </LeftHandSide>

      {item.iconProps && item?.iconProps.placement != 'left' && // if the icon placement is on the right (handles default object args)
        <Icon variant={item.iconProps.icon} styles={item.iconProps.styles ? item.iconProps.styles : undefined} /> 
      }
    </Container>
  );
}


// #region Styling
const itemStyles = `
  flex flex-row gap-2 justify-between items-center p-2 pr-4
  [&_option]:hover:text-slate-200 dark:[&_option]:hover:text-slate-200
  hover:bg-indigo-500 
  [&_svg]:hover:text-slate-200
`;
const activeItemStyles = `
  bg-indigo-400 dark:bg-indigo-400 
  [&_option]:text-slate-300
  [&_svg]:text-slate-300
`;

// todo: try faded with borders bg-opacity

const Container = styled.span``;
const LeftHandSide = styled.div``;
// #endregion
