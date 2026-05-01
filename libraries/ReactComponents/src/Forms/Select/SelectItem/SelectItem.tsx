import { memo } from 'react';
import { Icon, IconTypes } from '../../../Common/Icons/Icon';

import styled from '@emotion/styled';
import styles from './SelectItem.module.scss';


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
  name: string; // "form group id"
  dropdownOpen: boolean; // because of the memo
}


export const SelectItemComponent = memo(({ item, index, onSelect, currentSelectValue, multiSelect, name, dropdownOpen }: SelectItemProps) => {
  const { value, label, iconProps, selected } = item;

  const currentlySelected = () => {
    if (multiSelect) return selected; // TODO: this should be okay for both. 
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
}, (prevProps, nextProps) => {
  // We're using a map on the selectedValues, 
  // so just check if the selectItem object is a "new" object to handle shallow equality checks. 
  return (
    prevProps.item === nextProps.item && 
    prevProps.multiSelect === nextProps.multiSelect && 
    prevProps.dropdownOpen === nextProps.dropdownOpen
  );
});


// Styled Components
const Container = styled.span``;
const LeftHandSide = styled.div``;
const ItemText = styled.option``;
