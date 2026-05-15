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
  const { value, label, iconProps, selected } = item;


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
  let shouldRerender = false;

  
  // If they have keepDropdownOpenOnSelect set to true for a non multiSelect
  const usingKeepDropdownOpen = !nextProps.multiSelect && prevProps.dropdownOpen && nextProps.dropdownOpen;
  // if (!nextProps.multiSelect && usingKeepDropdownOpen) {
  //   const wasPreviouslySelected = prevProps?.currentValue?.value == prevProps.item.value;
  //   const wasJustSelected = nextProps?.currentValue?.value == prevProps.item.value;

  //   // Dropdown open/close handles the majority of the actual rerenders, and if the item's "checked" value is changed
  //   if (wasPreviouslySelected || wasJustSelected) shouldRerender = true; // accounts for both multi and normal
  // }

  // scenario rerenders
  if (shouldRerender) return false;

  // Default Logic - just check if the memoized selectItem object is an updated object to handle shallow equality checks. 
  return ( prevProps.item.selected === nextProps.item.selected // TODO: handle how we check against this with non rhf
    && prevProps.isSelected === nextProps.isSelected
    && prevProps.multiSelect === nextProps.multiSelect 
    && prevProps.dropdownOpen === nextProps.dropdownOpen 
  );
});


// Styled Components
const Container = styled.span``;
const LeftHandSide = styled.div``;
const ItemText = styled.option``;
