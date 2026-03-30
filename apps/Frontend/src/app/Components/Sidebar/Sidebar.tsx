import styles from './Sidebar.module.scss';
import styled from "@emotion/styled";
import {Dispatch, SetStateAction} from "react";
import {HashLink} from "../Utils/HashLink/HashLink";


export interface SidebarLinkProps {
  label: string;
  url: string;
  styles?: string;
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
export const Sidebar = ({
  sidebarOpen, setSidebarOpen, onSetSidebarState, LinkSections 
}: SidebarProps) => {
  
  const toggleSidebar = (setOpened: boolean) => {
    setSidebarOpen(setOpened);
    if (onSetSidebarState) onSetSidebarState(setOpened);
  }
  
  return (
    <Container className="sidebar col gap-2 p-4 pr-20">
      {/* Eventual open close arrow with fixed positioning */}
      
      <h4 className="pb-6">
        Navigation
      </h4>

      { LinkSections.map(({ sectionLink, subLinks }: SubPageLinkProps) => 
        <SidebarLinks sectionLink={sectionLink} subLinks={subLinks} />
      )}
      
    </Container>
  );
}


const SidebarLinks = ({ sectionLink, subLinks }: SubPageLinkProps) => {
  return (
    <div className="colStart pb-4">
      <HashLink 
        url={sectionLink.url} label={sectionLink.label} 
        styles={"pb-2 " + (sectionLink?.styles ? sectionLink.styles : 'sidebar-link-header')} 
      />

      { subLinks.map(({url, label, styles}: SidebarLinkProps, index: number) =>
        <HashLink key={`sidebar-link(${index})-${label}`} 
          url={url} label={label} 
          styles={"pl-4 " + (styles ? styles : 'sidebar-link')}
        />
      )}
    </div>
  );
}


// Styled Components
const Container = styled.div``;