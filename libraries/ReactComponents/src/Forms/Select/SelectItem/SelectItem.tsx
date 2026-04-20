import styled from '@emotion/styled';
import { Icon, IconTypes } from '../../../Common/Icons/Icon';

import styles from './SelectItem.module.scss';
import { RefObject } from 'react';


export interface SelectItem {
  value: string;
  label: string;
  iconProps?: SelectItemIconConfig;
  selected?: boolean; // used with multiselect
}

export interface SelectItemIconConfig {
  icon: IconTypes;
  placement?: 'left' | 'right';
  styles?: string;
}

export interface SelectItemProps {
  item: SelectItem;
  index: number;
  onSelect?: (selected: SelectItem, index: number) => void;
  currentSelectValue: SelectItem;
  multiSelect?: boolean;
  selectedValues?: RefObject<Record<string, boolean>>; // specific to multiSelect
  name: string; // "form group id"
}


export const SelectItemComponent = ({ item, index, onSelect, currentSelectValue, multiSelect, selectedValues, name }: SelectItemProps) => {
  const { value, label, iconProps } = item;

  const currentlySelected = () => {
    if (multiSelect && selectedValues?.current) return selectedValues.current[value];
    return value == currentSelectValue.value;
  };
  
  return (
    <Container 
      id={`${name}-${value}`}
      onClick={() => onSelect && onSelect(item, index)} 
      className={`group ${currentlySelected() ? 'select-item-selected' : 'select-item'}`}
    >
      <LeftHandSide className={`rowStart gap-2 items-center`}>
        {iconProps && iconProps.placement == 'left' && 
          <div className={`icon-placeholder min-h-4 min-w-5`}> 
            <Icon variant={iconProps.icon} styles={iconProps.styles ? iconProps.styles : ''} /> 
          </div>
        }

        <ItemText 
          id={`${name}-option-${value}`} 
          value={value} 
          className={`${currentlySelected() ? 'select-item-text-selected' : 'select-item-text'}`}
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


// Styled Components
const Container = styled.span``;
const LeftHandSide = styled.div``;
const ItemText = styled.option``;
