import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { Ht, Icon, IconTypes } from "@Project/ReactComponents";

import styled from "@emotion/styled";
import styles from './Dropdown.module.scss';


export interface DropdownPropsBase {
  label: string;
  openByDefault?: boolean;
  icon?: IconTypes;

  // optional state tracking
  hasBeenOpened?: boolean;
  setHasBeenOpened?: Dispatch<SetStateAction<boolean>>;

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
  hasBeenOpened, setHasBeenOpened, 
  children,  
  
  styles, additStyles, 
  labelStyles, additLabelStyles, 
  iconStyles, additIconStyles, 
}: DropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // OpenByDefault and listeners logic
  useEffect(() => {
    if (openByDefault) {
      setDropdownOpen(true);

      if (setHasBeenOpened) {
        if (hasBeenOpened == undefined) setHasBeenOpened(true);
        else if (hasBeenOpened == false) setHasBeenOpened(true);
      }
    }
  }, []);

  const toggleDropdown = () => {
    const opened = !dropdownOpen;
    setDropdownOpen(opened);
    
    if (opened && (!hasBeenOpened && setHasBeenOpened)) { 
      setHasBeenOpened(true);
    }
  }

  return (
    <div className={styles ? styles : `col gap-2 w-full animate-fade-in ${additStyles}`}>
      <Header className="w-full rowStart items-center gap-1 " onClick={() => toggleDropdown()}>
        <Icon 
          variant={icon ? icon : 'DropdownArrow'} 
          styles={`
            ${iconStyles ? iconStyles : `dropdown-icon ${additIconStyles}`} 
            ${dropdownOpen ? '' : '-rotate-90'}
          `} 
        />
        <div className={labelStyles ? labelStyles : `dropdown-header ${additLabelStyles}`}>
          { label }
        </div>
      </Header>

      <Container show={dropdownOpen}>
        { children }
      </Container>
    </div>
  );
}


// Styled Components
const Header = styled.div``;
const Container = styled(Ht)``;
