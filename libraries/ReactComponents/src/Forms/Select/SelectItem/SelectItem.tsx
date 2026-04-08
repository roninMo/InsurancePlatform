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
  currentSelectValue: SelectItemValues;
  name: string; // "form group id"
}


export const SelectItem = ({ item, index, onSelect, currentSelectValue, name }: SelectItemProps) => {
  const { value, label, iconProps } = item;
  const currentlySelected = () => value == currentSelectValue.value;
  
  return (
    <Container 
      onClick={() => onSelect && onSelect(item, index)} 
      className={`select-item group ${currentlySelected() ? 'select-item-active' : ''}`}
    >
      <LeftHandSide className={`rowStart gap-2 items-center`}>
        {/* Icon (left side aligned) */}
        {iconProps && iconProps.placement == 'left' && 
          <div className={`icon-placeholder min-h-4 min-w-5`}> 
            <Icon variant={iconProps.icon} styles={iconProps.styles ? iconProps.styles : ''} /> 
          </div>
        }

        <ItemText value={value} id={`${name}-option-${index}`} 
          className={`select-item-text ${currentlySelected() ? 'select-item-text-active' : ''}`}
        > 
          { label } 
        </ItemText>
      </LeftHandSide>

      {/* Icon (right side aligned) */}
      {iconProps && iconProps.placement != 'left' && 
        <Icon variant={iconProps.icon} styles={iconProps.styles ? iconProps.styles : ''} /> 
      }
    </Container>
  );
}


// #region Styling
const itemStyles = `
  rowBetween gap-2 items-center p-2 pr-4
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
const ItemText = styled.option``;
// #endregion
