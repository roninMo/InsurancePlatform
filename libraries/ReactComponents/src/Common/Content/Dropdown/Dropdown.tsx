import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { ContainerStyles, ContentStyles, DescriptionStyles, IconStyleProps, LabelStyleProps, TitleStyles } from '../../../Types/ConditionalProps';
import { IconTypes, Icon } from "../../Icons/Icon";
import { Ht } from "../HeightTransWrapper/HeightTransWrapper";

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
  & ContainerStyles & LabelStyleProps & IconStyleProps;


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
