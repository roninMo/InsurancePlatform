import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { ContainerStyles, ContentStyles, DescriptionStyles, IconStyleProps, LabelStyleProps, TitleStyles } from '../../../Types/ConditionalProps';
import { IconTypes, Icon } from "../../Icons/Icon";
import { Ht } from "../HeightTransWrapper/HeightTransWrapper";

import styled from "@emotion/styled";
import styles from './Dropdown.module.scss';


// #region Dropdown Props
/** The base props for the {@link Dropdown} component. */
export interface DropdownPropsBase {
	/** The label of the {@link Dropdown}. It has styles for *overriding* or *adding* styles to the base. */
  label: string;
	
	/** Whether the dropdown should be *open* by default. Otherwise it always starts closed. */
  openByDefault?: boolean;
	
	/** If you want a custom {@link Dropdown|Dropdown's} open/close icon. It has styles for *overriding* or *adding* to the base. */
  icon?: IconTypes;
  
	/** useState dispatch that is called whenever the dropdown *opens* or *closes*. */
  openListener?: Dispatch<SetStateAction<boolean>>;
  
	/** The rendered *content* within the dropdown. */
  children: ReactNode;
}

/** The props for the {@link Dropdown} component. */
export type DropdownProps = DropdownPropsBase 
  & ContainerStyles & LabelStyleProps & IconStyleProps;


// #endregion
/** The *Dropdown* component. Comes with customizable themes and smooth transitions when *opening* and *closing* the dropdown, as well as fade in animations for when it's first rendered. */
export const Dropdown = ({ 
  label, openByDefault, icon, 
  openListener, children,  
  
  styles, additStyles, 
  labelStyles, additLabelStyles, 
  iconStyles, additIconStyles, 
}: DropdownProps) => {
	// #region Rendered Html
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
	// #endregion
}


// Styled Components
const Header = styled.div``;
const Container = styled(Ht)``;
