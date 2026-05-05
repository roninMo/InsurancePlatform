import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { Ht, Icon, IconTypes } from "@Project/ReactComponents";

import styled from "@emotion/styled";
import styles from './Dropdown.module.scss';


export interface DropdownPropsBase {
  label: string;
  openByDefault?: boolean;
  icon?: IconTypes;
  
  // retrieves whether this dropdown is opened
  openListener?: Dispatch<SetStateAction<boolean>>;

  children: ReactNode;
}

export type DropdownProps = DropdownPropsBase 
  & DropdownStyleProps & LabelStyleProps & IconStyleProps;

// #region conditional style props 
// Container Styles
type DropdownStyleProps = 
| { 
    styles?: string; 
    /** @deprecated CANNOT use 'additStyles' when 'styles' is present. */
    additStyles?: never; 
  } 
| { 
    additStyles?: string; 
    /** @deprecated CANNOT use 'styles' when 'additStyles' is present. */
    styles?: never; 
  };

type LabelStyleProps = 
| { 
    labelStyles?: string; 
    /** @deprecated CANNOT use 'additStyles' when 'styles' is present. */
    additLabelStyles?: never; 
  } 
| { 
    additLabelStyles?: string; 
    /** @deprecated CANNOT use 'styles' when 'additStyles' is present. */
    labelStyles?: never; 
  };

type IconStyleProps = 
| { 
    iconStyles?: string; 
    /** @deprecated CANNOT use 'additStyles' when 'styles' is present. */
    additIconStyles?: never; 
  } 
| { 
    additIconStyles?: string; 
    /** @deprecated CANNOT use 'styles' when 'additStyles' is present. */
    iconStyles?: never; 
  }
| { 
    icon?: never; 
    iconStyles?: never; 
    additIconStyles?: never; 
  };
// #endregion


export const Dropdown = ({ 
  label, openByDefault, icon, 
  openListener, children,  
  
  styles, additStyles, 
  labelStyles, additLabelStyles, 
  iconStyles, additIconStyles, 
}: DropdownProps) => {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);

  // OpenByDefault and listeners logic
  useEffect(() => {
    if (!openByDefault) return;

    setInternalOpen(true);
    if (openListener) openListener(true);
  }, []);

  // toggle the dropdown and relay the current open state to any listeners
  const toggleDropdown = () => {
    const updatedOpenState = !internalOpen;
    setInternalOpen(updatedOpenState);
    if (openListener) openListener(updatedOpenState);
  }


  return (
    <div className={styles ? styles : `col gap-2 w-full animate-fade-in ${additStyles}`}>
      <Header className="w-full rowStart items-center gap-1 " onClick={() => toggleDropdown()}>
        <Icon 
          variant={icon ? icon : 'DropdownArrow'} 
          styles={`
            ${iconStyles ? iconStyles : `dropdown-icon ${additIconStyles}`} 
            ${internalOpen ? '' : '-rotate-90'}
          `} 
        />
        <div className={labelStyles ? labelStyles : `dropdown-header ${additLabelStyles}`}>
          { label }
        </div>
      </Header>

      <Container show={internalOpen}>
        { children }
      </Container>
    </div>
  );
}


// Styled Components
const Header = styled.div``;
const Container = styled(Ht)``;
