import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { Ht, Icon, IconTypes } from "@Project/ReactComponents";
import styled from "@emotion/styled";
import styles from './Dropdown.module.scss';


export interface DropdownProps {
  label: string;

  // Dropdown
  openByDefault?: boolean;
  styles?: string;
  additionalStyles?: string;

  // Component Styles
  labelStyles?: string;
  icon?: IconTypes;
  iconStyles?: string;

  // optional state tracking
  hasBeenOpened?: boolean;
  setHasBeenOpened?: Dispatch<SetStateAction<boolean>>;

  children: ReactNode;
}

export const Dropdown = ({ 
  label, openByDefault, styles, additionalStyles, 
  labelStyles, icon, iconStyles,
  hasBeenOpened, setHasBeenOpened, 
  children 
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
    <div className={styles ? styles : `col gap-2 w-full animate-fade-in ${additionalStyles}`}>
      <Header className="w-full rowStart items-center gap-1 " onClick={() => toggleDropdown()}>
        <Icon 
          variant={icon ? icon : 'DropdownArrow'} 
          styles={`${iconStyles ? iconStyles : 'dropdown-icon'} ${dropdownOpen ? '' : '-rotate-90'}`} 
        />
        <div className={labelStyles ? labelStyles : 'dropdown-header'}>
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
