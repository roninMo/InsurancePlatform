import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconTypes, Icon } from "@Project/ReactComponents";
import styled from "@emotion/styled";
import styles from './Dropdown.module.scss';


export interface DropdownProps {
  label: string;
  styles?: string;
  icon?: IconTypes;
  iconStyles?: string;

  openByDefault?: boolean;
  hasBeenOpened?: boolean;
  setHasBeenOpened?: Dispatch<SetStateAction<boolean>>;

  children?: ReactNode;
}

export const Dropdown = ({ 
  label, styles, icon, iconStyles, openByDefault,
  hasBeenOpened, setHasBeenOpened, children 
}: DropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const defaultIconStyles = `dropdown-icon ${dropdownOpen ? '' : '-rotate-90'}`;

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
    const prevState = dropdownOpen;
    setDropdownOpen(!dropdownOpen);
    
    if (setHasBeenOpened && !hasBeenOpened && !prevState) { 
      setHasBeenOpened(true);
    }
  }

  return (
    <div className='col gap-2 w-full'>
      <Header className="w-full rowStart items-center gap-1" onClick={() => toggleDropdown()}>
        <Icon variant={icon ? icon : 'DropdownArrow'} styles={iconStyles ? iconStyles : defaultIconStyles} />
        <p className={styles ? styles : 'text-xl lg:text-2xl header-colors font-medium'}>
          { label }
        </p>
      </Header>

      <Container className={`height-trans ${dropdownOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className='height-trans-content'>
          { children }
        </div>
      </Container>
    </div>
  );
}


// Styled Components
const Header = styled.div``;
const Container = styled.div``;
