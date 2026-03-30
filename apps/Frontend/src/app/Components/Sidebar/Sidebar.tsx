import {Dispatch, SetStateAction, useState} from "react";
import { HashLink } from "../Utils/HashLink/HashLink";

import styled from "@emotion/styled";
import styles from './Sidebar.module.scss';


export interface SidebarLinkProps {
  label: string;
  url: string;
}

export interface SubPageLinkProps {
  sectionLink: SidebarLinkProps;
  subLinks: SidebarLinkProps[];
}


// TODO: Eventually make these nested
export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  onSetSidebarState: (wasOpened: boolean) => void;

  LinkSections: SubPageLinkProps[];
}
export const Sidebar = ({ sidebarOpen, setSidebarOpen, onSetSidebarState, LinkSections }: SidebarProps) => {
  const [sidebarRendered, setSidebarRendered] = useState<boolean>(); // We might need a delay hooked to this for open/close animations 
  
  const toggleSidebar = (setOpened: boolean) => {
    setSidebarOpen(setOpened);
    if (onSetSidebarState) onSetSidebarState(setOpened);
  }
  
  return (
    <Container className="sidebar col gap-2 p-4 pr-20">
      {/* TODO: Eventual open close arrow with fixed positioning */}
      
      <h4 className="pb-6">
        Navigation
      </h4>

      { LinkSections.map(({ sectionLink, subLinks }: SubPageLinkProps, index: number) => 
        <SidebarLinks 
          sectionLink={sectionLink} 
          subLinks={subLinks} 
          key={`sidebar-section-${sectionLink.label}-${index}`} 
        />
      )}
      
    </Container>
  );
}


const SidebarLinks = ({ sectionLink, subLinks }: SubPageLinkProps) => {
  return (
    <div className="colStart pb-4">
      <HashLink 
        url={sectionLink.url} label={sectionLink.label} 
        styles="pb-2 sidebar-link-header" 
      />

      { subLinks.map(({url, label}: SidebarLinkProps, index: number) =>
        <HashLink 
          label={label} 
          url={url} 
          styles="pl-4 sidebar-link"
          key={`sidebar-link(${index})-${label}`} 
        />
      )}
    </div>
  );
}


// Styled Components
const Container = styled.div``;
