import { ChangeEvent, FocusEvent, memo } from 'react';
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
  /** The select item's information, including it's value. */
  item: SelectItem;

  /** The form name of the select. In the select item it's used for the various id references. */
  name: string;

  /** Additional logic to run when the user selects a value. If you're not using Rhf, this is how you update the value. */
  handleItemSelected?: (selected: SelectItem) => void;

  /** Whether this value is currently selected. */
  isSelected?: boolean;

  /** Whether we're using a multiselect */
  multiSelect?: boolean;
  
  /** Whether the dropdown is open. We're using this because this component is memoized. */
  dropdownOpen: boolean;
}


export const SelectItemComponent = memo(({ item, name, isSelected, handleItemSelected, multiSelect, dropdownOpen }: SelectItemProps) => {
  const { value, label, iconProps } = item;
  // console.log(`SelectItem ${item.value} rerendered, isSelected(${isSelected}), dropdownOpen(${dropdownOpen})`);

  return (
    <Container 
      id={`${name}-${value}`}
      onClick={() => handleItemSelected && handleItemSelected(item)} 
      className={`group ${isSelected ? 'select-item-selected' : 'select-item'}`}
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
          className={`${isSelected ? 'select-item-text-selected' : 'select-item-text'}`}
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

// custom rerender functionality
}, (prevProps, nextProps) => {

  // If its selection status changed, rerender
  if (prevProps.isSelected !== nextProps.isSelected) {
    return false; 
  }

  // If the internal item selection flag changed, rerender
  if (prevProps.item.selected !== nextProps.item.selected) {
    return false;
  }

  // If the dropdown opens or closes, rerender (to manage visibility/animations)
  if (prevProps.dropdownOpen !== nextProps.dropdownOpen) {
    return false;
  }

  // If configurations change, rerender
  if (prevProps.multiSelect !== nextProps.multiSelect || prevProps.name !== nextProps.name) {
    return false;
  }

  // If nothing changed, safely skip the rerender
  return true; 
});


// Styled Components
const Container = styled.span``;
const LeftHandSide = styled.div``;
const ItemText = styled.option``;
