import { MouseEvent, Dispatch, SetStateAction, useState} from "react";
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
  const [currentPage, setCurrentPage] = useState<string>("");
  const toggleSidebar = (setOpened: boolean) => {
    setSidebarOpen(setOpened);
    if (onSetSidebarState) onSetSidebarState(setOpened);
  }
  
  return (
    <Container className="sidebar col gap-2 p-4 pr-10">
      {/* TODO: Eventual open close arrow with fixed positioning */}
      
      <h4 className="pb-6">
        Navigation
      </h4>

      { LinkSections.map(({ sectionLink, subLinks }: SubPageLinkProps, index: number) => 
        <SidebarLinks 
          sectionLink={sectionLink} 
          subLinks={subLinks} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          key={`sidebar-section-${sectionLink.label}-${index}`} 
        />
      )}
      
    </Container>
  );
}


// Sidebar nested links
interface SideBarLinkProps extends SubPageLinkProps {
  currentPage: string;
  setCurrentPage: Dispatch<SetStateAction<string>>;
}

const SidebarLinks = ({ sectionLink, subLinks, currentPage, setCurrentPage }: SideBarLinkProps) => {
  const handlePageSelected = (pageLabel: string, e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    setCurrentPage(pageLabel);
  }

  return (
    <div className="colStart pb-4">
      <HashLink 
        url={sectionLink.url} label={sectionLink.label} 
        styles="pb-2 sidebar-link-header" 
      />

      { subLinks.map(({url, label}: SidebarLinkProps, index: number) =>
        <HashLink url={url} key={`sidebar-link(${index})-${label}`}>
          <div 
            onClick={(e) => handlePageSelected(label, e)}
            className={`px-4 pr-8 sidebar-link ${currentPage == label ? 'sidebar-link-selected' : ''}`}
          >
            { label }
          </div>
        </HashLink>
      )}
    </div>
  );
}


// Styled Components
const Container = styled.div``;
